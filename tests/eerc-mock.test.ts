// TODO: Enable and run with Vitest once the test runner is added.
// This test validates the behavior of the mock EERC used while circuits are not available.
// Install when ready:
//   npm i -D vitest @types/node
//   Add script: "test": "vitest"
// Then run: npm run test

import { describe, it, expect } from 'vitest'
import { __createEercMockForTests } from '../src/features/eerc/eerc-mock'

describe('EERC mock', () => {
  it('register toggles isRegistered and returns tx hash', async () => {
    const mock = __createEercMockForTests()
    expect(mock.isRegistered).toBe(false)
    const res = await mock.register()
    expect(res.transactionHash).toBe('0xregtx')
    expect(mock.isRegistered).toBe(true)
  })

  it('deposit increases balance; withdraw decreases; transfer returns tx', async () => {
    const mock = __createEercMockForTests()
    const bal = mock.useEncryptedBalance()
    expect(bal.parsedDecryptedBalance).toBe('0')
    await bal.deposit(5n)
    const bal2 = mock.useEncryptedBalance()
    expect(bal2.parsedDecryptedBalance).toBe('5')
    await bal2.withdraw(3n)
    const bal3 = mock.useEncryptedBalance()
    expect(bal3.parsedDecryptedBalance).toBe('2')
    const tx = await bal3.privateTransfer('0x0000000000000000000000000000000000000000', 1n)
    expect(tx.transactionHash).toBeTypeOf('string')
  })
})
