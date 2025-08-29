# Illara Camp - Telegram Mini App

A Telegram Mini App featuring three simple games with an in-app economy system. Players earn ILL tokens by playing games and can spend them on items and coupons.

## 🎮 Games

1. **Flappy Rocket** (Phaser 3) - Tap to fly through pipes
2. **Tower Builder** (Three.js) - Stack blocks to build the highest tower
3. **Memory Match** (Vanilla JS) - Find matching pairs of cards

## 🏗️ Architecture

- **Monorepo** with pnpm workspaces
- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript + Prisma + SQLite
- **Shared**: Common types and interfaces

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- pnpm 8+

### Installation

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd illara-camp
   pnpm install
   ```

2. **Set up the database:**
   ```bash
   cd apps/api
   pnpm db:generate
   pnpm db:migrate
   ```

3. **Start development servers:**
   ```bash
   # From root directory
   pnpm dev
   ```

This will start:
- API server on `http://localhost:3001`
- Webapp on `http://localhost:5173`

## 📱 Telegram Mini App Setup

### 1. Create a Telegram Bot

1. Message [@BotFather](https://t.me/botfather) on Telegram
2. Create a new bot with `/newbot`
3. Get your bot token

### 2. Configure Mini App

1. Use `/newapp` with BotFather to create a Mini App
2. Set the web app URL to your deployed frontend
3. Configure the bot settings

### 3. Environment Variables

Create `.env` files in both `apps/api` and `apps/webapp`:

```env
# apps/api/.env
DATABASE_URL="file:./dev.db"
PORT=3001

# apps/webapp/.env
VITE_API_URL="http://localhost:3001"
```

## 🎯 Features

### Economy System
- **ILL Tokens**: Earned by playing games (1 ILL per 10 points)
- **Store**: Purchase items and coupons with ILL
- **Wallet**: Track balance and transaction history

### Audio System
- **WebAudio SFX Engine**: 10 sound effects with no external files
- **Background Music**: 3 procedural music loops (happy, cosmic, chill)
- **Tempo-synced Transport**: BPM control with quantized start/stop
- **Ducking System**: Music lowers -6dB when SFX play
- **Mobile Support**: Resume on first user interaction
- **Haptic Integration**: Syncs with Telegram haptic feedback
- **Sound Effects**: tap, point, fail, win, unlock, hit, jump, stack, flip, match

### Game Mechanics
- **Flappy Rocket**: Score = pipes passed
- **Tower Builder**: Score = blocks stacked
- **Memory Match**: Score = pairs found (0-8)

### User Progression
- **Planets**: Unlock new games with ILL
- **Profile**: View stats and achievements
- **Inventory**: Track owned items

## 🛠️ Development

### Project Structure

```
illara-camp/
├── apps/
│   ├── api/                 # Backend API
│   │   ├── src/
│   │   ├── prisma/
│   │   └── package.json
│   └── webapp/             # Frontend React app
│       ├── src/
│       │   ├── components/
│       │   ├── screens/
│       │   ├── games/
│       │   └── contexts/
│       └── package.json
├── packages/
│   └── shared/             # Shared types
└── package.json
```

### Available Scripts

```bash
# Root
pnpm dev          # Start both API and webapp
pnpm build        # Build all packages
pnpm clean        # Clean node_modules

# API
pnpm -C apps/api dev
pnpm -C apps/api db:migrate
pnpm -C apps/api db:studio

# Webapp
pnpm -C apps/webapp dev
pnpm -C apps/webapp build
```

### API Endpoints

- `POST /auth/telegram` - Authenticate Telegram user
- `GET /wallet` - Get wallet balance and transactions
- `POST /wallet/earn` - Earn ILL tokens
- `POST /wallet/spend` - Spend ILL tokens
- `POST /rewards/redeem` - Redeem store items
- `POST /scores` - Save game scores

## 🎨 Customization

### Adding New Games

1. Create game file in `apps/webapp/src/games/`
2. Implement the `Game` interface
3. Add to games registry in `GameScreen.tsx`
4. Update planet configuration in `UniverseScreen.tsx`

### Styling

The app uses Tailwind CSS with custom color scheme:
- Primary: Blue gradient (`primary-400` to `primary-900`)
- Secondary: Purple gradient (`secondary-400` to `secondary-900`)
- Custom components in `src/index.css`

## 🔒 Security Notes

⚠️ **MVP Implementation**: This is a development version with placeholder security. For production:

1. Implement proper Telegram WebApp `initData` validation
2. Add rate limiting and input validation
3. Use environment variables for sensitive data
4. Add proper error handling and logging

## 📄 License

MIT License - see [LICENSE](LICENSE) file.

## 🙏 Acknowledgments

This project includes code inspired by these MIT-licensed repositories:
- [Flappy Bird (Phaser 3)](https://github.com/usmansbk/flappy-bird)
- [Stack (Three.js)](https://github.com/KonradLinkowski/Stack)
- [Memory Game (Vanilla JS)](https://github.com/taniarascia/memory)

See [NOTICE](NOTICE) for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For questions or issues, please open a GitHub issue or contact the development team.

## 🚀 Deploy (Vercel + Render)
- API: Render uses `render.yaml` (rootDir=apps/api). Build: `pnpm install && pnpm build`. Start: `node dist/index.js`.
- Web: Vercel uses `apps/webapp/vercel.json`. Set `VITE_API_URL` env to your API URL.
- Telegram: In @BotFather → Bot Settings → Menu Button → Set Web App → paste Vercel URL.
- Tip: add `?v=<timestamp>` to the WebApp URL in BotFather to refresh cache.
