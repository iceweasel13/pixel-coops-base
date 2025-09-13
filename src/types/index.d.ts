// types/index.ts

// ... mevcut Chicken tipi
export type Chicken = {
  id: number;
  name: string;
  imageUrl: string;
  productionRate: number; // Saatte ürettiği $EGG miktarı
  price: number;
};

// YENİ EKLENEN TİPLER
export type FarmStats = {
  dailyMining: number;
  hashRate: number;
  blocksUntilHalvening: number;
  minedEgg: number;
  spacesLeft: number;
  totalMhs: number;
};

export type FarmPlot = {
  id: number;
  status: 'occupied' | 'empty' | 'locked';
  chicken?: { // Sadece 'occupied' durumunda olacak
    name: string;
    imageUrl: string;
  }
};