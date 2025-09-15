"use client";

import { useAccount, useBalance } from 'wagmi';
import { BalanceDisplay } from '../BalanceDisplay';
import { eggTokenContract } from '@/contracts'; // Kontrat bilgilerimizi import ediyoruz

export function Balances() {
  const { address, isConnected } = useAccount();

  // 1. ETH bakiyesini çek
  const { data: ethBalance, isLoading: isEthLoading } = useBalance({
    address: address,
    // chainId: baseSepolia.id, // Gerekirse zincir ID'si belirtebilirsin
  });

  // 2. EGG Token bakiyesini çek
  const { data: eggBalance, isLoading: isEggLoading } = useBalance({
    address: address,
    token: eggTokenContract.address, // Hangi token'ın bakiyesini istediğimizi belirtiyoruz
    // chainId: baseSepolia.id,
  });

  if (!isConnected) {
    return null; // Cüzdan bağlı değilse hiçbir şey gösterme
  }

  return (
    <div className="absolute top-4 left-0 right-4 z-10 flex justify-between items-start pointer-events-none">
      {/* Sol taraf: Bakiye Alanları */}
      <div className="flex flex-col gap-2 pl-4 pointer-events-auto">
        <BalanceDisplay 
          icon="/icons/ether.png" 
          name={ethBalance?.symbol || 'ETH'} 
          amount={ethBalance?.formatted}
          isLoading={isEthLoading} 
        />
        <BalanceDisplay 
          icon="/icons/egg.png" 
          name={eggBalance?.symbol || 'EGG'}
          amount={eggBalance?.formatted}
          isLoading={isEggLoading}
        />
      </div>
      
      
      <div></div>
    </div>
  );
}