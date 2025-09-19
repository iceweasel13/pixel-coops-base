/**
 * @file ShopDialog.tsx
 * @description This component renders the in-game shop, allowing players to purchase chickens.
 * It dynamically displays available chickens, handles purchase eligibility based on game state,
 * and manages the UI for both free and paid acquisitions.
 */

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { ChickenCard } from "../ChickenCard";
import { useGame } from "@/context/GameContext";
import { Loader2 } from "lucide-react";
import { parseEther } from "viem";
import { starterChickenData, purchasableChickens } from "@/data/chickens";
import Image from "next/image";
import { useEffect, useState } from "react";
/**
 * Static data definition for the special, one-time starter chicken.
 * This is kept separate from purchasable chickens to handle its unique logic.
 */

/**
 * An array of chicken objects available for purchase in the shop.
 * The 'id' here MUST match the 'chickenIndex' on the smart contract.
 * The first purchasable chicken added by the owner will have an index of 2.
 */

/**
 * Renders the Shop Dialog component.
 * It fetches game state from the GameContext to determine which chickens are available
 * and whether the player meets the requirements to purchase them.
 *
 * @param {object} props - The component's properties.
 * @param {boolean} props.isOpen - Controls the visibility of the dialog.
 * @param {() => void} props.onClose - Function to call when the dialog should be closed.
 * @returns {React.ReactElement} The rendered dialog component.
 */
export function ShopDialog({ isOpen, onClose }: { isOpen: boolean; onClose: () => void; }) {
  const { playerFarm, playerData, isLoading, isConfirming, getFreeStarterChicken, buyChicken, approveEggTokens } = useGame();

  // Track which specific card initiated the current confirming action
  // so only that card shows the loading state.
  const [activeCardKey, setActiveCardKey] = useState<string | number | null>(null);

  // Clear the active card when global confirming finishes.
  useEffect(() => {
    if (!isConfirming) setActiveCardKey(null);
  }, [isConfirming]);

  if (isLoading || !playerFarm || !playerData) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent showCloseButton={false} className="flex items-center justify-center bg-[#ecb17a] border-[#b66e65]">
          <Loader2 className="h-16 w-16 animate-spin text-[#5a4535]" />
        </DialogContent>
      </Dialog>
    );
  }

  if (playerFarm.farmIndex === 0) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="bg-[#ecb17a] border-[#b66e65]">
          <DialogTitle>Access Denied</DialogTitle>
          <DialogDescription>You must set up a farm before you can access the market.</DialogDescription>
        </DialogContent>
      </Dialog>
    );
  }

  const availablePower = playerFarm.totalProductionPower - playerFarm.currProductionPower;
  const canGetFreeChicken = !playerData.hasFreeChicken;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="border-8 sm:max-w-6xl" style={{ backgroundColor: '#ecb17a', borderColor: '#b66e65' }} showCloseButton={false}>
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
        <DialogHeader className="flex flex-col gap-2 mb-4">
          <DialogTitle className="text-4xl text-[#5a4535] text-center">Marketplace</DialogTitle>
          <DialogDescription>
            <span className="inline-flex bg-[#b66e65] p-2 text-stone-100 rounded-md font-bold">
              {canGetFreeChicken ? "Claim your free starter chicken to begin!" : `Available Power: ${availablePower}`}
            </span>
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[70vh] overflow-y-auto p-4 custom-scrollbar">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">

            {canGetFreeChicken && (
              <ChickenCard
                key={starterChickenData.id}
                chicken={starterChickenData}
                isBuyable={false}
                isFreebie={true}
                isConfirming={isConfirming && activeCardKey === "free"}
                hasEnoughAllowance={true}
                hasEnoughBalance={true}
                onBuy={() => { }}
                onGetFree={() => {
                  setActiveCardKey("free");
                  getFreeStarterChicken();
                }}
                onApprove={() => { }}
              />
            )}

            {purchasableChickens.map((chicken) => {
              const costInBigInt = parseEther(chicken.cost.toString());
              const isBuyable = !canGetFreeChicken && availablePower >= chicken.stamina;
              const hasEnoughBalance = playerData.eggTokenBalance >= costInBigInt;
              const hasEnoughAllowance = playerData.eggTokenAllowance >= costInBigInt;

              return (
                <ChickenCard
                  key={chicken.id}
                  chicken={chicken}
                  isBuyable={isBuyable}
                  isFreebie={false}
                  isConfirming={isConfirming && activeCardKey === chicken.id}
                  hasEnoughBalance={hasEnoughBalance}
                  hasEnoughAllowance={hasEnoughAllowance}
                  onBuy={() => {
                    setActiveCardKey(chicken.id);
                    buyChicken(chicken.id);
                  }}
                  onApprove={() => {
                    setActiveCardKey(chicken.id);
                    approveEggTokens();
                  }}
                  onGetFree={() => { }}
                />
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
