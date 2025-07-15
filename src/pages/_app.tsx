import { FC, ReactNode } from 'react'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import ReactContextProvider from '@/providers/ReactContextProvider'
import XStateProvider from '@/providers/XStateProvider'
import Layout from '@/layout/Layout'

const useXState = process.env.NEXT_PUBLIC_XSTATE
const useZustand = process.env.NEXT_PUBLIC_ZUSTAND

// console.info(`Preview State Management Provider: ${useXState ? 'XState Machine' : 'React Context'}`)

interface ProvidersProps extends Partial<AppProps> {
	children: ReactNode
}

const Providers: FC<ProvidersProps> = ({ children, pageProps }) => {
	const noProviders = <>{children}</>

	return (
		<>
			{useZustand ? (
				noProviders
			) : useXState ? (
				<XStateProvider pageProps={pageProps}>{children}</XStateProvider>
			) : (
				<ReactContextProvider pageProps={pageProps}>
					{children}
				</ReactContextProvider>
			)}
		</>
	)
}

export default function App({ Component, pageProps }: AppProps) {
	return (
		<Layout>
			<Providers pageProps={pageProps}>
				<Component {...pageProps} />
			</Providers>
		</Layout>
	)
}
