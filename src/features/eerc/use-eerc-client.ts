// Centralized imports for the eERC SDK hooks.
// Some versions expose hooks under different entrypoints.
// Use a namespace import to avoid build-time named-export failures.
import * as EercSdk from '@avalabs/eerc-sdk'

// These may be undefined if the installed SDK exposes hooks under a different path
// (e.g., '@avalabs/eerc-sdk/react'). The demo checks for undefined before using them.
export const useEERC: any = (EercSdk as any).useEERC
export const useEncryptedBalance: any = (EercSdk as any).useEncryptedBalance
