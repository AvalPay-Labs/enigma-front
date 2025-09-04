// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

vi.mock('../../../src/features/eerc/use-eerc-client', () => {
  const mock = {
    isRegistered: false,
    isDecryptionKeySet: false,
    register: vi.fn(async () => ({ key: '0xmock', transactionHash: '0xregtx' })),
    generateDecryptionKey: vi.fn(async () => '0xkey'),
    useEncryptedBalance: vi.fn(() => ({
      parsedDecryptedBalance: '0',
      refetchBalance: vi.fn(),
      privateTransfer: vi.fn(async () => ({ transactionHash: '0xtranstx', receiverEncryptedAmount: [], senderEncryptedAmount: [] })),
      deposit: vi.fn(async () => ({ transactionHash: '0xdeptx' })),
      withdraw: vi.fn(async () => ({ transactionHash: '0xwithtx' })),
    })),
  }
  return { useEERC: () => mock }
})

vi.mock('wagmi', async () => {
  return {
    useAccount: () => ({ address: '0x0000000000000000000000000000000000000000', isConnected: true }),
    useConnect: () => ({ connect: () => {}, isPending: false }),
    useDisconnect: () => ({ disconnect: () => {} }),
  }
})

import EercDemo from '../../../src/features/eerc/eerc-demo'

describe('EercDemo (converter UI)', () => {
  it('shows Register and indicates success after clicking', async () => {
    render(<EercDemo />)
    const btn = await screen.findByRole('button', { name: /register/i })
    await userEvent.click(btn)
    // Eventually shows success
    const ok = await screen.findByText(/Registered ✓/i)
    expect(ok).toBeInTheDocument()
    // Shows Generate Key when decryption key is not set
    expect(await screen.findByRole('button', { name: /Generate Decryption Key/i })).toBeInTheDocument()
  })

  it('renders converter buttons', async () => {
    render(<EercDemo />)
    expect(await screen.findByPlaceholderText(/Token address/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Approve/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Self-Transfer 1/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Deposit 1/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Withdraw 1/i })).toBeInTheDocument()
  })
})

