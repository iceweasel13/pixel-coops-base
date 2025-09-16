"use client";

import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { useGame } from "@/context/GameContext"; // Oyun verilerini ve fonksiyonlarını çekmek için
import { Button } from "../ui/button";
import { formatEther } from "viem"; // BigInt'i ondalıklı sayıya çevirmek için
import { Loader2 } from "lucide-react";
import Image from "next/image";

export function CollectDialog({ isOpen, onClose }: { isOpen: boolean; onClose: () => void; }) {
  // GameContext'ten gerekli verileri ve fonksiyonları alıyoruz
  const { playerData, claimRewards, isLoading, isConfirming } = useGame();

  // Ödül miktarını formatlayalım (BigInt'ten okunabilir string'e)
  // EGG token'ı 18 ondalığa sahip olduğu için formatEther'ı kullanabiliriz.
  const formattedRewards = playerData ? formatEther(playerData.pendingRewards) : "0";
  const hasRewards = playerData && playerData.pendingRewards > BigInt(0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="bg-[#db9c74] border-[#b5785a] border-8 p-6 sm:p-8 text-[#5a4535]"
        showCloseButton={false}
      >
        <DialogClose
          aria-label="Kapat"
          className="absolute right-3 top-3 size-10"
        >
          <img src="/icons/close.png" alt="Kapat" className="h-10 w-10" />
        </DialogClose>

        <DialogHeader className="text-center space-y-4">
          <DialogTitle className="text-4xl">Ödülleri Topla</DialogTitle>
          <DialogDescription>
            Birikmiş $EGG tokenlarını cüzdanına çek.
          </DialogDescription>
        </DialogHeader>

        <div className="my-8 flex flex-col items-center justify-center gap-4">
            <Image src="/icons/egg.png" alt="$EGG Token" width={80} height={80} />
            {isLoading ? (
                <Loader2 className="h-12 w-12 animate-spin" />
            ) : (
                <div className="text-center">
                    <p className="text-lg">Biriken Miktar:</p>
                    <p className="text-5xl font-bold font-mono tracking-tighter">
                        {parseFloat(formattedRewards).toFixed(6)}
                    </p>
                    <p className="text-lg">$EGG</p>
                </div>
            )}
        </div>

        <Button
          onClick={claimRewards}
          disabled={!hasRewards || isConfirming || isLoading}
          className="w-full bg-[#5a4535] hover:bg-[#5a4535]/90 text-white py-6 text-xl"
        >
          {isConfirming ? 'Onaylanıyor...' : 'Tümünü Topla'}
        </Button>
      </DialogContent>
    </Dialog>
  );
}