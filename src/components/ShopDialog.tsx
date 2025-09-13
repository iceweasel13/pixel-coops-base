"use client";

import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { ChickenCard } from "./ChickenCard";
import { Chicken } from "@/types";

const chickensForSale: Chicken[] = [
    { id: 1, name: "Normal Tavuk", imageUrl: "/chickens/chicken-1.png", productionRate: 0.1, price: 8 },
    { id: 2, name: "Hızlı Tavuk", imageUrl: "/chickens/chicken-2.png", productionRate: 0.2, price: 15 },
    { id: 3, name: "Süper Tavuk", imageUrl: "/chickens/chicken-3.png", productionRate: 0.5, price: 35 },
    { id: 4, name: "Altın Tavuk", imageUrl: "/chickens/chicken-4.png", productionRate: 1.2, price: 80 },
    { id: 5, name: "Robot Tavuk", imageUrl: "/chickens/chicken-5.png", productionRate: 2.5, price: 150 },
    { id: 6, name: "Ninja Tavuk", imageUrl: "/chickens/chicken-6.png", productionRate: 5.0, price: 320 },
    { id: 7, name: "Ejderha Tavuk", imageUrl: "/chickens/chicken-7.png", productionRate: 10, price: 700 },
    { id: 8, name: "Kozmik Tavuk", imageUrl: "/chickens/chicken-8.png", productionRate: 25, price: 1500 },
];

export function ShopDialog({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
     
      <DialogContent 
        className="border-4 sm:max-w-6xl" 
        style={{
          backgroundColor: '#ecb17a',
          borderColor: '#b66e65',
        }}
      >
        <DialogHeader className="flex items-center text-center mb-4">
          <DialogTitle className="text-4xl text-[#5a4535]">
            Marketplace
          </DialogTitle>
          <DialogDescription>
            Yeni tavuklar alarak üretimini artır!
          </DialogDescription>
        </DialogHeader>
        
         <div className="max-h-[70vh] overflow-y-auto p-4 custom-scrollbar">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
            {chickensForSale.map((chicken) => (
              <ChickenCard key={chicken.id} chicken={chicken} />
            ))}
          </div>
        </div>

        <DialogClose 
          className="absolute top-4 right-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none "
          onClick={onClose}
        >
         
          <span className="sr-only">Close</span>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}