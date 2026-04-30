import api from './request';
import type { PetVO, Result } from '../types';

export const petApi = {
  getAll: () => api.get<Result<PetVO[]>>('/pets'),
  summon: () => api.post<Result<{ pet: PetVO; remainingDiamond: number }>>('/pets/summon'),
  upgrade: (id: number) => api.post<Result<PetVO>>(`/pets/${id}/upgrade`),
  evolve: (id: number) => api.post<Result<PetVO>>(`/pets/${id}/evolve`),
  upgradeSkill: (id: number) => api.post<Result<PetVO>>(`/pets/${id}/upgrade-skill`),
  toggleActive: (id: number) => api.put<Result<PetVO>>(`/pets/${id}/activate`),
  getCollection: () => api.get<Result<any[]>>('/pets/collection'),
};
