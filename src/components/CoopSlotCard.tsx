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
    toast.info(`Starting upgrade for slot ${slot.id}...`);
  };

  const handleSell = () => {
    toast.promise(new Promise(resolve => setTimeout(resolve, 1500)), {
        loading: `Selling ${slot.chicken?.name}...`,
        success: `${slot.chicken?.name} sold successfully!`,
        error: "An error occurred during the sale."
    });
  }

  if (slot.status === 'locked') {
    return (
      <div className="flex h-[220px] w-[250px] flex-col items-center justify-center rounded-lg   bg-[url(/assets/coop.png)] bg-cover bg text-center p-2">
        <Lock className="h-12 w-12 text-gray-400" />
       
      </div>
    );
  }

  if (slot.status === 'empty') {
    return (
     
        <div className="group flex h-[220px] w-[250px] flex-col items-center justify-center rounded-lg  bg-[url(/assets/coop.png)] bg-cover   p-2">
         
          <p className="mt-2 text-sm font-semibold text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
         
          </p>
        </div>
      
    );
  }

  if (slot.status === 'occupied' && slot.chicken) {
    return (
      <div className="relative group flex h-[220px] w-[250px] flex-col items-center justify-between rounded-lg   bg-[url(/assets/coop.png)] bg-cover p-4">
        <Image src={slot.chicken.imageUrl} alt={slot.chicken.name} width={140} height={140} className="object-contain mt-12.5"/>
        <div className="text-center">
            
           
        </div>
      
      </div>
    );
  }

  return null;
}
