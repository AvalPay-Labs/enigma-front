# Converter Quickstart (eERC)

Guía práctica para que nuevos devs configuren y ejecuten los primeros flujos con el Converter de Encrypted ERC (eERC): registro, depósito, transferencia privada, consulta de balance y retiro.

## Objetivo
- Ejecutar end‑to‑end en red real (Fuji/Mainnet) los flujos del Converter usando el SDK `@avalabs/eerc-sdk` desde esta app Vite.
- Mantener un modo mock para desarrollo local sin circuitos.

## Pre‑requisitos
- Node.js 18+, pnpm.
- Wallet EVM (MetaMask) en la misma red del contrato eERC (Fuji o Mainnet).
- Contrato eERC del Converter: dirección disponible.
- Circuitos ZK accesibles públicamente (ver sección “Circuitos”).

## Variables de entorno (.env.local)
- Red y RPCs:
  - `VITE_NETWORK=fuji` | `mainnet`
  - `VITE_FUJI_RPC_URL`, `VITE_MAINNET_RPC_URL` (opcional)
- Contrato eERC:
  - `VITE_EERC_CONTRACT_ADDRESS=0x...` (converter)
- Circuitos ZK:
  - Opción base: `VITE_EERC_CIRCUIT_BASE_URL` (la app buscará `/<name>/<name>.wasm|.zkey` bajo esa base)
  - Overrides finos (si los archivos no siguen esa convención):
    - `VITE_CIRCUIT_REGISTER_WASM_URL`, `VITE_CIRCUIT_REGISTER_ZKEY_URL`
    - `VITE_CIRCUIT_TRANSFER_WASM_URL`, `VITE_CIRCUIT_TRANSFER_ZKEY_URL`
    - `VITE_CIRCUIT_MINT_WASM_URL`, `VITE_CIRCUIT_MINT_ZKEY_URL` (usado por depósito en el SDK)
    - `VITE_CIRCUIT_WITHDRAW_WASM_URL`, `VITE_CIRCUIT_WITHDRAW_ZKEY_URL`
- Modo mock:
  - `VITE_EERC_MOCK=1` para desarrollo local sin circuitos.
  - Poner `0`/eliminar para usar el SDK real.

## Circuitos
- Necesarios para: `register`, `transfer`, `mint` (depósito), `withdraw`.
- Hosting recomendado:
  - Servir en `public/circuits/<name>/<name>.wasm|.zkey` y configurar `VITE_EERC_CIRCUIT_BASE_URL=/circuits`.
  - O bien publicar en un bucket/servidor y definir las variables override.
- TODO: Documentar URLs finales de circuitos del proyecto cuando estén listas.

## Flujo paso a paso
1) Arranque de la app
- Instala deps: `pnpm i`
- Desarrollo: `pnpm dev` → http://localhost:5173
- Producción: `pnpm build` y `pnpm preview`

2) Modo mock vs real
- Mock: `VITE_EERC_MOCK=1`. Permite probar UI (registro/depósito/transferencia/retiro) sin circuitos reales.
- Real: `VITE_EERC_MOCK=0` y configurar contrato + circuitos. Se ejecutan pruebas ZK y transacciones reales.

3) Registro
- Botón “Register”. Requiere circuitos `register` en modo real.
- Luego verifica/genera la decryption key si `isDecryptionKeySet` es `false` (SDK: `generateDecryptionKey()`).

4) Token del Converter y allowance
- Operaciones como `deposit`, `withdraw` y el balance requieren un `tokenAddress` ERC20.
- Chequea allowance antes de depositar:
  - SDK: `eerc.fetchUserApprove(user, tokenAddress)`
  - Si es insuficiente, ejecutar `approve(eERCContract, amount)` con `viem/wagmi`.
- TODO: Añadir selector/input de `tokenAddress` y botón “Approve” en la UI.

5) Depósito (ERC20 → eERC)
- Requisitos: allowance suficiente, circuitos `mint`.
- Hook: `const encrypted = eerc.useEncryptedBalance(tokenAddress)`
- Acción: `encrypted.deposit(amount)`

6) Transferencia privada
- Requisitos: ambos usuarios registrados; circuitos `transfer`.
- Acción: `encrypted.privateTransfer(to, amount)`

7) Balance encriptado y decryption key
- Asegura `isDecryptionKeySet` (genera si falta).
- Lectura: `encrypted.parsedDecryptedBalance` (string) y `encrypted.decryptedBalance` (bigint).
- Refrescado: `encrypted.refetchBalance()` tras cada operación.

8) Retiro (eERC → ERC20)
- Requisitos: circuitos `withdraw` y balance suficiente.
- Acción: `encrypted.withdraw(amount)`

## Tests
- Unit tests (Vitest): `pnpm test`
  - Actualmente se prueban flujos del mock: registro, depósito, retiro y transferencia.
  - TODO: Añadir tests de UI (Testing Library) y mocks del hook para validar indicadores de carga/éxito.

## Notas y seguridad
- No subas secretos (`.env.local` en gitignore).
- Almacena la decryption key de forma segura (no en texto plano en el repo). Ideal: Secret Manager/Keychain.
- Verifica que la wallet esté en la red correcta y con gas suficiente.

## Referencias
- `docs/registration.md`, `docs/deposit.md`, `docs/transfer.md`, `docs/withdraw.md` — detalles de cada flujo.
- `docs/sdk-usage.md`, `docs/useEERC.md` — uso del SDK y hooks.
- Repositorios externos y documentación oficial listados en `README.md`.

## TODOs
- Reemplazar mocks cuando se publiquen circuitos y configuraciones finales.
- Añadir UI de `tokenAddress` y botón de `Approve` (ERC20 → eERC).
- Exponer botón “Generate Decryption Key” tras el registro si falta.
- Añadir tests de UI para los flujos del converter.
