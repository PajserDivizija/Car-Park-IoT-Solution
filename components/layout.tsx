import { Box, Container, Flex } from '@chakra-ui/layout';
import Head from 'next/head';
import Header from './header';

function Layout({ user, loading = false, children, title = 'Next.js with Auth0' }) {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>

      <Flex direction='column' minH='100vh'>
        <Header user={user} loading={loading} />

        <Container maxW='container.lg' flex={1}>
          {children}
        </Container>
      </Flex>
    </>
  );
}

export default Layout;
