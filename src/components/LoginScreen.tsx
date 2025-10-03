// Konum: src/components/LoginScreen.tsx

import { useState } from "react";
import Image from "next/image";
import { StartPanel } from "./panels/StartPanel";
import { SettingsPanel } from "./panels/SettingsPanel";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

interface LoginScreenProps {
    onGameStart: () => void;
}

type MenuItem = "start" | "settings" | "how-to-play" | "trade";

export function LoginScreen({ onGameStart }: LoginScreenProps) {
    const [selectedMenu, setSelectedMenu] = useState<MenuItem>("start");

    const renderPanel = () => {
        switch (selectedMenu) {
            case "start":
                return <StartPanel onGameStart={onGameStart} />;
            case "settings":
                return <SettingsPanel />;
            case "how-to-play":
                return (
                    <div className="text-center text-white p-8">
                        <h2 className="text-2xl font-bold">
                            How to Play Page (Coming Soon)
                        </h2>
                    </div>
                );
            case "trade":
                return (
                    <div className="text-center text-white p-8">
                        <h2 className="text-2xl font-bold">
                            Trade $EGG Page (Coming Soon)
                        </h2>
                    </div>
                );
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
                fill // 'layout="fill"' yerine 'fill' kullan
                style={{ objectFit: "cover" }} // 'objectFit' prop'unu style içine al
                className="z-0 blur-sm"
                priority // LCP uyarısı için bu prop'u ekle
            />

            {/* Sol Menü Paneli */}
            <div className="w-1/3 bg-black/80 flex flex-col items-center justify-center z-10 ">
                <div className="flex flex-col items-center text-center text-2xl h-full">
                    <div className="flex-grow flex flex-col justify-center items-center">
                        <span className="mb-12">
                            <Image
                                src={"/logo.png"}
                                alt="logo"
                                height={240}
                                width={240}
                            />
                        </span>
                        <button
                            onClick={() => setSelectedMenu("start")}
                            className={`${getMenuClass(
                                "start"
                            )} font-bold my-8 text-base sm:text-xl md:text-2xl lg:text-3xl`}
                        >
                            START GAME
                        </button>

                        <div className="flex flex-col items-center space-y-6">
                            <button
                                onClick={() => setSelectedMenu("settings")}
                                className={`${getMenuClass(
                                    "settings"
                                )} font-bold my-8 text-base sm:text-xl md:text-2xl lg:text-3xl`}
                            >
                                SETTINGS
                            </button>
                            <Link
                                href="/how-to-play"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`${getMenuClass(
                                    "how-to-play"
                                )} font-bold  text-base sm:text-xl md:text-2xl lg:text-3xl`}
                            >
                                <span className="inline-flex items-center gap-2">
                                    HOW TO PLAY
                                    <ExternalLink className="w-5 h-5" />
                                </span>
                            </Link>
                            <Link
                                href={`https://app.uniswap.org/swap?inputCurrency=${process.env.NEXT_PUBLIC_EGG_TOKEN_CONTRACT}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`${getMenuClass(
                                    "trade"
                                )} font-bold  text-base sm:text-xl md:text-2xl lg:text-3xl`}
                            >
                                <span className="inline-flex items-center gap-2">
                                    TRADE $EGG
                                    <ExternalLink className="w-5 h-5" />
                                </span>
                            </Link>
                            <Link
                                href="https://twitter.com/pixelcoops"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center w-10 h-10 rounded-sm bg-black text-gray-400 hover:text-white border border-gray-700 transition-colors"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    width="20"
                                    height="20"
                                    fill="currentColor"
                                    aria-label="X (Twitter)"
                                >
                                    <path d="M2 3h5.2l5.37 7.36L18.6 3H22l-7.33 9.92L22 21h-5.2l-5.66-7.77L5.4 21H2l7.58-10.24L2 3z" />
                                </svg>
                            </Link>
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
