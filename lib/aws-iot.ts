import { iot, mqtt } from 'aws-crt';

function buildDirectMqttConnection() {
  let config_builder = iot.AwsIotMqttConnectionConfigBuilder.new_mtls_builder(
    process.env.AWS_IOT_CERT,
    process.env.AWS_IOT_KEY
  );

  if (process.env.AWS_IOT_CA) {
    config_builder.with_certificate_authority(process.env.AWS_IOT_CA);
  }

  config_builder.with_clean_session(false);
  config_builder.with_client_id(
    process.env.AWS_IOT_CLIENT_ID ?? 'test-' + Math.floor(Math.random() * 100000000)
  );
  config_builder.with_endpoint(process.env.AWS_IOT_ENDPOINT);
  const config = config_builder.build();

  const client = new mqtt.MqttClient();
  return client.new_connection(config);
}

let connection: ReturnType<typeof buildDirectMqttConnection>;
export function getMqttConnection() {
  if (!connection) {
    connection = buildDirectMqttConnection();
  }

  return connection;
}

export async function withMqttConnection(fn: () => Promise<void>) {
  await getMqttConnection().connect();
  await fn();
  await getMqttConnection().disconnect();
}
