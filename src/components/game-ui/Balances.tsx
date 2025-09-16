"use client";

import { useAccount, useBalance } from 'wagmi';
import { BalanceDisplay } from '../BalanceDisplay';
import { useGame } from '@/context/GameContext'; // CONTEXT'İ İMPORT ET
import { formatEther } from 'viem';

export function Balances() {
  const { address, isConnected } = useAccount();
  const { playerData, isLoading } = useGame(); // CONTEXT'TEN VERİLERİ ÇEK

 
  const { data: ethBalance, isLoading: isEthLoading } = useBalance({
    address: address,
  });

  if (!isConnected) {
    return null;
  }


  const formattedEggBalance = formatEther(playerData.eggTokenBalance);

  return (
    <div className="absolute top-2 left-0 right-4 z-10 flex justify-between items-start pointer-events-none">
      <div className="flex flex-col gap-2 pl-4 pointer-events-auto">
        <BalanceDisplay
          icon="/icons/ether.png"
          name={ethBalance?.symbol || 'ETH'}
          amount={ethBalance?.formatted}
          isLoading={isEthLoading}
        />
        <BalanceDisplay
          icon="/icons/egg.png"
          name={'EGG'}
          amount={formattedEggBalance}
          isLoading={isLoading} // Context'in yüklenme durumunu kullan
        />
      </div>
    </div>
  );
}