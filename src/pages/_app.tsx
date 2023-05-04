import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { AppProvider } from '@/context/AppContext';
import Layout from '@/layout/Layout';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <AppProvider>
        <Component {...pageProps} />
      </AppProvider>
    </Layout>
  )
}
