export type FarmUpgrade = {
  level: number;
  maxChickens: number;
  totalProductionPower: number;
  cost: number; // in $EGG
  x: number;
  y: number;
};

// Central list of farm upgrades used by UI and docs
export const farmUpgrades: FarmUpgrade[] = [
  { level: 2, maxChickens: 3,  totalProductionPower: 300,  cost: 150,   x: 1, y: 3 },
  { level: 3, maxChickens: 4,  totalProductionPower: 520,  cost: 350,   x: 1, y: 4 },
  { level: 4, maxChickens: 5,  totalProductionPower: 820,  cost: 700,   x: 1, y: 5 },
  { level: 5, maxChickens: 6,  totalProductionPower: 1250, cost: 1300,  x: 1, y: 6 },
  { level: 6, maxChickens: 7,  totalProductionPower: 1850, cost: 2400,  x: 1, y: 7 },
  { level: 7, maxChickens: 8,  totalProductionPower: 2750, cost: 4500,  x: 1, y: 8 },
  { level: 8, maxChickens: 9,  totalProductionPower: 4050, cost: 8000,  x: 1, y: 9 },
  { level: 9, maxChickens: 10, totalProductionPower: 6050, cost: 15000, x: 1, y: 10 },
];

