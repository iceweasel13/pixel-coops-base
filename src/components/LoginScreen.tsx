// Konum: src/components/LoginScreen.tsx

import { useState } from "react";
import Image from "next/image";
import { X } from 'lucide-react';
import { StartPanel } from "./panels/StartPanel";
import { SettingsPanel } from "./panels/SettingsPanel";

interface LoginScreenProps {
    onGameStart: () => void;
}

type MenuItem = 'start' | 'settings' | 'how-to-play' | 'trade';

export function LoginScreen({ onGameStart }: LoginScreenProps) {
    const [selectedMenu, setSelectedMenu] = useState<MenuItem>('start');

    const renderPanel = () => {
        switch (selectedMenu) {
            case 'start':
                return <StartPanel onGameStart={onGameStart} />;
            case 'settings':
                return <SettingsPanel />;
            case 'how-to-play':
                 return <div className="text-center text-white p-8"><h2 className="text-3xl font-bold">How to Play Page (Coming Soon)</h2></div>;
            case 'trade':
                return <div className="text-center text-white p-8"><h2 className="text-3xl font-bold">Trade $EGG Page (Coming Soon)</h2></div>;
            default:
                return <StartPanel onGameStart={onGameStart} />;
        }
    };

    const getMenuClass = (menu: MenuItem) => {
        const baseClass = "cursor-pointer transition-colors duration-300";
        if (selectedMenu === menu) {
            return `${baseClass} text-[#a4e24d]`;
        }
        return `${baseClass} text-gray-300 hover:text-white`;
    };

    return (
        <div className="relative h-screen w-screen flex font-sans">
            {/* Arka Plan Resmi Güncellendi */}
            <Image
                src="/assets/map.png" 
                alt="Game map background"
                layout="fill"
                objectFit="cover"
                className="z-0 blur-xs" 
            />

            {/* Sol Menü Paneli */}
            <div className="w-1/3 bg-black/80 flex flex-col items-center justify-center z-10 ">
                <div className="flex flex-col items-center text-center text-2xl h-full">
                  

                    <div className="flex-grow flex flex-col justify-center items-center">
                       <span className="mb-12">
                         <Image src={'/logo.png'} alt='logo' height={240} width={240} />
                  </span>
                        <button onClick={() => setSelectedMenu('start')} className={`${getMenuClass('start')} font-bold my-8 text-4xl`}>
                            START GAME
                        </button>
                        
                        <div className="flex flex-col items-center space-y-6">
                            <button onClick={() => setSelectedMenu('settings')} className={`${getMenuClass('settings')} font-bold my-8 text-4xl`}>
                                SETTINGS
                            </button>
                            <a href="/how-to-play" target="_blank" rel="noopener noreferrer" className={`${getMenuClass('how-to-play')} font-bold  text-4xl`}>
                                HOW TO PLAY
                            </a>
                            <a href="/trade" target="_blank" rel="noopener noreferrer" className={`${getMenuClass('trade')} font-bold  text-4xl`}>
                                TRADE $EGG
                            </a>
                             <a href="https://twitter.com/yourprofile" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white bg-green-400">
                            <X size={32} />
                        </a>
                        </div>
                    </div>
                    
                   
                </div>
            </div>

            {/* Sağ İçerik Paneli */}
            <div className="w-2/3 bg-black/70 flex items-center justify-center z-10 p-8">
                {renderPanel()}
            </div>
        </div>
    );
}