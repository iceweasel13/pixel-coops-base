import { Menu, Expand, Shrink } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Balances } from './game-ui/Balances';

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


 

  return (
    <div className="absolute top-4 left-0 right-4 z-10 flex justify-between items-start pointer-events-none">
        {/* Sol taraf: Bakiye Alanları */}
        <div className="flex flex-col gap-2 pl-4 pointer-events-auto">
            <Balances />
        </div>

        {/* Sağ taraf: Butonlar */}
        <div className="flex flex-row gap-4 pointer-events-auto">
            <button
                onClick={toggleFullScreen}
                className="bg-gray-800 text-white p-2 rounded-md flex items-center justify-center hover:bg-gray-700 transition-colors"
                aria-label={isFullscreen ? 'Tam Ekrandan Çık' : 'Tam Ekran'}
                title={isFullscreen ? 'Tam Ekrandan Çık' : 'Tam Ekran'}
            >
                {isFullscreen ? <Shrink size={30} /> : <Expand size={30} />}
            </button>
           
            <button
                onClick={() => alert('Menüye tıklandı!')}
                className="bg-gray-800 text-white p-2 rounded-md flex items-center gap-2 hover:bg-gray-700 transition-colors"
            >
                <Menu size={30} />
                <span>Menü</span>
            </button>
        </div>
    </div>
  );
}
