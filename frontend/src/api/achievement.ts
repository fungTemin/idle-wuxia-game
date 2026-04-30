import api from './request';
import type { AchievementVO, Result } from '../types';

export const achievementApi = {
  getAll: () => api.get<Result<AchievementVO[]>>('/achievements'),
  claimReward: (id: number) =>
    api.post<Result<{ rewardType: string; rewardValue: number; gold: number; diamond: number }>>(
      `/achievements/${id}/claim`
    ),
};
