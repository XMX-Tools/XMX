import { WagmiProvider } from 'wagmi'
import { http, createConfig } from '@wagmi/core'
import { CHAINS } from '../config/chains'
import { ReactNode, useEffect, useState } from 'react'
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'

interface Props {
  children: ReactNode
}

export const wagmiConfig = createConfig({
  chains: [...CHAINS] as any,
  transports: {
    [CHAINS[0].id]: http(''),
  },
})

const config = getDefaultConfig({
  appName: 'My RainbowKit App',
  projectId: 'YOUR_PROJECT_ID',
  chains: [...CHAINS] as any,
  ssr: true, // If your dApp uses server side rendering (SSR)
})

export function Web3Provider(props: Props) {
  const [ready, setReady] = useState(false)
  const queryClient = new QueryClient()

  useEffect(() => {
    setReady(true)
  }, [])

  return (
    <>
      {ready && (
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <RainbowKitProvider>{props.children}</RainbowKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
      )}
    </>
  )
}
