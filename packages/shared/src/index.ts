export interface Game {
  id: string;
  title: string;
  engine: 'phaser' | 'three' | 'vanilla';
  mount(container: HTMLElement, onResult: (score: number) => void): void;
  unmount(): void;
  recommendedSessionSec: number;
  difficulty: 1 | 2 | 3;
}

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
}

export interface Wallet {
  balance: number;
  lastTx: Transaction[];
}

export interface Transaction {
  id: number;
  amount: number;
  type: string;
  meta?: any;
  ts: string;
}

export interface Reward {
  type: 'sword' | 'coupon5' | 'coupon10';
  code: string;
}

export interface StoreItem {
  id: string;
  name: string;
  price: number;
  type: 'sword' | 'coupon5' | 'coupon10';
  description: string;
}
