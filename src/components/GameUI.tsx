import { Menu, Expand, Shrink } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Balance, BalanceDisplay } from './BalanceDisplay';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export function GameUI() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const update = () => setIsFullscreen(!!document.fullscreenElement);
    // Initialize state on mount
    update();
    document.addEventListener('fullscreenchange', update);
    return () => document.removeEventListener('fullscreenchange', update);
  }, []);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };


  const balances: Balance[] = [
    { icon: '/icons/ether.png', amount: 12.5, name: 'Ether' },
    { icon: '/icons/egg.png', amount: 150, name: 'Egg' },
  ];

  return (
    <div className="absolute top-4 left-0 right-4 z-10 flex justify-between items-start pointer-events-none text-xs md:text-base">
        {/* Sol taraf: Bakiye Alanları */}
        <div className="flex flex-col gap-2 pl-4 pointer-events-auto">
            <BalanceDisplay balance={balances[0]} />
            <BalanceDisplay balance={balances[1]} />
        </div>

        {/* Sağ taraf: Butonlar */}
        <div className="flex flex-row gap-2 pointer-events-auto">
            <button
                onClick={toggleFullScreen}
                className="bg-gray-800 text-white p-2 rounded-md flex items-center justify-center hover:bg-gray-700 transition-colors"
                aria-label={isFullscreen ? 'Exit Full Screen' : 'Full screen'}
                title={isFullscreen ? 'Exit Full Screen' : 'Full screen'}
            >
                {isFullscreen
                  ? <Shrink className="w-5 h-5 md:w-[30px] md:h-[30px]" />
                  : <Expand className="w-5 h-5 md:w-[30px] md:h-[30px]" />}
            </button>
            <ConnectButton/>
            <button
                onClick={() => alert('Clicked Menu!')}
                className="bg-gray-800 text-white p-2 rounded-md flex items-center gap-2 hover:bg-gray-700 transition-colors"
            >
                <Menu className="w-5 h-5 md:w-[30px] md:h-[30px]" />
                <span className="leading-none">Menu</span>
            </button>
        </div>
    </div>
  );
}
