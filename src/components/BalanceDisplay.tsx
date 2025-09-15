"use client";

import Image from "next/image";

// Component'in alacağı props'ların tipini tanımlıyoruz
interface BalanceDisplayProps {
  icon: string;
  name: string;
  amount?: string; // Wagmi'den gelen formatlanmış string
  isLoading: boolean;
}

export function BalanceDisplay({ icon, name, amount, isLoading }: BalanceDisplayProps) {
  return (
    <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm p-2 rounded-lg border border-white/10 w-48">
      <Image src={icon} alt={name} width={32} height={32} />
      <div className="flex flex-col">
        <span className="text-sm text-gray-300">{name}</span>
        <span className="text-lg font-bold text-white">
          {isLoading ? '...' : (amount ? parseFloat(amount).toFixed(4) : '0.00')}
        </span>
      </div>
    </div>
  );
}