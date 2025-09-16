/**
 * @file ChickenCard.tsx
 * @description A reusable component to display a single chicken's attributes and purchase options.
 * It handles various states such as eligibility, confirmation, and token approval.
 */

"use client";

import Image from "next/image";
import { Coins, Zap, Shield, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Defines the structure for the properties (props) that the ChickenCard component accepts.
 */
type ChickenCardProps = {
  chicken: { 
    id: number; 
    name: string; 
    imageUrl: string; 
    power: number; 
    stamina: number; 
    cost: number; 
  };
  isBuyable: boolean;
  isFreebie: boolean;
  isConfirming: boolean;
  hasEnoughAllowance: boolean;
  hasEnoughBalance: boolean;
  onBuy: () => void;
  onGetFree: () => void;
  onApprove: () => void; 
};

/**
 * The ChickenCard component renders a visual representation of a chicken.
 * It dynamically displays the appropriate action button (e.g., Buy, Approve, Free)
 * based on the props passed down from its parent component.
 */
export function ChickenCard({ 
    chicken, 
    isBuyable, 
    isFreebie, 
    isConfirming, 
    hasEnoughAllowance, 
    hasEnoughBalance, 
    onBuy, 
    onGetFree, 
    onApprove 
}: ChickenCardProps) {

  // Dynamically set card classes based on its state. Unbuyable cards are faded.
  const cardClasses = cn(
    "w-[250px] h-[400px] flex flex-col rounded-lg border border-[#b66e65] shadow-sm transition-transform text-stone-100",
    !isBuyable && !isFreebie && "opacity-60"
  );

  /**
   * Renders the appropriate action button based on the player's game state.
   * This logic handles free claims, approvals, purchases, and disabled states.
   * @returns {React.ReactElement} The button element to be rendered.
   */
  const renderButton = () => {
    if (isFreebie) {
      return <Button onClick={onGetFree} disabled={isConfirming}>{isConfirming ? 'Claiming...' : 'Claim for Free'}</Button>;
    }
    if (!isBuyable) {
      return <Button disabled={true}>Buy</Button>;
    }
    if (!hasEnoughBalance) {
      return <Button disabled={true}>Not enough $EGG</Button>;
    }
    if (!hasEnoughAllowance) {
      return <Button onClick={onApprove} disabled={isConfirming} variant="secondary">{isConfirming ? 'Approving...' : 'Approve'}</Button>;
    }
    return <Button onClick={onBuy} disabled={isConfirming}>{isConfirming ? 'Purchasing...' : 'Purchase'}</Button>;
  };

  return (
    <div className={cardClasses} style={{ backgroundColor: '#b66e65' }}>
      <div className="p-4 bg-black/20 rounded-t-lg relative">
        {/* Display a "FREE" badge if the chicken is a freebie. */}
        {isFreebie && (
          <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 text-xs font-bold rounded-full flex items-center gap-1">
            <Gift size={14} /> FREE
          </div>
        )}
        <Image 
          src={chicken.imageUrl} 
          alt={chicken.name} 
          width={200} 
          height={200} 
          className="mx-auto aspect-square object-contain" 
        />
      </div>
      <div className="flex flex-col p-4 flex-grow">
        <h3 className="text-lg font-bold">{chicken.name}</h3>
        {/* Chicken stats section */}
        <div className="flex flex-col gap-1 text-sm text-stone-300 mt-2">
            <div className="flex items-center gap-1.5">
                <Zap className="h-4 w-4 text-yellow-400" />
                <span>Power: {chicken.power}</span>
            </div>
            <div className="flex items-center gap-1.5">
                <Shield className="h-4 w-4 text-blue-400" />
                <span>Stamina Req: {chicken.stamina}</span>
            </div>
        </div>
        
        {/* This div pushes the purchase section to the bottom of the card. */}
        <div className="flex-grow"></div>
        
        {/* Purchase section with cost and action button. */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <Coins className="h-5 w-5 text-yellow-400" />
            <span className="text-xl font-bold">{isFreebie ? '0' : chicken.cost}</span>
          </div>
          {renderButton()}
        </div>
      </div>
    </div>
  );
}