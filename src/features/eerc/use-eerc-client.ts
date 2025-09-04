import { useMemo, useState } from 'react'
import { usePublicClient, useWalletClient } from 'wagmi'
import * as EercSdk from '@avalabs/eerc-sdk'
import { useEercMock } from './eerc-mock'

// Helper to resolve circuit URLs from env with sensible defaults.
function getCircuitURLs() {
  const base = import.meta.env.VITE_EERC_CIRCUIT_BASE_URL || '/circuits'
  const resolve = (name: string) => ({
    wasm: import.meta.env[`VITE_CIRCUIT_${name.toUpperCase()}_WASM_URL` as any] || `${base}/${name}/${name}.wasm`,
    zkey: import.meta.env[`VITE_CIRCUIT_${name.toUpperCase()}_ZKEY_URL` as any] || `${base}/${name}/${name}.zkey`,
  })

  return {
    register: resolve('register'),
    transfer: resolve('transfer'),
    mint: resolve('mint'),
    withdraw: resolve('withdraw'),
    burn: resolve('burn'),
  }
}

// Hook wrapper that safely initializes the SDK hook when wagmi clients are ready.
export function useEERC() {
  const publicClient = usePublicClient()
  const { data: walletClient } = useWalletClient()

  const contractAddress = (import.meta as any).env.VITE_EERC_CONTRACT_ADDRESS as string | undefined
  const circuitURLs = useMemo(getCircuitURLs, [])
  const mockEnabled = String((import.meta as any).env.VITE_EERC_MOCK || '') === '1'
  // Decide once on first render to avoid switching hook implementations mid‑session (prevents hook order changes).
  const [useMock] = useState(() => mockEnabled || !((EercSdk as any)?.useEERC && publicClient && walletClient && contractAddress))

  // If SDK hook is not available (older/newer versions), return undefined to keep the demo resilient.
  const sdkUseEERC = (EercSdk as any)?.useEERC

  // Fallback to mock if explicitly enabled or required deps are missing
  if (useMock || mockEnabled || !sdkUseEERC || !publicClient || !walletClient || !contractAddress) {
    // TODO: Replace mock with real SDK once circuits/addresses are finalized.
    return useEercMock()
  }

  try {
    return sdkUseEERC(publicClient, walletClient, contractAddress, circuitURLs)
  } catch (e) {
    // As a safety net, fallback to mock to keep UI stable.
    console.warn('Failed to initialize eERC SDK hook, falling back to mock:', e)
    return useEercMock()
  }
}
// mock lives in './eerc-mock'
