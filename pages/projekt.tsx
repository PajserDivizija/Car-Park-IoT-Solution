import { Heading, Text, VStack } from '@chakra-ui/layout';
import Layout from '../components/layout';
import { useFetchUser } from '../lib/user';

function About() {
  const { user, loading } = useFetchUser();

  return (
    <Layout user={user} loading={loading}>
      <Heading my={8}>Projekt</Heading>

      <VStack align='flex-start' spacing={3}>
        <Text fontSize='xl'>
          <strong>Ime grupe:</strong> Nanonio
        </Text>
        <Text fontSize='xl'>
          <strong>Tema:</strong> Nadzor i rezervacija parkirnih mjesta
        </Text>
        <Text fontSize='xl'>
          <strong>Opis:</strong> Cilj je razviti IoT sustav za nadzor i rezervaciju parkirališta s
          korisničkom aplikacijom koja omogućuje uvid u stanje parkirališta te rezerviranje
          slobodnog mjesta. Praćenje stanja radilo bi se ultrazvučnim senzorima povezanim na ESP8266
          mikrokontroler koji bi bili ugrađeni na parkirno mjesto (u asfalt ukoliko je moguće, a iza
          ili iznad mjesta ako nije), a signaliziranje zauzetog mjesta na adekvatan način.
          Mikrokontroleri bi se direktno spajali na internet i upravljali preko AWS IoT iz oblaka.
        </Text>
      </VStack>
    </Layout>
  );
}

export default About;
