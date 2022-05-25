import {
  Button,
  HStack,
  Spinner,
  Stat,
  StatGroup,
  StatHelpText,
  StatLabel,
  StatNumber,
  useCallbackRef,
} from '@chakra-ui/react';
import AWS, { CognitoIdentityCredentials } from 'aws-sdk';
import v4 from 'aws-signature-v4';
import { decodeJwt } from 'jose';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import useSWR from 'swr';
import Layout from '../components/layout';

function Home() {
  // const swr = useSWR('/api/v1/iot');
  const { data: reservationRes, mutate: mutateReservation } = useSWR('/api/v1/reservation');
  const { data: sensorRes, mutate: mutateSensor } = useSWR('/api/v1/sensor');

  const router = useRouter();

  const { id_token } = router.query;

  const reserve = useCallbackRef(() => {
    const oldValue = reservationRes?.data.reserved;
    const newValue = !oldValue;
    mutateReservation({ data: { reserved: newValue } }, false);

    fetch('/api/v1/reservation', {
      method: 'POST',
      body: JSON.stringify({ reserved: newValue }),
    }).then((res) => {
      !res.ok && mutateReservation({ data: { reserved: oldValue } }, false);
    });
  });

  const arrived = useCallbackRef(() => {
    mutateReservation({ data: { reserved: false } }, false);
    mutateSensor({ data: { sensor: true } }, false);

    fetch('/api/v1/reservation', {
      method: 'PATCH',
    });
  });

  // useEffect(() => {
  //   const iam = new AWS.IAM({ apiVersion: '2010-05-08' });

  //   iam.getPolicy(
  //     {
  //       PolicyArn: 'arn:aws:iot:us-east-1:184396859566:policy/iot-dev-policy-test',
  //     },
  //     function (err, data) {
  //       if (err) {
  //         console.log('Error', err);
  //       } else {
  //         console.log('Success', data);
  //       }
  //     }
  //   );
  // }, []);

  useEffect(() => {
    if (!id_token) {
      return;
    }

    console.log({ token: decodeJwt(id_token as string) });

    AWS.config.region = 'us-east-1';
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: 'us-east-1:c89304ad-1ece-4f83-b941-5f3f1879d3b4',
      Logins: {
        'cognito-idp.us-east-1.amazonaws.com/us-east-1_zhXFxqQvi': id_token as string,
      },
    });

    // (AWS.config.credentials as CognitoIdentityCredentials).get(function (err) {
    //   if (err) {
    //     console.log('Error: ' + err);
    //     return;
    //   }
    //   // console.log(
    //   //   'Cognito Identity Id: ' + (AWS.config.credentials as CognitoIdentityCredentials).identityId
    //   // );

    //   // (new AWS.CognitoIdentity()).getId({})

    //   // (AWS.config.credentials as CognitoIdentityCredentials).accessKeyId;

    //   // Other service clients will automatically use the Cognito Credentials provider
    //   // configured in the JavaScript SDK.
    //   // var cognitoSyncClient = new AWS.CognitoSync();
    //   // cognitoSyncClient.listDatasets(
    //   //   {
    //   //     IdentityId: (AWS.config.credentials as CognitoIdentityCredentials).identityId,
    //   //     IdentityPoolId: 'us-east-1:c89304ad-1ece-4f83-b941-5f3f1879d3b4',
    //   //   },
    //   //   function (err, data) {
    //   //     if (!err) {
    //   //       console.log(JSON.stringify(data));
    //   //     }
    //   //   }
    //   // );
    // });

    (AWS.config.credentials as CognitoIdentityCredentials).get(function (err) {
      if (err) {
        console.log({ err });
        return;
      }

      // new IotShadowClient(new mqtt.MqttClientConnection());

      const url = v4.createPresignedURL(
        'GET',
        process.env.IOT_ENDPOINT_HOST.toLowerCase(),
        '/mqtt',
        'iotdevicegateway',
        // crypto.createHash('sha256').update('', 'utf8').digest('hex'),
        CryptoJS.SHA256(''),
        {
          key: (AWS.config.credentials as CognitoIdentityCredentials).accessKeyId,
          secret: (AWS.config.credentials as CognitoIdentityCredentials).secretAccessKey,
          protocol: 'wss',
          region: 'us-east-1',
        }
      );

      console.log({ url });

      const awsIotData = new AWS.IotData({
        apiVersion: '2015-05-28',
        endpoint: 'a2016qudzca8cj-ats.iot.us-east-1.amazonaws.com',
        region: 'us-east-1',
      });

      // awsIotData.getThingShadow(
      //   {
      //     thingName: 'dev-esp8266',
      //     shadowName: 'iot-esp-shadow',
      //   },
      //   function (err, data) {
      //     if (err) console.log(err, err.stack); // an error occurred
      //     else console.log({ data }); // successful response
      //   }
      // );

      var iot = new AWS.Iot({
        apiVersion: '2015-05-28',
        endpoint: 'a2016qudzca8cj-ats.iot.us-east-1.amazonaws.com',
      });

      iot.attachPolicy({
        policyName: 'iot-all',
        target: (AWS.config.credentials as CognitoIdentityCredentials).identityId,
      });

      // SigV4Utils

      v4;

      iot.listThingTypes({}, function (err, data) {
        if (err) {
          console.log({ err });
          return;
        }
        console.log('List things data: ' + { data });
      });
    });

    // awsIotData.getThingShadow(
    //   {
    //     thingName: 'dev-esp8266',
    //     shadowName: 'iot-esp-shadow',
    //   },
    //   function (err, data) {
    //     if (err) console.log(err, err.stack); // an error occurred
    //     else console.log(data); // successful response
    //   }
    // );
  }, [id_token]);

  const speakTextRef = useCallbackRef(function speakText() {
    // AWS.config.region = 'us-east-1';
    // AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    //   // IdentityPoolId: 'us-east-1:e07e2ae9-fd38-42ff-a6f3-9a3965065940', // ja
    //   IdentityPoolId: 'us-east-1:c89304ad-1ece-4f83-b941-5f3f1879d3b4', // iot
    // });
    // const cognitoIdentity = new AWS.CognitoIdentityServiceProvider();
    // cognitoIdentity.createIdentityPool(params, function (err, data) {
    //   if (err) console.log(err, err.stack); // an error occurred
    //   else console.log(data); // successful response
    // });
    // var speechParams = {
    //   OutputFormat: 'mp3',
    //   SampleRate: '16000',
    //   Text: '',
    //   TextType: 'text',
    //   VoiceId: 'Matthew',
    // };
    // speechParams.Text = document.getElementById('textEntry').value;
    // // Create the Polly service object and presigner object
    // var polly = new AWS.Polly({ apiVersion: '2016-06-10' });
    // var signer = new AWS.Polly.Presigner(speechParams, polly);
    // // Create presigned URL of synthesized speech file
    // signer.getSynthesizeSpeechUrl(speechParams, function (error, url) {
    //   if (error) {
    //     document.getElementById('result').innerHTML = error;
    //   } else {
    //     document.getElementById('audioSource').src = url;
    //     document.getElementById('audioPlayback').load();
    //     document.getElementById('result').innerHTML = 'Speech ready to play.';
    //   }
    // });
  });

  return (
    <Layout py={4}>
      <StatGroup>
        <Stat>
          <StatLabel>Led</StatLabel>
          {reservationRes ? (
            <StatNumber>{reservationRes.data.reserved ? 'Da' : 'Ne'}</StatNumber>
          ) : (
            <StatNumber>
              <Spinner />
            </StatNumber>
          )}
          <StatHelpText>Parking rezerviran?</StatHelpText>
        </Stat>

        <Stat>
          <StatLabel>Senzor</StatLabel>
          {sensorRes ? (
            <StatNumber>{sensorRes.data.sensor ? 'Da' : 'Ne'}</StatNumber>
          ) : (
            <StatNumber>
              <Spinner />
            </StatNumber>
          )}
          <StatHelpText>Vozilo parkirano?</StatHelpText>
        </Stat>
      </StatGroup>

      <HStack>
        <Button onClick={reserve}>
          {reservationRes?.data.reserved ? 'Otkaži rezervaciju' : 'Rezerviraj parking'}
        </Button>
        <Button onClick={arrived}>Stigao sam</Button>
      </HStack>

      {/* <Box mt={4}>
        <div id='textToSynth'>
          <HStack>
            <Input type='text' id='textEntry' defaultValue="It's very good to meet you." />
            <Button onClick={speakTextRef}>Synthesize</Button>
          </HStack>
          <p id='result'>Enter text above then click Synthesize</p>
        </div>
        <audio id='audioPlayback' controls>
          <source id='audioSource' type='audio/mp3' src='' />
        </audio>
      </Box> */}
    </Layout>
  );
}

export default Home;
