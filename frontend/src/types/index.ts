export interface Player {
  id: number;
  username: string;
  nickname: string;
  level: number;
  exp: number;
  gold: number;
  diamond: number;
  attack: number;
  defense: number;
  hp: number;
  maxHp: number;
  idleGoldRate: number;
  idleExpRate: number;
  currentStageId: number;
  expToNextLevel: number;
  createdAt: string;
}

export interface PetVO {
  id: number;
  petTemplateId: number;
  name: string;
  description: string;
  rarity: string;
  level: number;
  exp: number;
  attack: number;
  defense: number;
  hp: number;
  skillName: string;
  skillDesc: string;
  skillLevel: number;
  skillDamage: number;
  isActive: boolean;
  slotPosition: number;
  evolutionTo: number | null;
  evolutionCost: number;
}

export interface Stage {
  id: number;
  name: string;
  chapter: number;
  stageOrder: number;
  description: string;
  monsterName: string;
  monsterAttack: number;
  monsterDefense: number;
  monsterHp: number;
  goldReward: number;
  expReward: number;
  requiredLevel: number;
  unlocked: boolean;
  current: boolean;
}

export interface BattleResult {
  victory: boolean;
  stageName: string;
  monsterName: string;
  battleLog: string[];
  goldReward: number;
  expReward: number;
  materialType: string;
  materialAmount: number;
  levelUp: boolean;
  newLevel: number;
  stageUnlocked: boolean;
}

export interface ShopItemVO {
  id: number;
  name: string;
  description: string;
  type: string;
  rarity: string;
  attackBonus: number;
  defenseBonus: number;
  hpBonus: number;
  priceType: string;
  price: number;
  stock: number;
  isPet: boolean;
  petTemplateId: number;
}

export interface AchievementVO {
  id: number;
  name: string;
  description: string;
  type: string;
  targetValue: number;
  currentValue: number;
  isCompleted: boolean;
  isRewarded: boolean;
  rewardType: string;
  rewardValue: number;
  progress: number;
}

export interface IdleRewardVO {
  goldEarned: number;
  expEarned: number;
  offlineSeconds: number;
  levelUp: boolean;
  newLevel: number;
}

export interface InventoryItem {
  id: number;
  itemId: number;
  quantity: number;
  isEquipped: boolean;
  equippedSlot: string | null;
  name: string;
  description: string;
  type: string;
  rarity: string;
  attackBonus: number;
  defenseBonus: number;
  hpBonus: number;
}

export interface Result<T> {
  code: number;
  message: string;
  data: T;
}
