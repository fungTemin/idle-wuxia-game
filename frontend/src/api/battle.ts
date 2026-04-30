import api from './request';
import type { Stage, BattleResult, Result } from '../types';

export const battleApi = {
  getStages: () => api.get<Result<Stage[]>>('/stages'),
  getCurrentStage: () => api.get<Result<any>>('/stages/current'),
  startBattle: () => api.post<Result<BattleResult>>('/battle/start'),
  quickBattle: () => api.post<Result<BattleResult>>('/battle/quick'),
};
