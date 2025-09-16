import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { CoopSlotCard } from "../CoopSlotCard";
import { useGame } from "@/context/GameContext";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Loader2, ArrowRight, ChevronsUp, Zap, Clock } from "lucide-react";

// --- Yükseltme Bilgileri Dizisi ---
const farmUpgrades = [
    // Seviye, maxChickens, totalProductionPower, cost (EGG), x, y
    { level: 2, maxChickens: 3, totalProductionPower: 300, cost: 150, x: 1, y: 3 },
    { level: 3, maxChickens: 4, totalProductionPower: 520, cost: 350, x: 1, y: 4 },
    { level: 4, maxChickens: 5, totalProductionPower: 820, cost: 700, x: 1, y: 5 },
    { level: 5, maxChickens: 6, totalProductionPower: 1250, cost: 1300, x: 1, y: 6 },
    { level: 6, maxChickens: 7, totalProductionPower: 1850, cost: 2400, x: 1, y: 7 },
    { level: 7, maxChickens: 8, totalProductionPower: 2750, cost: 4500, x: 1, y: 8 },
    { level: 8, maxChickens: 9, totalProductionPower: 4050, cost: 8000, x: 1, y: 9 },
    { level: 9, maxChickens: 10, totalProductionPower: 6050, cost: 15000, x: 1, y: 10 },
];

// Geri sayım sayacını formatlamak için yardımcı fonksiyon
const formatTime = (seconds: number) => {
    if (seconds <= 0) return "Hazır!";
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
};

// Geri Sayım Sayacı Bileşeni
const UpgradeTimer = ({ initialSeconds }: { initialSeconds: number }) => {
    const [seconds, setSeconds] = useState(initialSeconds);
    useEffect(() => {
        setSeconds(initialSeconds); // Dışarıdan gelen veri değiştiğinde state'i güncelle
        const interval = setInterval(() => {
            setSeconds(prev => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(interval);
    }, [initialSeconds]);
    return <span className="font-mono">{formatTime(seconds)}</span>;
};

export function CoopDialog({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { 
    playerData, 
    playerFarm, 
    playerChickens, 
    isLoading, 
    purchaseInitialFarm,
    buyNewFarm,
    isConfirming
  } = useGame();
  
  const [referral, setReferral] = useState('');

  // --- Yüklenme Durumu ---
  if (isLoading) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent showCloseButton={false} className="flex items-center justify-center bg-[#ecb17a] border-[#b66e65]">
                <Loader2 className="h-16 w-16 animate-spin text-[#5a4535]" />
            </DialogContent>
        </Dialog>
    );
  }

  // --- Başlangıç Çiftliği Satın Alma Ekranı ---
  if (!playerFarm || playerFarm.farmIndex === 0) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent showCloseButton={false} className="bg-[#ecb17a] border-[#b66e65] border-8">
                <DialogHeader className="text-center">
                    <DialogTitle className="text-3xl text-[#5a4535]">Çiftliğini Kur!</DialogTitle>
                    <DialogDescription>Oyuna başlamak için ilk çiftlik alanını satın almalısın.</DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-4 py-4">
                    <Input 
                        placeholder="Referans Adresi (Opsiyonel)"
                        value={referral}
                        onChange={(e) => setReferral(e.target.value)}
                        className="bg-white/50 border-[#5a4535]"
                    />
                    <Button 
                        onClick={() => purchaseInitialFarm(referral)} 
                        disabled={isConfirming}
                        className="bg-[#5a4535] hover:bg-[#5a4535]/90 text-white"
                    >
                        {isConfirming ? 'İşlem Onaylanıyor...' : 'Çiftliği Satın Al'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
  }

  // --- Mevcut Kümes ve Yükseltme Ekranı ---
  const totalSlots = playerFarm.maxChickens;
  const occupiedSlotsCount = playerChickens.length;

  const coopSlots = Array.from({ length: 10 }).map((_, index) => {
    const id = index + 1;
    if (index < occupiedSlotsCount) {
        return { id, status: 'occupied' as const, chicken: { ...playerChickens[index], imageUrl: '/chickens/chicken-1.png' } };
    }
    if (index < totalSlots) {
        return { id, status: 'empty' as const };
    }
    return { id, status: 'locked' as const };
  });

  // Bir sonraki yükseltme seviyesini bul
  const nextUpgrade = farmUpgrades.find(upgrade => upgrade.maxChickens === totalSlots + 1);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="border-8 sm:max-w-5xl text-[#5a4535]"
        style={{ backgroundColor: '#ecb17a', borderColor: '#b66e65' }}
        showCloseButton={false}
      >
        <DialogClose
          aria-label="Kapat"
          className="absolute right-3 top-3 z-20 size-10"
        >
          <img src="/icons/close.png" alt="Kapat" className="h-10 w-10" />
        </DialogClose>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4">
            {/* Sol Taraf: Kümes Slotları */}
            <div className="lg:col-span-2">
                <DialogHeader className="text-center mb-4">
                    <DialogTitle className="text-4xl">Kümesim</DialogTitle>
                    <DialogDescription>Mevcut Alan: {occupiedSlotsCount} / {totalSlots}</DialogDescription>
                </DialogHeader>
                <div className="max-h-[60vh] overflow-y-auto p-2 custom-scrollbar">
                    <div className="flex flex-row flex-wrap justify-center gap-4">
                        {coopSlots.map((slot) => (
                            <CoopSlotCard key={slot.id} slot={slot} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Sağ Taraf: Yükseltme Paneli */}
            <div className="bg-[#d49e6a] p-6 rounded-lg border-2 border-[#b66e65]">
                <h3 className="text-2xl font-bold text-center mb-4">Sıradaki Yükseltme</h3>
                {nextUpgrade ? (
                    <div className="flex flex-col gap-4">
                        <div className="text-center bg-white/30 p-2 rounded">
                            <p className="text-sm">SEVİYE</p>
                            <p className="text-2xl font-bold">{playerFarm.maxChickens - 1} <ArrowRight className="inline-block" /> {nextUpgrade.level}</p>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="flex items-center gap-2"><ChevronsUp size={18}/> Yeni Slot Sayısı:</span>
                                <span className="font-bold">{nextUpgrade.maxChickens}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="flex items-center gap-2"><Zap size={18}/> Toplam Güç Kapasitesi:</span>
                                <span className="font-bold">{nextUpgrade.totalProductionPower}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="flex items-center gap-2"><Clock size={18}/> Bekleme Süresi:</span>
                                <UpgradeTimer initialSeconds={playerData.farmUpgradeCooldown} />
                            </div>
                        </div>
                        <hr className="border-[#b66e65] my-2"/>
                        <div className="text-center">
                            <p>Yükseltme Bedeli</p>
                            <p className="text-3xl font-bold">{nextUpgrade.cost} $EGG</p>
                        </div>
                        <Button 
                            onClick={buyNewFarm}
                            disabled={isConfirming || playerData.farmUpgradeCooldown > 0}
                            className="w-full bg-[#5a4535] hover:bg-[#5a4535]/90 text-white py-6 text-lg"
                        >
                            {isConfirming ? 'Yükseltiliyor...' : 'Yükselt'}
                        </Button>
                    </div>
                ) : (
                    <div className="text-center p-8">
                        <p className="font-bold">Tebrikler!</p>
                        <p>Çiftliğin son seviyeye ulaştı.</p>
                    </div>
                )}
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}