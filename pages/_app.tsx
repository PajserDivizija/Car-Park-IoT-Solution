import { ChakraProvider, extendTheme, withDefaultColorScheme } from '@chakra-ui/react';
import { SWRConfig } from 'swr';

const customTheme = extendTheme(withDefaultColorScheme({ colorScheme: 'teal' }));

const fetcher = (...args: Parameters<typeof fetch>) =>
  fetch(...args).then(async (res) => (res.ok ? res.json() : Promise.reject(await res.json())));

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider theme={customTheme} resetCSS>
      <SWRConfig value={{ fetcher }}>
        <Component {...pageProps} />
      </SWRConfig>
    </ChakraProvider>
  );
}

export default MyApp;
