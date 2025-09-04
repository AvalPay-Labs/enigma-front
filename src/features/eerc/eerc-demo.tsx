import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { useEERC, useEncryptedBalance } from './use-eerc-client'

export default function EercDemo() {
  const { address, isConnected } = useAccount()
  const { connect, isPending } = useConnect()
  const { disconnect } = useDisconnect()


  const eerc: any = useEERC?.() ?? {}
  const encrypted: any = useEncryptedBalance?.(address) ?? {}

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
            <button onClick={() => eerc.register()}>Register</button>
          )}
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <strong>Encrypted Balance</strong>
        <div>
          <div>value: {String(encrypted?.balance ?? '—')}</div>
          {encrypted?.refetch && (
            <button onClick={() => encrypted.refetch()}>Refresh</button>
          )}
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <strong>Actions</strong>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {eerc?.mint && (
            <button onClick={() => eerc.mint(1)}>Mint 1</button>
          )}
          {eerc?.burn && (
            <button onClick={() => eerc.burn(1)}>Burn 1</button>
          )}
          {eerc?.transfer && (
            <button
              onClick={() =>
                eerc.transfer({ to: address, amount: 1 })
              }
            >
              Self-Transfer 1
            </button>
          )}
        </div>
      </div>

      <p style={{ marginTop: 12, fontSize: 12, opacity: 0.8 }}>
        Refer to docs in <code>docs/</code> for full flows: registration, deposit, transfer, withdraw, and balance decryption.
      </p>
    </section>
  )
}

