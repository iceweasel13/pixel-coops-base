/**
 * @file CoopDialog.tsx
 * @description Renders the player's coop, displaying chicken slots and the farm upgrade panel.
 */

"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { CoopSlotCard } from "../CoopSlotCard";
import { useGame } from "@/context/GameContext";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Loader2, ArrowRight, ChevronsUp, Zap, Clock, ShieldCheck } from "lucide-react";
import { parseEther } from "viem";
import { chickenDataMap } from "@/data/chickens"; // Yeni veri dosyamızı import ediyoruz
import { farmUpgrades } from "@/data/upgrades";

// ... (farmUpgrades, formatTime, UpgradeTimer bileşenleri aynı kalıyor) ...
// moved to src/data/upgrades.ts
const formatTime = (seconds: number): string => { if (seconds <= 0) return "Ready!"; const h = Math.floor(seconds / 3600).toString().padStart(2, '0'); const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0'); const s = Math.floor(seconds % 60).toString().padStart(2, '0'); return `${h}:${m}:${s}`; };
const UpgradeTimer = ({ initialSeconds }: { initialSeconds: number }) => { const [seconds, setSeconds] = useState(initialSeconds); useEffect(() => { setSeconds(initialSeconds); const interval = setInterval(() => { setSeconds(prev => (prev > 0 ? prev - 1 : 0)); }, 1000); return () => clearInterval(interval); }, [initialSeconds]); return <span className="font-mono">{formatTime(seconds)}</span>; };


export function CoopDialog({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const {
    playerData, playerFarm, playerChickens, isLoading,
    purchaseInitialFarm, buyNewFarm, approveEggTokens, isConfirming
  } = useGame();

  const [referral, setReferral] = useState('');

  if (isLoading || !playerFarm) {
    return (<Dialog open={isOpen} onOpenChange={onClose}><DialogContent showCloseButton={false} className="flex items-center justify-center bg-[#ecb17a] border-[#b66e65]"><Loader2 className="h-16 w-16 animate-spin text-[#5a4535]" /></DialogContent></Dialog>);
  }

  if (playerFarm.farmIndex === 0) {
    return (<Dialog open={isOpen} onOpenChange={onClose}><DialogContent showCloseButton={false} className="bg-[#ecb17a] border-[#b66e65] border-8"><DialogHeader className="text-center"><DialogTitle className="text-3xl text-[#5a4535]">Establish Your Farm</DialogTitle><DialogDescription>You must purchase your first farm plot to begin.</DialogDescription></DialogHeader><div className="flex flex-col gap-4 py-4"><Input placeholder="Referral Address (Optional)" value={referral} onChange={(e) => setReferral(e.target.value)} className="bg-white/50 border-[#5a4535]" /><Button onClick={() => purchaseInitialFarm(referral)} disabled={isConfirming} className="bg-[#5a4535] hover:bg-[#5a4535]/90 text-white">{isConfirming ? 'Confirming...' : 'Purchase Farm'}</Button></div></DialogContent></Dialog>);
  }

  const totalSlots = playerFarm.maxChickens;
  const occupiedSlotsCount = playerChickens.length;

  // --- ANA DEĞİŞİKLİK BURADA ---
  const coopSlots = Array.from({ length: 10 }).map((_, index) => {
    const id = index + 1;
    if (index < occupiedSlotsCount) {
      // Kontrattan gelen tavuk verisi (dinamik)
      const ownedChicken = playerChickens[index];
      const chickenIndex = Number(ownedChicken.chickenIndex); // Tavuğun tip ID'si

      // Statik veri haritasından bu tipe ait bilgileri bul
      const templateData = chickenDataMap.get(chickenIndex) || { name: "Bilinmeyen Tavuk", imageUrl: "/assets/chickens/chicken1.png" };

      // Dinamik ve statik veriyi birleştirerek tam bir tavuk objesi oluştur
      const fullChickenData = {
        ...templateData,
        ...ownedChicken,
        // Use sitting chicken sprites in My Coop view
        imageUrl: `/assets/sittingChicken/chicken${chickenIndex}.png`,
      };

      return { id, status: 'occupied' as const, chicken: fullChickenData };
    }
    if (index < totalSlots) { return { id, status: 'empty' as const }; }
    return { id, status: 'locked' as const };
  });

  const nextUpgrade = farmUpgrades.find(upgrade => upgrade.maxChickens === totalSlots + 1);

  const renderUpgradeButton = () => { /* Bu fonksiyon aynı kalıyor */ if (!nextUpgrade) return null; const costInBigInt = parseEther(nextUpgrade.cost.toString()); const hasEnoughBalance = playerData.eggTokenBalance >= costInBigInt; const hasEnoughAllowance = playerData.eggTokenAllowance >= costInBigInt; if (!hasEnoughBalance) { return <Button disabled={true} className="w-full bg-[#5a4535] text-white py-6 text-lg">Insufficient $EGG</Button>; } if (!hasEnoughAllowance) { return <Button onClick={approveEggTokens} disabled={isConfirming} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg flex items-center gap-2"><ShieldCheck /> {isConfirming ? 'Approving...' : `Approve $EGG`}</Button>; } return <Button onClick={buyNewFarm} disabled={isConfirming || playerData.farmUpgradeCooldown > 0} className="w-full bg-[#5a4535] hover:bg-[#5a4535]/90 text-white py-6 text-lg">{isConfirming ? 'Upgrading...' : 'Upgrade'}</Button>; };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="border-8 sm:max-w-7xl text-[#5a4535] max-h-[calc(100vh-2rem)] overflow-y-auto" style={{ backgroundColor: '#ecb17a', borderColor: '#b66e65' }} showCloseButton={false}>
        <DialogClose
          aria-label="Kapat"
          className="absolute right-3 top-3 size-10 cursor-pointer rounded-xs border-0 bg-transparent opacity-90 transition-opacity hover:opacity-100 focus:outline-none focus:ring-0"
        >
          <Image
            src="/icons/close.png"
            width={100}
            height={100}
            alt="Kapat"
            className="pointer-events-none block h-10 w-10 select-none"
          />
        </DialogClose>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4">
          <div className="lg:col-span-2">
            <DialogHeader className="text-center mb-4">
              <DialogTitle className="text-4xl">My Coop</DialogTitle>
              <DialogDescription><span className="inline-flex bg-[#b66e65] p-2 text-stone-100 rounded-md font-bold">Occupied Slots: {occupiedSlotsCount} / {totalSlots}</span></DialogDescription>
            </DialogHeader>
            <div className="max-h-[60vh] overflow-y-auto p-2 custom-scrollbar">
              <div className="flex flex-row flex-wrap justify-center gap-4">
                {coopSlots.map((slot) => (<CoopSlotCard key={slot.id} slot={slot} />))}
              </div>
            </div>
          </div>
          <div className="bg-[#d49e6a] p-6 rounded-lg border-2 border-[#b66e65]">
            <h3 className="text-2xl font-bold text-center mb-4">Next Upgrade</h3>
            {nextUpgrade ? (
              <div className="flex flex-col gap-4">
                <div className="text-center bg-white/30 p-2 rounded"><p className="text-sm">LEVEL</p><p className="text-2xl font-bold">{playerFarm.maxChickens - 1} <ArrowRight className="inline-block" /> {nextUpgrade.level}</p></div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center"><span className="flex items-center gap-2"><ChevronsUp size={18} /> New Slot Capacity:</span><span className="font-bold">{nextUpgrade.maxChickens}</span></div>
                  <div className="flex justify-between items-center"><span className="flex items-center gap-2"><Zap size={18} /> Total Power Capacity:</span><span className="font-bold">{nextUpgrade.totalProductionPower}</span></div>
                  <div className="flex justify-between items-center"><span className="flex items-center gap-2"><Clock size={18} /> Cooldown Time:</span><UpgradeTimer initialSeconds={playerData.farmUpgradeCooldown} /></div>
                </div>
                <hr className="border-[#b66e65] my-2" />
                <div className="text-center"><p>Upgrade Cost</p><p className="text-3xl font-bold">{nextUpgrade.cost} $EGG</p></div>
                {renderUpgradeButton()}
              </div>
            ) : (
              <div className="text-center p-8"><p className="font-bold">Congratulations!</p><p>Your farm has reached the maximum level.</p></div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
