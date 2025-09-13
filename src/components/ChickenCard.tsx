"use client";

import Image from "next/image";
import { Coins, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Chicken } from "@/types";


type ChickenCardProps = {
  chicken: Chicken;
};

export function ChickenCard({ chicken }: ChickenCardProps) {
  const handleBuyClick = () => {
   
  };

  return (
    // DÜZELTME: Karta sabit bir genişlik ve yükseklik veriyoruz.
    // flex-col ve flex-grow ile iç elemanların bu alana yayılmasını sağlıyoruz.
    <div className="w-[250px] h-[380px] flex flex-col rounded-lg border bg-card text-card-foreground shadow-sm transition-transform hover:scale-105">
      <div className="p-4 bg-accent/50 rounded-t-lg">
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

        <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
          <Zap className="h-4 w-4" />
          <span>{chicken.productionRate} $EGG/saat</span>
        </div>

        {/* Bu boş div, alt kısmı en aşağıya itmek için esner */}
        <div className="flex-grow"></div>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <Coins className="h-5 w-5 text-primary" />
            <span className="text-xl font-bold">{chicken.price}</span>
          </div>
          <Button onClick={handleBuyClick}>Satın Al</Button>
        </div>
      </div>
    </div>
  );
}