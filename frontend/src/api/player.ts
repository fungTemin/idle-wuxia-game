import api from './request';
import type { Player, IdleRewardVO, Result } from '../types';

export const playerApi = {
  getInfo: () => api.get<Result<Player>>('/player/info'),
  collectIdleReward: () => api.post<Result<IdleRewardVO>>('/player/idle-reward'),
  upgrade: () => api.post<Result<Player>>('/player/upgrade'),
  register: (data: { username: string; password: string; nickname: string }) =>
    api.post<Result<{ token: string; player: Player }>>('/auth/register', data),
  login: (data: { username: string; password: string }) =>
    api.post<Result<{ token: string; player: Player }>>('/auth/login', data),
};
