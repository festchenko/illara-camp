# Illara Camp Webapp

Frontend React application for the Illara Camp Telegram Mini App.

## Setup

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Start development server:
   ```bash
   pnpm dev
   ```

The app will be available at `http://localhost:5173`.

## Features

### Games
- **Flappy Rocket**: Phaser 3 game - tap to fly through pipes
- **Tower Builder**: Three.js game - stack blocks to build the highest tower
- **Memory Match**: Vanilla JS game - find matching pairs of cards

### Screens
- **Universe**: Main screen with planet selection
- **Store**: Purchase items with ILL tokens
- **Wallet**: View balance and transaction history
- **Profile**: User profile and achievements
- **Game**: Individual game screens

### Components
- **GameHost**: Manages game mounting/unmounting
- **TelegramContext**: Provides Telegram WebApp integration

## Development

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build

## Technologies

- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Framer Motion for animations
- Phaser 3 for Flappy game
- Three.js for Tower Builder game
- React Router for navigation
