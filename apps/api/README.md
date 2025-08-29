# Illara Camp API

Backend API for the Illara Camp Telegram Mini App.

## Setup

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Set up the database:
   ```bash
   pnpm db:generate
   pnpm db:migrate
   ```

3. Create a `.env` file:
   ```env
   DATABASE_URL="file:./dev.db"
   PORT=3001
   ```

4. Start development server:
   ```bash
   pnpm dev
   ```

## Database

The API uses SQLite with Prisma ORM. The database file will be created at `./dev.db`.

### Models

- **User**: Telegram user information
- **Wallet**: User wallet with ILL balance
- **Tx**: Transaction history
- **Reward**: Redeemed store items
- **Score**: Game scores

## API Endpoints

- `POST /auth/telegram` - Authenticate Telegram user
- `GET /wallet` - Get wallet balance and transactions
- `POST /wallet/earn` - Earn ILL tokens
- `POST /wallet/spend` - Spend ILL tokens
- `POST /rewards/redeem` - Redeem store items
- `POST /scores` - Save game scores

## Development

- `pnpm dev` - Start development server with hot reload
- `pnpm build` - Build for production
- `pnpm db:migrate` - Run database migrations
- `pnpm db:studio` - Open Prisma Studio
