"use client";

import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { CoopSlotCard } from "../CoopSlotCard";
import { CoopSlot } from "@/types";

// GEÇİCİ VERİ: Bu veriyi daha sonra kontrattan çekeceğiz.
const playerCoopSlots: CoopSlot[] = [
    { id: 1, status: 'occupied', chicken: { id: 101, name: 'Clucky', imageUrl: '/chickens/chicken-1.png', productionRate: 0.1 } },
    { id: 2, status: 'occupied', chicken: { id: 102, name: 'BokBok', imageUrl: '/chickens/chicken-2.png', productionRate: 0.2 } },
    { id: 3, status: 'occupied', chicken: { id: 103, name: 'Goldie', imageUrl: '/chickens/chicken-4.png', productionRate: 1.2 } },
    { id: 4, status: 'empty' },
    { id: 5, status: 'empty' },
    { id: 6, status: 'locked' },
    { id: 7, status: 'locked' },
    { id: 8, status: 'locked' },
    { id: 9, status: 'locked' },
    { id: 10, status: 'locked' },
];

export function CoopDialog({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="border-4 sm:max-w-4xl" // Diyalog genişliği
        style={{
          backgroundColor: '#ecb17a',
          borderColor: '#b66e65',
        }}
      >
          <DialogClose
          aria-label="Kapat"
          className="absolute right-3 top-3 size-10 cursor-pointer rounded-xs border-0 bg-transparent opacity-90 transition-opacity hover:opacity-100 focus:outline-none focus:ring-0"
        >
          <img
            src="/icons/close.png"
            alt="Kapat"
            className="pointer-events-none block h-10 w-10 select-none"
          />
        </DialogClose>
        <DialogHeader className="text-center mb-4">
          <DialogTitle className="text-4xl text-[#5a4535]">
            Kümesim
          </DialogTitle>
          <DialogDescription>
            Tavuklarını yönet ve yeni yerler aç.
          </DialogDescription>
        </DialogHeader>
        
        <div className="max-h-[70vh] overflow-y-auto p-4 custom-scrollbar">
          <div className="flex flex-row flex-wrap justify-center gap-4">
            {playerCoopSlots.map((slot) => (
              <CoopSlotCard key={slot.id} slot={slot} />
            ))}
          </div>
        </div>

    
      </DialogContent>
    </Dialog>
  );
}