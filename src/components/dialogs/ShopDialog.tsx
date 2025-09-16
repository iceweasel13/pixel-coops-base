import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { ChickenCard } from "../ChickenCard";
import { useGame } from "@/context/GameContext";
import { Loader2 } from "lucide-react";

// ÜCRETSİZ BAŞLANGIÇ TAVUĞU
const starterChicken = {
  id: 0, // ID'si 0 olan özel tavuk
  name: "Başlangıç Tavuğu",
  imageUrl: "/chickens/chicken-1.png", // Dilersen buna özel bir resim atayabilirsin
  power: 50,
  stamina: 50,
  cost: 0,
};

// SATIN ALINABİLİR TAVUKLAR
const shopChickenTypes = [
    { id: 1, name: "Normal Tavuk", imageUrl: "/chickens/chicken-1.png", power: 100, stamina: 100, cost: 80 },
    { id: 2, name: "Hızlı Tavuk", imageUrl: "/chickens/chicken-2.png", power: 150, stamina: 150, cost: 130 },
    { id: 3, name: "Süper Tavuk", imageUrl: "/chickens/chicken-3.png", power: 220, stamina: 220, cost: 210 },
    { id: 4, name: "Altın Tavuk", imageUrl: "/chickens/chicken-4.png", power: 300, stamina: 300, cost: 340 },
    { id: 5, name: "Robot Tavuk", imageUrl: "/chickens/chicken-5.png", power: 430, stamina: 430, cost: 550 },
    { id: 6, name: "Ninja Tavuk", imageUrl: "/chickens/chicken-6.png", power: 600, stamina: 600, cost: 880 },
    { id: 7, name: "Ejderha Tavuk", imageUrl: "/chickens/chicken-7.png", power: 900, stamina: 900, cost: 1400 },
    { id: 8, name: "Kozmik Tavuk", imageUrl: "/chickens/chicken-8.png", power: 1300, stamina: 1300, cost: 2200 },
    { id: 9, name: "Tanrı Tavuk", imageUrl: "/chickens/chicken-1.png", power: 2000, stamina: 2000, cost: 3500 },
];

export function ShopDialog({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { 
    playerFarm, 
    playerData, 
    isLoading, 
    isConfirming, 
    getFreeStarterChicken, 
    buyChicken 
  } = useGame();

  if (isLoading || !playerFarm) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent showCloseButton={false} className="flex items-center justify-center bg-[#ecb17a] border-[#b66e65]">
                <Loader2 className="h-16 w-16 animate-spin text-[#5a4535]" />
            </DialogContent>
        </Dialog>
    );
  }

  // Gerekli kontrolleri yapalım
  const hasFarm = playerFarm.farmIndex > 0;
  if (!hasFarm) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
             <DialogContent className="bg-[#ecb17a] border-[#b66e65]">
                <DialogTitle>Erişim Engellendi</DialogTitle>
                <DialogDescription>Dükkanı görebilmek için önce bir çiftlik kurmalısın.</DialogDescription>
            </DialogContent>
        </Dialog>
    );
  }

  const availablePower = playerFarm.totalProductionPower - playerFarm.currProductionPower;
  const canGetFreeChicken = !playerData.hasFreeChicken;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="border-8 sm:max-w-6xl" 
        style={{ backgroundColor: '#ecb17a', borderColor: '#b66e65' }}
        showCloseButton={false}
      >
        <DialogClose aria-label="Kapat" className="absolute right-3 top-3 size-10"><img src="/icons/close.png" alt="Kapat" className="h-10 w-10" /></DialogClose>
        <DialogHeader className="flex items-center text-center mb-4">
          <DialogTitle className="text-4xl text-[#5a4535]">Market</DialogTitle>
          <DialogDescription>
            {canGetFreeChicken 
              ? "Başlamak için ücretsiz tavuğunu al!"
              : `Kullanılabilir Güç: ${availablePower}`
            }
          </DialogDescription>
        </DialogHeader>
        
         <div className="max-h-[70vh] overflow-y-auto p-4 custom-scrollbar">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
            
            {/* ÜCRETSİZ TAVUK KARTI (Sadece alınmadıysa gösterilir) */}
            {canGetFreeChicken && (
                <ChickenCard 
                    key={starterChicken.id}
                    chicken={starterChicken}
                    isBuyable={false} // Bu normal satın alınamaz
                    isFreebie={true} // Bu onun ücretsiz olduğunu belirtir
                    isConfirming={isConfirming}
                    onBuy={() => {}} // Boş fonksiyon
                    onGetFree={getFreeStarterChicken}
                />
            )}

            {/* SATIN ALINABİLİR TAVUKLAR */}
            {shopChickenTypes.map((chicken) => {
              // Satın alınabilirlik koşulları
              const canAffordPower = availablePower >= chicken.stamina;
              const isBuyable = !canGetFreeChicken && canAffordPower; // Ücretsiz tavuk alınmadan diğerleri alınamaz
              
              return (
                <ChickenCard 
                  key={chicken.id} 
                  chicken={chicken}
                  isBuyable={isBuyable}
                  isFreebie={false} // Bunlar ücretsiz değil
                  isConfirming={isConfirming}
                  onBuy={() => buyChicken(chicken.id, 5, 5)} // Örnek koordinatlar
                  onGetFree={() => {}} // Boş fonksiyon
                />
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}