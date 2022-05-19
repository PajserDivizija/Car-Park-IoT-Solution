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
import useSWR from 'swr';
import Layout from '../components/layout';

function Home() {
  const { data: reservationRes, mutate } = useSWR('/api/v1/reservation');
  const { data: sensorRes } = useSWR('/api/v1/sensor');

  const reserve = useCallbackRef(() => {
    const oldValue = reservationRes?.data.reserved;
    const newValue = !oldValue;
    mutate({ data: { reserved: newValue } }, false);

    fetch('/api/v1/reservation', {
      method: 'POST',
      body: JSON.stringify({ reserved: newValue }),
    }).then((res) => {
      !res.ok && mutate({ data: { reserved: oldValue } }, false);
    });
  });

  const arrived = useCallbackRef(() => {
    alert('Super, oceš 5?');
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
    </Layout>
  );
}

export default Home;
