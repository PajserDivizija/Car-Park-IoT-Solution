import { Center, Container, Flex, Link } from '@chakra-ui/layout';
import NextLink from 'next/link';

function Header({ user, loading }) {
  return (
    <Center as='header' boxShadow='md' h={16}>
      <Container maxW='container.lg'>
        <Flex as='nav' gap={4}>
          <NextLink href='/'>
            <Link>Početna</Link>
          </NextLink>
          <NextLink href='/tim'>
            <Link>Tim</Link>
          </NextLink>
        </Flex>
      </Container>
    </Center>
  );
}

export default Header;
