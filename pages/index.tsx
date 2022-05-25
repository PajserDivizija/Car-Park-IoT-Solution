import { AWSIoTProvider } from '@aws-amplify/pubsub/lib/Providers';
import '@aws-amplify/ui/dist/style.css';
import {
  Center,
  Spinner,
  Stat,
  StatGroup,
  StatHelpText,
  StatLabel,
  StatNumber,
  useBoolean,
} from '@chakra-ui/react';
import { Amplify, Auth, PubSub } from 'aws-amplify';
import { Button, withAuthenticator } from 'aws-amplify-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import Layout from '../components/layout';
import awsConfig from '../src/aws-exports';

Amplify.configure({ ...awsConfig, ssr: true });
Auth.configure(awsConfig);

const iotEspShadow = {
  get: '$aws/things/dev-esp8266/shadow/name/iot-esp-shadow/get',
  getAccepted: '$aws/things/dev-esp8266/shadow/name/iot-esp-shadow/get/accepted',
  getRejected: '$aws/things/dev-esp8266/shadow/name/iot-esp-shadow/get/rejected',
  update: '$aws/things/dev-esp8266/shadow/name/iot-esp-shadow/update',
  updateAccepted: '$aws/things/dev-esp8266/shadow/name/iot-esp-shadow/update/accepted',
  updateRejected: '$aws/things/dev-esp8266/shadow/name/iot-esp-shadow/update/rejected',
};

// Apply plugin with configuration
Amplify.addPluggable(
  new AWSIoTProvider({
    aws_pubsub_region: 'us-east-1',
    aws_pubsub_endpoint: 'wss://a2016qudzca8cj-ats.iot.us-east-1.amazonaws.com/mqtt',
  })
);

function App() {
  const [isLoading, { on, off }] = useBoolean();
  const [state, setState] = useState<{ led: number; sensor: number } | null>(null);

  useEffect(() => {
    const subscription = PubSub.subscribe([
      iotEspShadow.getAccepted,
      iotEspShadow.updateAccepted,
    ]).subscribe({
      next: ({ value }) => {
        setState({
          led: Number(value.state.reported.led),
          sensor: Number(value.state.reported.senzor),
        });
        off();
      },
      error: (error) => console.error(error),
      complete: () => console.log('Done'),
    });

    return () => {
      console.log('unmount');
      subscription.unsubscribe();
    };
  }, [off]);

  const revalidateData = () => {
    PubSub.publish(iotEspShadow.get, Math.random());
    on();
  };

  if (isLoading) {
    return (
      <Layout>
        <Center my={8}>
          <Spinner />
        </Center>
      </Layout>
    );
  }

  if (!state) {
    return (
      <Layout>
        <Center my={8}>
          <Button onClick={revalidateData}>Fetch data</Button>
        </Center>
      </Layout>
    );
  }

  return (
    <Layout>
      <StatGroup my={8}>
        <Stat>
          <StatLabel>Led</StatLabel>

          <StatNumber>{state.led}</StatNumber>

          <StatHelpText>Parking rezerviran?</StatHelpText>
        </Stat>

        <Stat>
          <StatLabel>Senzor</StatLabel>
          <StatNumber>{state.sensor}</StatNumber>
          <StatHelpText>Parking zauzet?</StatHelpText>
        </Stat>
      </StatGroup>
    </Layout>
  );
}

export default withAuthenticator(App, true);
