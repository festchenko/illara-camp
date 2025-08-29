import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

// Initialize database
async function initializeDatabase() {
  try {
    console.log('Initializing database...');
    await prisma.$executeRaw`CREATE TABLE IF NOT EXISTS "User" (
      "id" SERIAL PRIMARY KEY,
      "tg_id" TEXT UNIQUE NOT NULL,
      "name" TEXT,
      "avatar" TEXT,
      "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`;
    
    await prisma.$executeRaw`CREATE TABLE IF NOT EXISTS "Wallet" (
      "user_id" INTEGER PRIMARY KEY,
      "balance" INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE
    )`;
    
    await prisma.$executeRaw`CREATE TABLE IF NOT EXISTS "Tx" (
      "id" SERIAL PRIMARY KEY,
      "user_id" INTEGER NOT NULL,
      "amount" INTEGER NOT NULL,
      "type" TEXT NOT NULL,
      "meta" TEXT,
      "ts" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE
    )`;
    
    await prisma.$executeRaw`CREATE TABLE IF NOT EXISTS "Reward" (
      "id" SERIAL PRIMARY KEY,
      "user_id" INTEGER NOT NULL,
      "type" TEXT NOT NULL,
      "code" TEXT UNIQUE NOT NULL,
      "status" TEXT NOT NULL DEFAULT 'active',
      "ts" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE
    )`;
    
    await prisma.$executeRaw`CREATE TABLE IF NOT EXISTS "Score" (
      "id" SERIAL PRIMARY KEY,
      "user_id" INTEGER NOT NULL,
      "game_id" TEXT NOT NULL,
      "score" INTEGER NOT NULL,
      "ts" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE
    )`;
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
}

// Initialize database on startup
initializeDatabase();

app.use(cors());
app.use(express.json());

// Middleware to check Telegram origin (placeholder for MVP)
const checkTelegramOrigin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  // TODO: Replace with proper Telegram WebApp initData validation
  const origin = req.headers.origin;
  if (origin && origin.includes('telegram')) {
    next();
  } else {
    // For development, allow all origins
    next();
  }
};

app.use(checkTelegramOrigin);

// Auth routes
app.post('/auth/telegram', async (req, res) => {
  try {
    const { tg_id, name, avatar } = req.body;
    
    console.log('Auth request:', { tg_id, name, avatar });
    
    if (!tg_id) {
      return res.status(400).json({ error: 'tg_id is required' });
    }

    console.log('Creating/updating user with tg_id:', tg_id);
    const user = await prisma.user.upsert({
      where: { tg_id },
      update: { name, avatar },
      create: { tg_id, name, avatar }
    });

    console.log('User created/updated:', user);

    // Ensure wallet exists
    console.log('Creating/updating wallet for user:', user.id);
    await prisma.wallet.upsert({
      where: { user_id: user.id },
      update: {},
      create: { user_id: user.id, balance: 0 }
    });

    console.log('Auth successful for user:', user.id);
    res.json({ user });
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Wallet routes
app.get('/wallet', async (req, res) => {
  try {
    const tg_id = req.headers['x-tg-id'] as string;
    console.log('Wallet request for tg_id:', tg_id);
    
    if (!tg_id) {
      return res.status(400).json({ error: 'x-tg-id header required' });
    }

    console.log('Looking for user with tg_id:', tg_id);
    const user = await prisma.user.findUnique({
      where: { tg_id },
      include: {
        wallet: true,
        transactions: {
          take: 20,
          orderBy: { ts: 'desc' }
        }
      }
    });

    console.log('User found:', user ? 'yes' : 'no', user);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const response = {
      balance: user.wallet?.balance || 0,
      lastTx: user.transactions
    };
    
    console.log('Wallet response:', response);
    res.json(response);
  } catch (error) {
    console.error('Wallet error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/wallet/earn', async (req, res) => {
  try {
    const { amount, reason } = req.body;
    const tg_id = req.headers['x-tg-id'] as string;
    
    if (!tg_id || !amount) {
      return res.status(400).json({ error: 'tg_id and amount required' });
    }

    const user = await prisma.user.findUnique({
      where: { tg_id },
      include: { wallet: true }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const newBalance = (user.wallet?.balance || 0) + amount;

    await prisma.$transaction([
      prisma.wallet.upsert({
        where: { user_id: user.id },
        update: { balance: newBalance },
        create: { user_id: user.id, balance: newBalance }
      }),
      prisma.tx.create({
        data: {
          user_id: user.id,
          amount,
          type: 'earn',
          meta: JSON.stringify({ reason })
        }
      })
    ]);

    res.json({ balance: newBalance });
  } catch (error) {
    console.error('Earn error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/wallet/spend', async (req, res) => {
  try {
    const { amount, item } = req.body;
    const tg_id = req.headers['x-tg-id'] as string;
    
    if (!tg_id || !amount) {
      return res.status(400).json({ error: 'tg_id and amount required' });
    }

    const user = await prisma.user.findUnique({
      where: { tg_id },
      include: { wallet: true }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const currentBalance = user.wallet?.balance || 0;
    if (currentBalance < amount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    const newBalance = currentBalance - amount;

    await prisma.$transaction([
      prisma.wallet.update({
        where: { user_id: user.id },
        data: { balance: newBalance }
      }),
      prisma.tx.create({
        data: {
          user_id: user.id,
          amount: -amount,
          type: 'spend',
          meta: JSON.stringify({ item })
        }
      })
    ]);

    res.json({ balance: newBalance });
  } catch (error) {
    console.error('Spend error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Rewards routes
app.post('/rewards/redeem', async (req, res) => {
  try {
    const { type } = req.body;
    const tg_id = req.headers['x-tg-id'] as string;
    
    if (!tg_id || !type) {
      return res.status(400).json({ error: 'tg_id and type required' });
    }

    const user = await prisma.user.findUnique({
      where: { tg_id }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const code = uuidv4();
    
    const reward = await prisma.reward.create({
      data: {
        user_id: user.id,
        type,
        code
      }
    });

    res.json({ code });
  } catch (error) {
    console.error('Reward error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Scores routes
app.post('/scores', async (req, res) => {
  try {
    const { game_id, score } = req.body;
    const tg_id = req.headers['x-tg-id'] as string;
    
    if (!tg_id || !game_id || score === undefined) {
      return res.status(400).json({ error: 'tg_id, game_id, and score required' });
    }

    const user = await prisma.user.findUnique({
      where: { tg_id }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const scoreRecord = await prisma.score.create({
      data: {
        user_id: user.id,
        game_id,
        score
      }
    });

    res.json({ score: scoreRecord });
  } catch (error) {
    console.error('Score error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// health & root
app.get('/health', (_, res) => res.json({ ok: true, time: Date.now() }));
app.get('/',       (_, res) => res.json({ ok: true, service: 'illara-api' }));


app.listen(PORT, () => {
  console.log(`🚀 API server running on port ${PORT}`);
});
