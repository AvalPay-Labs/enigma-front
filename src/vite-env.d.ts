/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_NETWORK: string
  readonly VITE_FUJI_RPC_URL: string
  readonly VITE_MAINNET_RPC_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
