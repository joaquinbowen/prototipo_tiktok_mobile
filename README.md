# Viraly Mobile — App de Creadores

App móvil de red social de videos cortos con monetización para creadores en LATAM. Prototipo demo navegable con todos los flujos simulados.

## Stack

- Expo SDK 53 + React Native 0.76
- Expo Router (file-based navigation)
- React Native Reanimated
- expo-linear-gradient
- TypeScript

## Arrancar

```bash
pnpm install
pnpm start
# Escanea el QR con Expo Go
```

Instala [Expo Go](https://expo.dev/go) en tu celular antes de arrancar.

## Flujos

| Pantalla | Descripción |
|----------|-------------|
| Welcome + Onboarding | Login simulado, selección de categorías |
| Feed (`/`) | Scroll vertical TikTok, likes en tiempo real |
| Discover | Trending hashtags, búsqueda |
| Create | Cámara simulada |
| Inbox + DM | Notificaciones, chat directo |
| Profile | Grid de videos, estadísticas |
| Creator Studio | Barras de progreso hacia monetización |
| Payment | Pasarela híbrida Stripe + Binance Pay |
| Wallet | Saldo creciente, solicitar retiro |

## El flujo estrella

1. Perfil → Creator Studio
2. Toca el área invisible (esquina inferior derecha) — activa metas al 100%
3. Botón cambia a dorado → toca para pagar
4. Elige tarjeta o crypto → success con confetti
5. Wallet con saldo acumulándose en tiempo real

## Estructura

```
app/
├── (tabs)/       # Feed, Discover, Create, Inbox, Profile
├── creator-studio.tsx
├── payment.tsx
├── wallet.tsx
└── dm.tsx

src/
├── components/   # VideoCard, VideoSidebar, ProgressBar, ConfettiEffect
├── constants/    # colors.ts, layout.ts
├── context/      # MonetizationContext
└── data/         # mocks.ts
```
