import { Container, Flex } from '@chakra-ui/layout';
import Head from 'next/head';
import Header from './header';

function Layout({ children, title = 'Next.js with Auth0', ...rest }) {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>

      <Flex direction='column' minH='100vh'>
        <Header />

        <Container maxW='container.lg' flex={1} {...rest}>
          {children}
        </Container>
      </Flex>
    </>
  );
}

export default Layout;
