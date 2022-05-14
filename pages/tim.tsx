import { Heading } from '@chakra-ui/layout';
import { Table, TableContainer, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/table';
import Layout from '../components/layout';
import { useFetchUser } from '../lib/user';

function Home() {
  const { user, loading } = useFetchUser();

  return (
    <Layout user={user} loading={loading}>
      <Heading my={8}>Tim</Heading>

      <TableContainer>
        <Table variant='striped'>
          <Thead>
            <Tr>
              <Th>Ime</Th>
              <Th>Prezime</Th>
              <Th>Podtim</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>Lucija</Td>
              <Td>Strejček</Td>
              <Td>aplikacija</Td>
            </Tr>
            <Tr>
              <Td>Kristian</Td>
              <Td>Djaković</Td>
              <Td>aplikacija</Td>
            </Tr>
            <Tr>
              <Td>Lovro</Td>
              <Td>Stipanović</Td>
              <Td>uređaj</Td>
            </Tr>
            <Tr>
              <Td>Filip</Td>
              <Td>Konić</Td>
              <Td>uređaj</Td>
            </Tr>
            <Tr>
              <Td>Luka</Td>
              <Td>Pranjić</Td>
              <Td>platforma</Td>
            </Tr>
            <Tr>
              <Td>Matija</Td>
              <Td>Holik</Td>
              <Td>platforma</Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
    </Layout>
  );
}

export default Home;
