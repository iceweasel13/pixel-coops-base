"use client";

import { CoopSlot } from "@/types";
import { Lock, Plus, ShoppingCart, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { toast } from "sonner";

type Props = {
  slot: CoopSlot;
};

export function CoopSlotCard({ slot }: Props) {

  const handleUpgrade = () => {
    toast.info(`Slot ${slot.id} için yükseltme işlemi başlıyor...`);
  };

  const handleSell = () => {
    toast.promise(new Promise(resolve => setTimeout(resolve, 1500)), {
        loading: `${slot.chicken?.name} satılıyor...`,
        success: `${slot.chicken?.name} başarıyla satıldı!`,
        error: "Satış sırasında bir hata oluştu."
    });
  }

  if (slot.status === 'locked') {
    return (
      <div className="flex h-[220px] w-[180px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-500 bg-black/20 text-center p-2">
        <Lock className="h-12 w-12 text-gray-400" />
        <Button onClick={handleUpgrade} variant="secondary" className="mt-4">Yükselt</Button>
      </div>
    );
  }

  if (slot.status === 'empty') {
    return (
     
        <div className="group flex h-[220px] w-[180px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-border   p-2">
         
          <p className="mt-2 text-sm font-semibold text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
         
          </p>
        </div>
      
    );
  }

  if (slot.status === 'occupied' && slot.chicken) {
    return (
      <div className="relative group flex h-[220px] w-[180px] flex-col items-center justify-between rounded-lg border bg-green-500/10 p-4">
        <Image src={slot.chicken.imageUrl} alt={slot.chicken.name} width={100} height={100} className="object-contain"/>
        <div className="text-center">
            <p className="font-bold">{slot.chicken.name}</p>
            <p className="text-xs text-muted-foreground">{slot.chicken.productionRate} $EGG/s</p>
        </div>
        <Button 
            variant="destructive" 
            size="sm" 
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleSell}
        >
            <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return null;
}