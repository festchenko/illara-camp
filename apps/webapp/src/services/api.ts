import { Wallet, Transaction, Reward } from '@illara-camp/shared';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

class ApiService {
  private tgId: string | null = null;

  setTgId(tgId: string) {
    this.tgId = tgId;
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (this.tgId) {
      headers['x-tg-id'] = this.tgId;
    }
    
    return headers;
  }

  async authTelegram(tgId: string, name?: string, avatar?: string) {
    this.setTgId(tgId);
    console.log('Making auth request to:', `${API_BASE}/auth/telegram`);
    
    try {
      const response = await fetch(`${API_BASE}/auth/telegram`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ tg_id: tgId, name, avatar }),
      });
      
      console.log('Auth response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Auth failed:', errorText);
        throw new Error(`Auth failed: ${response.status} ${errorText}`);
      }
      
      const result = await response.json();
      console.log('Auth successful:', result);
      return result;
    } catch (error) {
      console.error('Auth request failed:', error);
      throw error;
    }
  }

  async getWallet(): Promise<Wallet> {
    console.log('Getting wallet with headers:', this.getHeaders());
    const response = await fetch(`${API_BASE}/wallet`, {
      headers: this.getHeaders(),
    });
    
    console.log('Wallet response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Wallet error response:', errorText);
      throw new Error(`Failed to fetch wallet: ${response.status} ${errorText}`);
    }
    
    const result = await response.json();
    console.log('Wallet response:', result);
    return result;
  }

  async earnWallet(amount: number, reason: string) {
    const response = await fetch(`${API_BASE}/wallet/earn`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ amount, reason }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to earn');
    }
    
    return response.json();
  }

  async spendWallet(amount: number, item: string) {
    const response = await fetch(`${API_BASE}/wallet/spend`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ amount, item }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to spend');
    }
    
    return response.json();
  }

  async redeemReward(type: 'sword' | 'coupon5' | 'coupon10'): Promise<Reward> {
    const response = await fetch(`${API_BASE}/rewards/redeem`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ type }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to redeem reward');
    }
    
    return response.json();
  }

  async saveScore(gameId: string, score: number) {
    const response = await fetch(`${API_BASE}/scores`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ game_id: gameId, score }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to save score');
    }
    
    return response.json();
  }
}

export const api = new ApiService();
