"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from "@/components/ui/dialog";
import { SettingsPanel } from "@/components/panels/SettingsPanel";
import { useAccount, useBalance, useDisconnect } from "wagmi";
import { signOut } from "next-auth/react";
import { Copy, LogOut, ExternalLink, Loader2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useGame } from "@/context/GameContext"; // Context'i import et
import { formatEther } from "viem";
import Link from "next/link";

type MenuItem = "settings" | "how-to-play" | "trade" | "profile" | "referrals";

export type MenuDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

function WalletArea() {
    const { address } = useAccount();
    const { data: ethBalance, isLoading: isEthLoading } = useBalance({
        address,
    });
    const { playerData, isLoading: isGameLoading } = useGame(); // Context'ten veri al
    const [copied, setCopied] = useState(false);

    const shortenAddress = (addr: string | undefined) => {
        if (!addr) return "";
        const start = 6;
        const end = 6;
        return `${addr.substring(0, start)}...${addr.substring(
            addr.length - end
        )}`;
    };

    const handleCopy = async () => {
        if (!address) return;
        try {
            await navigator.clipboard.writeText(address);
            setCopied(true);
            setTimeout(() => setCopied(false), 1200);
        } catch (_) {
            // noop
        }
    };

    return (
        <div className="w-full max-w-lg mx-auto text-white">
            <div className="bg-black/50 p-6 rounded-lg space-y-4">
                <div>
                    <h3 className="text-base font-semibold">Wallet Address</h3>
                    <div className="mt-2 flex items-center justify-between gap-3 bg-black/30 rounded-md px-3 py-2">
                        <span className="font-mono text-sm">
                            {shortenAddress(address)}
                        </span>
                        <button
                            onClick={handleCopy}
                            className="inline-flex items-center gap-1 bg-gray-700 hover:bg-gray-600 text-white text-xs font-semibold px-3 py-2 rounded-md disabled:opacity-60"
                            disabled={!address}
                            title={address ? "Copy address" : "No address"}
                        >
                            <Copy className="w-4 h-4" />
                            {copied ? "Copied" : "Copy"}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-black/30 rounded-md px-3 py-2">
                        <div className="text-gray-400 text-xs">ETH Balance</div>
                        <div className="text-white font-semibold text-sm mt-1">
                            {isEthLoading
                                ? "Loading..."
                                : `${parseFloat(
                                      ethBalance?.formatted || "0"
                                  ).toFixed(5)} ${ethBalance?.symbol || "ETH"}`}
                        </div>
                    </div>
                    <div className="bg-black/30 rounded-md px-3 py-2">
                        <div className="text-gray-400 text-xs">EGG Balance</div>
                        <div className="text-white font-semibold text-sm mt-1">
                            {isGameLoading
                                ? "Loading..."
                                : `${parseFloat(
                                      formatEther(playerData.eggTokenBalance)
                                  ).toFixed(4)} EGG`}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ReferralsPanel({ onClose }: { onClose: () => void }) {
    const { address } = useAccount();
    const { playerData, isLoading } = useGame(); // Context'ten veri al
    const [copied, setCopied] = useState(false);

    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    const referralUrl = `${baseUrl}?ref=${address ?? ""}`;

    const copyReferral = async () => {
        try {
            await navigator.clipboard.writeText(referralUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 1200);
        } catch (_) {
            // noop
        }
    };

    return (
        <div className="w-full text-white p-6 max-w-2xl">
            <h2 className="text-2xl font-bold mb-1">Refer a Friend</h2>
            <p className="text-gray-300 mb-5">
                Share your referral link with friends and earn 2.5% of the $EGG
                coins they earn!
            </p>

            {isLoading ? (
                <div className="flex justify-center items-center h-24">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                        <div className="bg-black/50 rounded-lg p-4">
                            <div className="text-gray-400 text-xs">
                                Total Referrals
                            </div>
                            <div className="text-white text-xl font-bold mt-1">
                                {playerData.totalReferrals}
                            </div>
                        </div>
                        <div className="bg-black/50 rounded-lg p-4">
                            <div className="text-gray-400 text-xs">
                                Total EGG Earned
                            </div>
                            <div className="text-white text-xl font-bold mt-1">
                                {parseFloat(
                                    formatEther(playerData.totalReferralBonus)
                                ).toFixed(4)}{" "}
                                $EGG
                            </div>
                        </div>
                    </div>

                    <div className="bg-black/50 rounded-lg p-4">
                        <h3 className="font-semibold mb-2">
                            Your Referral Link
                        </h3>
                        <div className="flex gap-2 items-stretch sm:items-center">
                            <input
                                readOnly
                                value={referralUrl}
                               className="flex-1 basis-0 min-w-0 max-w-[65%] sm:max-w-none bg-black/40 text-gray-200 px-3 py-2 rounded border border-gray-700 focus:outline-none"  />
                            <button
                                onClick={copyReferral}
                             className="inline-flex shrink-0 items-center gap-1 bg-gray-700 hover:bg-gray-600 text-white text-xs font-semibold px-3 py-2 rounded-md"   >
                                <Copy className="w-4 h-4" />
                                {copied ? "Copied" : "Copy"}
                            </button>
                        </div>
                    </div>
                </>
            )}

            
        </div>
    );
}

// BU KISIMLAR DEÄÄ°ÅMEDÄ°
export function MenuDialog({ open, onOpenChange }: MenuDialogProps) {
    const [selectedMenu, setSelectedMenu] = useState<MenuItem>("profile");
    useEffect(() => {
        if (open) {
            setSelectedMenu("profile");
        }
    }, [open]);
    const renderPanel = () => {
        switch (selectedMenu) {
            case "settings":
                return <SettingsPanel />;
            case "profile":
                return <ProfilePanel onClose={() => onOpenChange(false)} />;
            case "referrals":
                return <ReferralsPanel onClose={() => onOpenChange(false)} />;
            case "how-to-play":
                return (
                    <div className="text-center text-white p-8">
                        <h2 className="text-3xl font-bold">
                            How to Play (Coming Soon)
                        </h2>
                    </div>
                );
            case "trade":
                return (
                    <div className="text-center text-white p-8">
                        <h2 className="text-3xl font-bold">
                            Trade $EGG Page (Coming Soon)
                        </h2>
                    </div>
                );
            default:
                return null;
        }
    };
    const getMenuClass = (menu: MenuItem) => {
        const baseClass = "cursor-pointer transition-colors duration-300";
        if (selectedMenu === menu) return `${baseClass} text-[#a4e24d]`;
        return `${baseClass} text-gray-300 hover:text-white`;
    };
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                showCloseButton={false}
                className="bg-black/30 border-none p-0 w-full max-w-[min(100vw-1rem,64rem)] sm:max-w-4xl max-h-[calc(100vh-2rem)] overflow-y-auto overflow-x-hidden"
            >
                <div className="relative w-full rounded-lg bg-black/70 px-4 pb-4 pt-12 sm:p-6 overflow-hidden">
                    <DialogClose
                        aria-label="Close"
                        className="absolute right-2 top-2 size-8 sm:right-3 sm:top-3 sm:size-10"
                    >
                        <Image
                            src="/icons/close.png"
                            alt="Close"
                            className="h-8 w-8 sm:h-10 sm:w-10"
                            width={40}
                            height={40}
                        />
                    </DialogClose>
                    <div className="flex h-full min-h-[420px] w-full flex-col md:flex-row">
                        <div className="w-full md:w-1/3 bg-black/80 flex flex-col items-center justify-center px-4 py-6 sm:px-6 sm:py-6 gap-4 sm:gap-6 text-center">
                            <button
                                onClick={() => onOpenChange(false)}
                                className="flex w-full items-center justify-center rounded-lg bg-[#a4e24d] px-4 py-2 text-xs font-bold uppercase tracking-wide text-black shadow transition-colors hover:bg-[#93cf3f] sm:text-sm md:text-base lg:text-lg"
                            >
                                RETURN TO GAME
                            </button>
                            <button
                                onClick={() => setSelectedMenu("profile")}
                                className={`${getMenuClass(
                                    "profile"
                                )} block w-full text-center font-bold text-xs sm:text-sm md:text-base lg:text-lg`}
                            >
                                PROFILE
                            </button>
                            <button
                                onClick={() => setSelectedMenu("referrals")}
                                className={`${getMenuClass(
                                    "referrals"
                                )} block w-full text-center font-bold text-xs sm:text-sm md:text-base lg:text-lg`}
                            >
                                REFERRALS
                            </button>
                            <button
                                onClick={() => setSelectedMenu("settings")}
                                className={`${getMenuClass(
                                    "settings"
                                )} block w-full text-center font-bold text-xs sm:text-sm md:text-base lg:text-lg`}
                            >
                                SETTINGS
                            </button>
                            <Link
                                href="/how-to-play"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`${getMenuClass(
                                    "how-to-play"
                                )} block w-full text-center font-bold text-xs sm:text-sm md:text-base lg:text-lg`}
                            >
                                <span className="inline-flex items-center gap-2">
                                    HOW TO PLAY
                                    <ExternalLink className="w-4 h-4" />
                                </span>
                            </Link>
                            <Link
                                href="/trade"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`${getMenuClass(
                                    "trade"
                                )} block w-full text-center font-bold text-xs sm:text-sm md:text-base lg:text-lg`}
                            >
                                <span className="inline-flex items-center gap-2">
                                    TRADE $EGG
                                    <ExternalLink className="w-4 h-4" />
                                </span>
                            </Link>
                        </div>
                        <div className="w-full md:w-2/3 bg-transparent flex flex-col items-center justify-start gap-6 px-4 py-6 sm:p-6">
                            {renderPanel()}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

function ProfilePanel({ onClose }: { onClose: () => void }) {
    const { disconnect } = useDisconnect();
    const handleLogout = async () => {
        try {
            disconnect();
            await signOut({ redirect: false });
        } catch (_) {
            /* noop */
        }
    };
    return (
        <div className="w-full text-white p-6 max-w-2xl">
            <h2 className="text-2xl font-bold mb-1">Account</h2>
            <p className="text-gray-300 mb-5">
                Your account information and balances
            </p>
            <WalletArea />
            <div className="mt-6 flex items-center justify-end gap-3">
                <button
                    onClick={onClose}
                    className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-gray-700 hover:bg-gray-600 text-white text-sm font-semibold"
                >
                    Close
                </button>
                <button
                    onClick={handleLogout}
                    className="inline-flex items-center gap-1 px-4 py-2 rounded-md bg-red-600 hover:bg-red-500 text-white text-sm font-semibold"
                >
                    <LogOut className="w-4 h-4" />
                    Logout
                </button>
            </div>
        </div>
    );
}

