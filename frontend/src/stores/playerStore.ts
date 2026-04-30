import { create } from 'zustand';
import type { Player } from '../types';

interface PlayerState {
  player: Player | null;
  token: string | null;
  setPlayer: (player: Player) => void;
  setToken: (token: string) => void;
  logout: () => void;
  isLoggedIn: () => boolean;
  init: () => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  player: null,
  token: null,

  setPlayer: (player) => {
    localStorage.setItem('player', JSON.stringify(player));
    set({ player });
  },

  setToken: (token) => {
    localStorage.setItem('token', token);
    set({ token });
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('player');
    set({ player: null, token: null });
  },

  isLoggedIn: () => {
    return !!get().token;
  },

  init: () => {
    const token = localStorage.getItem('token');
    const playerStr = localStorage.getItem('player');
    if (token && playerStr) {
      try {
        const player = JSON.parse(playerStr);
        set({ token, player });
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('player');
      }
    }
  },
}));
