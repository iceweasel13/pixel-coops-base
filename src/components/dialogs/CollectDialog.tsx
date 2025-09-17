/**
 * @file CollectDialog.tsx
 * @description This component renders a dialog for players to claim their accumulated in-game rewards ($EGG tokens).
 * It displays the pending rewards and provides an action button to trigger the claim process.
 */

"use client";

import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { useGame } from "@/context/GameContext"; // To interact with game state and contract functions
import { Button } from "../ui/button";
import { formatEther } from "viem"; // Utility to format BigInt values into a readable decimal string
import { Loader2 } from "lucide-react";
import Image from "next/image";

/**
 * Renders the Collect Rewards Dialog.
 * The component fetches the player's pending rewards from the GameContext and allows them
 * to claim the rewards via the `claimRewards` function.
 *
 * @param {object} props - The component's properties.
 * @param {boolean} props.isOpen - Controls the visibility of the dialog.
 * @param {() => void} props.onClose - Function to call when the dialog should be closed.
 * @returns {React.ReactElement} The rendered dialog component.
 */
export function CollectDialog({ isOpen, onClose }: { isOpen: boolean; onClose: () => void; }) {
  // Fetch necessary data and actions from the global GameContext.
  const { playerData, claimRewards, isLoading, isConfirming } = useGame();

  // Format the BigInt reward value into a human-readable string (e.g., "1.5").
  // $EGG token uses 18 decimals, so formatEther is the appropriate utility.
  const formattedRewards = playerData ? formatEther(playerData.pendingRewards) : "0";
  const hasRewards = playerData && playerData.pendingRewards > BigInt(0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="bg-[#db9c74] border-[#b5785a] border-8 p-6 sm:p-8 text-[#5a4535]"
        showCloseButton={false}
      >
        <DialogClose
          aria-label="Close"
          className="absolute right-3 top-3 size-10"
        >
         <Image
                                src="/icons/close.png"
                                width={100}
                                height={100}
                                alt="Kapat"
                                className="pointer-events-none block h-10 w-10 select-none"
                              />
        </DialogClose>

        <DialogHeader className="text-center space-y-4">
          <DialogTitle className="text-4xl">Collect Rewards</DialogTitle>
          <DialogDescription>
            Withdraw your accumulated $EGG tokens to your wallet.
          </DialogDescription>
        </DialogHeader>

        {/* Rewards Display Section */}
        <div className="my-8 flex flex-col items-center justify-center gap-4">
            <Image src="/icons/egg.png" alt="$EGG Token" width={80} height={80} />
            {isLoading ? (
                <Loader2 className="h-12 w-12 animate-spin" />
            ) : (
                <div className="text-center">
                    <p className="text-lg">Accumulated Amount:</p>
                    <p className="text-5xl font-bold font-mono tracking-tighter">
                        {parseFloat(formattedRewards).toFixed(6)}
                    </p>
                    <p className="text-lg">$EGG</p>
                </div>
            )}
        </div>

        {/* Action Button */}
        <Button
          onClick={claimRewards}
          disabled={!hasRewards || isConfirming || isLoading}
          className="w-full bg-[#5a4535] hover:bg-[#5a4535]/90 text-white py-6 text-xl"
        >
          {isConfirming ? 'Confirming...' : 'Claim All'}
        </Button>
      </DialogContent>
    </Dialog>
  );
}