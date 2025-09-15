// Konum: src/components/panels/StartPanel.tsx

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useBalance } from "wagmi";

interface StartPanelProps {
    onGameStart: () => void;
}

export function StartPanel({ onGameStart }: StartPanelProps) {
    const { isConnected, address } = useAccount();
    const { data: balance, isLoading } = useBalance({
        address: address,
    });

    const shortenAddress = (addr: string | undefined) => {
        if (!addr) return "";
        return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
    };
 const buttonClassName = `w-full bg-[#a4e24d] text-black font-bold py-3 px-8 rounded-lg text-[clamp(0.9rem,4vw,1.25rem)] transition-all hover:bg-opacity-90 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed`;
    return (
        <div className="w-full max-w-md mx-auto text-white p-8 font-mono">
          
            <div className="bg-black/50 p-4 rounded-lg mb-6 min-h-[80px]">
               
                    <div>
                        <div className="mb-2">
                            <span className="text-gray-400">WALLET ADDRESS: </span>
                            <span className="text-white font-bold">{shortenAddress(address)}</span>
                        </div>
                        <div>
                            <span className="text-gray-400">WALLET BALANCE: </span>
                            {isLoading ? (
                                <span className="text-white font-bold">Loading...</span>
                            ) : (
                                <span className="text-white font-bold">
                                    {parseFloat(balance?.formatted || "0").toFixed(4)} {balance?.symbol}
                                </span>
                            )}
                        </div>
                    </div>
              
            </div>

            {/* DÜZELTME: Butonları içeren bu div'e flex özellikleri ekliyoruz.
              - flex: Esnek kutu modelini aktif eder.
              - flex-col: Elemanları dikey olarak (alt alta) hizalar.
              - gap-4: Elemanlar arasına 1rem (16px) boşluk ekler.
            */}
            <div className="flex flex-col gap-4">
                 <ConnectButton.Custom>
                    {({
                        account,
                        chain,
                        openAccountModal,
                        openChainModal,
                        openConnectModal,
                        authenticationStatus,
                        mounted,
                    }) => {
                        const ready = mounted && authenticationStatus !== 'loading';
                        const connected =
                            ready &&
                            account &&
                            chain &&
                            (!authenticationStatus ||
                                authenticationStatus === 'authenticated');

                        return (
                            <div
                                {...(!ready && {
                                    'aria-hidden': true,
                                    'style': {
                                        opacity: 0,
                                        pointerEvents: 'none',
                                        userSelect: 'none',
                                    },
                                })}
                            >
                                {(() => {
                                    if (!connected) {
                                        return (
                                            <button onClick={openConnectModal} type="button" className={buttonClassName}>
                                                CONNECT WALLET
                                            </button>
                                        );
                                    }

                                    if (chain.unsupported) {
                                        return (
                                            <button onClick={openChainModal} type="button" className={buttonClassName}>
                                                WRONG NETWORK
                                            </button>
                                        );
                                    }

                                    return (
                                        <button onClick={openAccountModal} type="button" className={buttonClassName}>
                                            {account.displayName}
                                        </button>
                                    );
                                })()}
                            </div>
                        );
                    }}
                </ConnectButton.Custom>
                <button
                    onClick={onGameStart}
                    disabled={!isConnected}
                    className="w-full bg-[#a4e24d] text-black font-bold py-3 px-8 rounded-lg text-[clamp(0.9rem,4vw,1.25rem)] transition-all
                               hover:bg-opacity-90 
                               disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                    START GAME
                </button>
            </div>
        </div>
    );
}
