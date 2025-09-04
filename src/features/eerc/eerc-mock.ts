// TODO: Remove this mock when final circuits and endpoints are available.
import { useCallback, useState } from 'react'

type MockTx = { transactionHash: `0x${string}` }

export function __createEercMockForTests() {
  let isRegistered = false
  let balance = 0n
  return {
    get isRegistered() {
      return isRegistered
    },
    // Converter context
    isConverter: true,
    async register() {
      isRegistered = true
      return { key: '0xmock', transactionHash: '0xregtx' } as const
    },
    useEncryptedBalance() {
      const parsedDecryptedBalance = balance.toString()
      const res = {
        decryptedBalance: balance,
        parsedDecryptedBalance,
        encryptedBalance: [] as bigint[],
        auditorPublicKey: [] as bigint[],
        decimals: 18n,
        async privateTransfer(_to: string, _amount: bigint): Promise<{ transactionHash: `0x${string}`; receiverEncryptedAmount: string[]; senderEncryptedAmount: string[] }> {
          // self-transfer no-op in mock
          return { transactionHash: '0xtranstx' as `0x${string}`, receiverEncryptedAmount: [], senderEncryptedAmount: [] }
        },
        async withdraw(amount: bigint): Promise<MockTx> {
          balance = balance >= amount ? balance - amount : 0n
          return { transactionHash: '0xwithtx' as `0x${string}` }
        },
        async deposit(amount: bigint): Promise<MockTx> {
          balance += amount
          return { transactionHash: '0xdeptx' as `0x${string}` }
        },
        decryptMessage: async () => ({ decryptedMessage: '', messageType: '', messageFrom: '0x0000000000000000000000000000000000000000', messageTo: '0x0000000000000000000000000000000000000000' as `0x${string}` }),
        decryptTransaction: async () => [],
        refetchBalance: () => {},
      }
      return res
    },
    refetchEercUser: () => {},
  }
}

export function useEercMock() {
  const [isRegistered, setIsRegistered] = useState(false)
  const [balance, setBalance] = useState<bigint>(0n)

  const register = useCallback(async () => {
    setIsRegistered(true)
    return { key: '0xmock', transactionHash: '0xregtx' } as const
  }, [])

  const useEncryptedBalance = useCallback(() => {
    const privateTransfer = async (_to: string, _amount: bigint) => {
      return { transactionHash: '0xtranstx' as `0x${string}`, receiverEncryptedAmount: [], senderEncryptedAmount: [] }
    }
    const refetchBalance = () => {}

    return {
      decryptedBalance: balance,
      parsedDecryptedBalance: balance.toString(),
      encryptedBalance: [] as bigint[],
      auditorPublicKey: [] as bigint[],
      decimals: 18n,
      decryptMessage: async () => ({ decryptedMessage: '', messageType: '', messageFrom: '0x0000000000000000000000000000000000000000', messageTo: '0x0000000000000000000000000000000000000000' as `0x${string}` }),
      decryptTransaction: async () => [],
      privateTransfer,
      withdraw: async (amount: bigint) => {
        setBalance((b) => (b >= amount ? b - amount : 0n))
        return { transactionHash: '0xwithtx' as `0x${string}` }
      },
      deposit: async (amount: bigint) => {
        setBalance((b) => b + amount)
        return { transactionHash: '0xdeptx' as `0x${string}` }
      },
      refetchBalance,
    }
  }, [balance])

  return {
    // minimal fields used by the demo
    isInitialized: true,
    isAllDataFetched: true,
    isRegistered,
    isConverter: true,
    publicKey: [],
    auditorAddress: '0x0000000000000000000000000000000000000000' as `0x${string}`,
    owner: '0x0000000000000000000000000000000000000000',
    auditorPublicKey: [],
    isAuditorKeySet: false,
    name: 'Mock eERC',
    symbol: 'MEERC',
    isDecryptionKeySet: true,
    areYouAuditor: false,
    hasBeenAuditor: { isChecking: false, isAuditor: false },
    generateDecryptionKey: async () => '0xmock',
    register,
    auditorDecrypt: async () => [],
    isAddressRegistered: async (_addr: `0x${string}`) => ({ isRegistered, error: null }),
    useEncryptedBalance,
    refetchEercUser: () => {},
    refetchAuditor: () => {},
    setContractAuditorPublicKey: async () => '0xsetauditor' as `0x${string}`,
  }
}

