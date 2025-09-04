// Ensure Node-style globals exist in the browser.
// Some SDK transitive deps (e.g., blake-hash) expect Buffer.
import { Buffer } from 'buffer'

if (!(window as any).Buffer) {
  ;(window as any).Buffer = Buffer
}

if (!(window as any).global) {
  ;(window as any).global = window
}

