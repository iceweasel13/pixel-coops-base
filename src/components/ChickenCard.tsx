"use client";

import Image from "next/image";
import { Coins, Zap, Shield, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Kartın alacağı propları tanımlayalım
type ChickenCardProps = {
  chicken: {
    id: number;
    name: string;
    imageUrl: string;
    power: number;
    stamina: number;
    cost: number;
  };
  isBuyable: boolean;
  isFreebie: boolean;
  isConfirming: boolean;
  onBuy: () => void;
  onGetFree: () => void;
};

export function ChickenCard({ chicken, isBuyable, isFreebie, isConfirming, onBuy, onGetFree }: ChickenCardProps) {

  // Kartın durumuna göre stil belirleme
  const cardClasses = cn(
    "w-[250px] h-[400px] flex flex-col rounded-lg border bg-card text-card-foreground shadow-sm transition-transform",
    !isBuyable && !isFreebie && "opacity-60 bg-gray-200" // Alınamaz durumdaysa soluklaştır
  );

  return (
    <div className={cardClasses}>
      <div className="p-4 bg-accent/50 rounded-t-lg relative">
        {isFreebie && (
            <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 text-xs font-bold rounded-full flex items-center gap-1">
                <Gift size={14} /> ÜCRETSİZ
            </div>
        )}
        <Image
          src={chicken.imageUrl}
          alt={chicken.name}
          width={200}
          height={200}
          className="mx-auto aspect-square object-contain"
        />
      </div>
      <div className="flex flex-col p-4 flex-grow">
        <h3 className="text-lg font-bold">{chicken.name}</h3>

        <div className="flex flex-col gap-1 text-sm text-muted-foreground mt-2">
            <div className="flex items-center gap-1.5">
                <Zap className="h-4 w-4 text-yellow-500" />
                <span>Güç: {chicken.power}</span>
            </div>
            <div className="flex items-center gap-1.5">
                <Shield className="h-4 w-4 text-blue-500" />
                <span>Gereken Güç: {chicken.stamina}</span>
            </div>
        </div>
        
        <div className="flex-grow"></div>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <Coins className="h-5 w-5 text-primary" />
            <span className="text-xl font-bold">{isFreebie ? '0' : chicken.cost}</span>
          </div>
          
          {isFreebie ? (
            <Button onClick={onGetFree} disabled={isConfirming}>
                {isConfirming ? 'Alınıyor...' : 'Ücretsiz Al'}
            </Button>
          ) : (
            <Button onClick={onBuy} disabled={!isBuyable || isConfirming}>
                {isConfirming ? 'Alınıyor...' : (isBuyable ? 'Satın Al' : 'Yetersiz Güç')}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}