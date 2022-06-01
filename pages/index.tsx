import { AWSIoTProvider } from '@aws-amplify/pubsub/lib/Providers';
import '@aws-amplify/ui/dist/style.css';
import {
  Button,
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
import { withAuthenticator } from 'aws-amplify-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import Layout from '../components/layout';
import awsConfig from '../src/aws-exports';

Amplify.configure({ ...awsConfig, ssr: true });
Auth.configure(awsConfig);

const iotEspShadowBase = '$aws/things/esp-8266-v2/shadow';

const iotEspShadow = {
  get: `${iotEspShadowBase}/get`,
  getAccepted: `${iotEspShadowBase}/get/accepted`,
  getRejected: `${iotEspShadowBase}/get/rejected`,
  update: `${iotEspShadowBase}/update`,
  updateAccepted: `${iotEspShadowBase}/update/accepted`,
  updateRejected: `${iotEspShadowBase}/update/rejected`,
};

// Apply plugin with configuration
Amplify.addPluggable(
  new AWSIoTProvider({
    aws_pubsub_region: 'us-east-1',
    aws_pubsub_endpoint: 'wss://a2016qudzca8cj-ats.iot.us-east-1.amazonaws.com/mqtt',
  })
);

interface shadowData {
  state: {
    desired: {
      led: string;
      senzor: string;
      id: string;
    };
    reported: {
      led: '0' | '1';
      senzor: 'slobodno' | 'zauzeto';
      id: 'P01R02S06';
    };
  };
}

function App() {
  const [isLoading, { on, off }] = useBoolean();
  const [isUpdating, updatingHandlers] = useBoolean();
  const [state, setState] = useState<shadowData['state']['reported'] | null>(null);

  useEffect(() => {
    const subscription = PubSub.subscribe([iotEspShadow.getAccepted]).subscribe({
      next: ({ value }: { value: shadowData }) => {
        const newValue = value.state.reported;

        setState((prevValue) => {
          if (!prevValue) {
            return newValue;
          }

          if (prevValue.led !== newValue.led) {
            return newValue;
          }

          if (prevValue.senzor !== newValue.senzor) {
            return newValue;
          }

          return prevValue;
        });
      },
      error: (error) => console.error(error),
      complete: () => console.log('Done'),
    });

    return () => {
      console.log('unmount');
      subscription.unsubscribe();
    };
  }, [off]);

  useEffect(() => {
    if (state) {
      off();
      updatingHandlers.off();
    }
  }, [off, state, updatingHandlers]);

  const revalidateData = () => {
    PubSub.publish(iotEspShadow.get, Math.random());
    on();
  };

  const handleReservation = () => {
    if (state.led === '0' && state.senzor === 'slobodno') {
      updatingHandlers.on();
      PubSub.publish(iotEspShadow.update, { state: { desired: { led: '1' } } });
    } else if (state.led === '1') {
      updatingHandlers.on();
      PubSub.publish(iotEspShadow.update, { state: { desired: { led: '0' } } });
    }
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
          <StatNumber>{state.senzor}</StatNumber>
          <StatHelpText>Status parkinga</StatHelpText>
        </Stat>
      </StatGroup>

      {state.led === '0' && (
        <Button
          onClick={handleReservation}
          isLoading={isUpdating}
          isDisabled={state.senzor === 'zauzeto'}
        >
          Rezerviraj
        </Button>
      )}
      {state.led === '1' && (
        <Button onClick={handleReservation} isLoading={isUpdating}>
          Otkaži rezervaciju
        </Button>
      )}
    </Layout>
  );
}

export default withAuthenticator(App, true);
