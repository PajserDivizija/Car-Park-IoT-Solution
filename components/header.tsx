import { Center, Container, Flex } from '@chakra-ui/layout';
import NextLink from 'next/link';
import NavLink from './navlink';

function Header() {
  return (
    <Center as='header' boxShadow='md' h={16}>
      <Container maxW='container.lg'>
        <Flex as='nav' gap={4}>
          <NextLink href='/' passHref>
            <NavLink>Početna</NavLink>
          </NextLink>
          <NextLink href='/projekt' passHref>
            <NavLink>Projekt</NavLink>
          </NextLink>
          <NextLink href='/tim' passHref>
            <NavLink>Tim</NavLink>
          </NextLink>
        </Flex>
      </Container>
    </Center>
  );
}

export default Header;
