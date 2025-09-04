# Enigma Front — Encrypted ERC (eERC) Demo

Aplicación web basada en Vite + React + TypeScript que demuestra los flujos principales del protocolo Encrypted ERC (eERC): registro, depósito/mint, transferencia, retiro/burn y visualización de balance encriptado. Usa el SDK oficial `@avalabs/eerc-sdk` (compatible con Vite; no compatible con Next.js por ahora).

## Requisitos
- Node.js 18+
- Una wallet compatible con EVM (por ejemplo, MetaMask)
- RPCs para Avalanche Fuji/Mainnet (puedes configurar URLs propias en `.env.local`)

## Instalación y ejecución
- `npm ci` — instala dependencias desde el lockfile.
- Copia variables: `cp .env.example .env.local` y completa valores. Evita subir secretos al repo.
- `npm run dev` — levanta el servidor de desarrollo en `http://localhost:5173`.
- `npm run build` — genera build de producción en `dist/`.
- `npm run preview` — sirve el build localmente.
- `npm run typecheck` — valida tipos de TypeScript.

Variables de entorno relevantes (ver `.env.example`):
- `VITE_NETWORK` — `fuji` o `mainnet`.
- `VITE_FUJI_RPC_URL`, `VITE_MAINNET_RPC_URL` — opcionales; por defecto usa las de la cadena.
- `VITE_EERC_CONTRACT_ADDRESS` — opcional; override del contrato eERC.
- `VITE_EERC_CIRCUIT_BASE_URL` — base pública donde están los circuitos (`register|transfer|mint|withdraw|burn`). Si no se define, se asume `/circuits/<name>/<name>.wasm|.zkey`.
  - Overrides finos: `VITE_CIRCUIT_<NAME>_WASM_URL` y `VITE_CIRCUIT_<NAME>_ZKEY_URL` (por ejemplo, `VITE_CIRCUIT_REGISTER_WASM_URL`).

## Estructura del proyecto
- `docs/` — documentación de usuario (ver sección siguiente). Imágenes en `docs/assets/`.
- `src/` — código fuente (Vite + React + TS). Organización por feature: `src/features/<domain>/` con `components|hooks|services|types`.
- `src/features/eerc/` — demo simple con hooks del SDK (`useEERC`, `useEncryptedBalance`).
- `src/lib/wagmi.tsx` — configuración de `wagmi` y React Query.

## Documentación incluida (docs/)
Los siguientes documentos explican el protocolo y los flujos principales. Revisa cada uno para entender cómo integrarte con eERC desde el front:
- `what-is-eerc.md` — introducción a Encrypted ERC y su objetivo de privacidad.
- `protocol-overview.md` — visión general del protocolo y auditoría regulatoria.
- `registration.md` — estructura de balance encriptado y registro de usuario.
- `deposit.md` — fundamentos de balance/cantidad en el contexto de depósitos/mint.
- `mint.md` — detalles del flujo de mint.
- `transfer.md` — transferencia de tokens encriptados y verificación.
- `withdraw.md` — retiro/burn y actualización de estados.
- `sdk-usage.md` — cómo instalar y usar el SDK `@avalabs/eerc-sdk`.
- `useEERC.md` — inicialización del SDK via hook `useEERC`.
- `userEncriptedBalance.md` — manejo del hook `useEncryptedBalance` y lectura de balance.
- `converter-quickstart.md` — guía rápida para configurar circuitos, contrato y ejecutar registro/deposit/transfer/withdraw con el Converter.

Dentro de la app, el componente de demostración `src/features/eerc/eerc-demo.tsx` conecta la wallet, permite registrar, mint/burn y transferir, y muestra el balance encriptado.

## Recursos externos imprescindibles para continuar con eERC
Estos recursos son necesarios/útiles para operar el protocolo end‑to‑end y entender su uso:

1. Repositorio de servicios de backend (solo ejecución de servicios):
   - https://github.com/wolfcito/AvalPay-Hack2Build/tree/main
   - Útil para levantar los servicios del backend requeridos por el flujo eERC.

2. Repositorio con el script Converter:
   - https://github.com/alejandro99so/eerc-backend-converter/tree/main/scripts/converter
   - Scripts para conversión/soporte del backend en operaciones de eERC.

3. SDK oficial (funciona en Vite, no en Next.js):
   - https://github.com/ava-labs/eerc-sdk
   - Este proyecto utiliza dicho SDK mediante hooks; la compatibilidad recomendada es con Vite.

4. Documentación oficial del SDK de Avalabs:
   - https://avacloud.gitbook.io/encrypted-erc
   - Referencia completa de conceptos, APIs y guías de integración.

## Notas de integración
- Wallet y red: configura `wagmi` para Avalanche Fuji/Mainnet. La app usa `src/lib/wagmi.tsx` con RPCs definidas por entorno.
- SDK: los hooks se consumen desde `@avalabs/eerc-sdk`. En Next.js pueden surgir problemas de SSR; la integración soportada es Vite.
- Flujos clave: registro de usuario, mint/deposit, transfer, withdraw/burn y lectura/descifrado de balances. Cada flujo está detallado en `docs/`.
  - Importante: el SDK necesita URLs de circuitos para ejecutar pruebas ZK. Configura `VITE_EERC_CIRCUIT_BASE_URL` o los overrides individuales si no alojas los archivos en `/circuits`.

## Estilo de código y organización
- TypeScript; indentación de 2 espacios; comillas simples; con punto y coma.
- Componentes en PascalCase; hooks en camelCase con prefijo `use`.
- Estructura feature‑first en `src/features/<domain>/`.

## Pruebas
- Ubica tests junto al código o en `tests/`, usando `*.test.ts(x)`.
- Enfócate en flujos del protocolo (deposit, transfer, withdraw), utilidades del SDK, serialización y validación de entradas.
- Cubre casos de error y condiciones límite.

## Seguridad y configuración
- No subas secretos. Usa `.env.local` y un gestor de secretos.
- Valida entradas que afecten criptografía o balances; añade tests negativos.

## Licencia
Este repositorio se publica con fines de demostración. Revisa los repos externos para conocer sus respectivas licencias.
