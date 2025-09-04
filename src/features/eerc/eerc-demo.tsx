import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { useEERC } from './use-eerc-client'
import { useState } from 'react'

export default function EercDemo() {
  const { address, isConnected } = useAccount()
  const { connect, isPending } = useConnect()
  const { disconnect } = useDisconnect()


  const eerc: any = useEERC?.() ?? {}
  // The SDK exposes balance operations off the eerc object: eerc.useEncryptedBalance(tokenAddress?)
  const encrypted: any = eerc?.useEncryptedBalance?.() ?? {}

  const [regLoading, setRegLoading] = useState(false)
  const [regTx, setRegTx] = useState<string | null>(null)
  const [regError, setRegError] = useState<string | null>(null)

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
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
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
