import { SessionProvider } from "next-auth/react";
import '@/styles/globals.scss';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ChakraProvider } from "@chakra-ui/react";
import Layout from "@/components/Layout";

const queryClient = new QueryClient();
export default function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <ChakraProvider>
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={session}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </SessionProvider>
    </QueryClientProvider>
    </ChakraProvider>
  );
}
