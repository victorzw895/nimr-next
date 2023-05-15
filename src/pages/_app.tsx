import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { AppProvider } from '@/context/AppContext';
import Layout from '@/layout/Layout';

export default function App({ Component, pageProps }: AppProps) {
  const value = {
    seasonYears: pageProps.seasonYears,
  }

  return (
    <Layout>
      <AppProvider value={value}>
        <Component {...pageProps} />
      </AppProvider>
    </Layout>
  )
}
