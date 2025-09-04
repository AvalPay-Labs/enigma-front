import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { useEERC } from './use-eerc-client'
import { writeContract, readContract } from 'wagmi/actions'
import { config as wagmiConfig } from '../../lib/wagmi'
import { erc20Abi } from './erc20-abi'
import { useState } from 'react'

export default function EercDemo() {
  const { address, isConnected } = useAccount()
  const { connect, isPending } = useConnect()
  const { disconnect } = useDisconnect()


  const eerc: any = useEERC?.() ?? {}
  // The SDK exposes balance operations off the eerc object: eerc.useEncryptedBalance(tokenAddress?)
  const [tokenAddress, setTokenAddress] = useState<string>('')
  const encrypted: any = eerc?.useEncryptedBalance?.(tokenAddress || undefined) ?? {}

  const [regLoading, setRegLoading] = useState(false)
  const [regTx, setRegTx] = useState<string | null>(null)
  const [regError, setRegError] = useState<string | null>(null)
  const [keyLoading, setKeyLoading] = useState(false)
  const [keyOk, setKeyOk] = useState<string | null>(null)
  const [approveLoading, setApproveLoading] = useState(false)
  const [approveOk, setApproveOk] = useState<string | null>(null)
  const [approveErr, setApproveErr] = useState<string | null>(null)

  return (
    <section style={{ marginTop: 24 }}>
      {!isConnected ? (
        <button onClick={() => connect({ connector: injected() })} disabled={isPending}>
          {isPending ? 'Connecting…' : 'Connect Wallet'}
        </button>
      ) : (
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <span>Connected: {address}</span>
          <button onClick={() => disconnect()}>Disconnect</button>
        </div>
      )}

      <div style={{ marginTop: 16 }}>
        <strong>Registration</strong>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span>Status: {String(eerc?.isRegistered ?? 'unknown')}</span>
          {isConnected && eerc?.register && (
            <button
              onClick={async () => {
                try {
                  setRegLoading(true)
                  setRegError(null)
                  const res = await eerc.register()
                  setRegTx(res?.transactionHash ?? null)
                } catch (err: any) {
                  setRegError(err?.message ?? 'Registration failed')
                } finally {
                  setRegLoading(false)
                }
              }}
              disabled={regLoading}
            >
              {regLoading ? 'Registering…' : 'Register'}
            </button>
          )}
          {regTx && (
            <span style={{ color: 'green' }}>Registered ✓ tx: {regTx.slice(0, 10)}…</span>
          )}
          {regError && (
            <span style={{ color: 'crimson' }}>Error: {regError}</span>
          )}
        </div>
        {!eerc?.isDecryptionKeySet && eerc?.generateDecryptionKey && (
          <div style={{ marginTop: 8, display: 'flex', gap: 8, alignItems: 'center' }}>
            <button
              onClick={async () => {
                try {
                  setKeyLoading(true)
                  const k = await eerc.generateDecryptionKey()
                  setKeyOk(String(k))
                } finally {
                  setKeyLoading(false)
                }
              }}
              disabled={keyLoading}
            >
              {keyLoading ? 'Generating key…' : 'Generate Decryption Key'}
            </button>
            {keyOk && <span style={{ color: 'green' }}>Key set ✓</span>}
          </div>
        )}
      </div>

      <div style={{ marginTop: 16 }}>
        <strong>Encrypted Balance</strong>
        <div>
          <div>decrypted: {String(encrypted?.parsedDecryptedBalance ?? '—')}</div>
          {encrypted?.refetchBalance && (
            <button onClick={() => encrypted.refetchBalance()}>Refresh</button>
          )}
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <strong>Converter Actions</strong>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            placeholder="Token address (ERC20)"
            value={tokenAddress}
            onChange={(e) => setTokenAddress(e.target.value)}
            style={{ minWidth: 340 }}
          />
          <button
            onClick={async () => {
              if (!address || !tokenAddress) return
              try {
                setApproveLoading(true)
                setApproveErr(null)
                const spender = (import.meta as any).env.VITE_EERC_CONTRACT_ADDRESS as `0x${string}`
                const allowance: bigint = await readContract(wagmiConfig, {
                  abi: erc20Abi as any,
                  address: tokenAddress as `0x${string}`,
                  functionName: 'allowance',
                  args: [address as `0x${string}`, spender],
                }) as any
                if (allowance > 0n) {
                  setApproveOk('already-approved')
                } else {
                  const hash = await writeContract(wagmiConfig, {
                    abi: erc20Abi as any,
                    address: tokenAddress as `0x${string}`,
                    functionName: 'approve',
                    args: [spender, 2n ** 256n - 1n],
                  })
                  setApproveOk(String(hash))
                }
              } catch (err: any) {
                setApproveErr(err?.message ?? 'Approve failed')
              } finally {
                setApproveLoading(false)
              }
            }}
            disabled={!address || !tokenAddress || approveLoading}
          >
            {approveLoading ? 'Approving…' : 'Approve'}
          </button>
          {approveOk && <span style={{ color: 'green' }}>Approve ✓</span>}
          {approveErr && <span style={{ color: 'crimson' }}>Error: {approveErr}</span>}
          {/* Converter supports private transfer, deposit, withdraw. */}
          {encrypted?.privateTransfer && address && (
            <button onClick={() => encrypted.privateTransfer(address as `0x${string}`, 1n)}>Self-Transfer 1</button>
          )}
          {encrypted?.deposit && (
            <button onClick={() => encrypted.deposit(1n)}>Deposit 1</button>
          )}
          {encrypted?.withdraw && (
            <button onClick={() => encrypted.withdraw(1n)}>Withdraw 1</button>
          )}
        </div>
      </div>

      <p style={{ marginTop: 12, fontSize: 12, opacity: 0.8 }}>
        Refer to docs in <code>docs/</code> for full flows: registration, deposit, transfer, withdraw, and balance decryption.
      </p>
    </section>
  )
}
