import { Menu, Expand } from 'lucide-react';
import { Balance, BalanceDisplay } from './BalanceDisplay';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export function GameUI() {
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
    <div className="absolute top-4 left-0 right-4 z-10 flex justify-between items-start pointer-events-none">
        {/* Sol taraf: Bakiye Alanları */}
        <div className="flex flex-col gap-2 pl-4 pointer-events-auto">
            <BalanceDisplay balance={balances[0]} />
            <BalanceDisplay balance={balances[1]} />
        </div>

        {/* Sağ taraf: Butonlar */}
        <div className="flex flex-row gap-4 pointer-events-auto">
            <button
                onClick={toggleFullScreen}
                className="bg-gray-800 text-white p-2 rounded-md flex items-center justify-center hover:bg-gray-700 transition-colors"
                aria-label="Tam Ekran"
            >
                <Expand size={24} />
            </button>
            <ConnectButton/>
            <button
                onClick={() => alert('Menüye tıklandı!')}
                className="bg-gray-800 text-white p-2 rounded-md flex items-center gap-2 hover:bg-gray-700 transition-colors"
            >
                <Menu size={24} />
                <span>Menü</span>
            </button>
        </div>
    </div>
  );
}