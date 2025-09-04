import { createConfig, http, WagmiProvider } from 'wagmi'
import { avalanche, avalancheFuji } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { injected } from 'wagmi/connectors'

const fujiRpc = import.meta.env.VITE_FUJI_RPC_URL || avalancheFuji.rpcUrls.default.http[0]
const mainnetRpc = import.meta.env.VITE_MAINNET_RPC_URL || avalanche.rpcUrls.default.http[0]

export const config = createConfig({
  chains: [avalancheFuji, avalanche],
  transports: {
    [avalancheFuji.id]: http(fujiRpc),
    [avalanche.id]: http(mainnetRpc),
  },
  connectors: [injected()],
  multiInjectedProviderDiscovery: true,
})

const queryClient = new QueryClient()

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}
