import { ChakraProvider, extendTheme, withDefaultColorScheme } from '@chakra-ui/react';

const customTheme = extendTheme(withDefaultColorScheme({ colorScheme: 'teal' }));

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider theme={customTheme} resetCSS>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;
