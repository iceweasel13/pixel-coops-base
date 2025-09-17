import { useEffect, useState } from "react";
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
import { Copy, LogOut } from "lucide-react";
import Image from "next/image";
type MenuItem = "settings" | "how-to-play" | "trade" | "profile" | "referrals";

export type MenuDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function WalletArea() {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: balance, isLoading } = useBalance({ address });
  const [copied, setCopied] = useState(false);

  const shortenAddress = (addr: string | undefined) => {
    if (!addr) return "";
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
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

  const handleDisconnect = async () => {
    try {
      disconnect();
      await signOut({ redirect: false });
    } catch (_) {
      // noop
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto text-white">
      <div className="bg-black/50 p-4 rounded-lg mb-3 min-h-[72px]">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="mb-1">
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
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1 bg-gray-700 hover:bg-gray-600 text-white text-xs font-semibold px-3 py-2 rounded-md disabled:opacity-60"
              disabled={!address}
              title={address ? "Copy address" : "No address"}
            >
              <Copy className="w-4 h-4" />
              {copied ? "COPIED" : "COPY"}
            </button>
            <button
              onClick={handleDisconnect}
              className="inline-flex items-center gap-1 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold px-3 py-2 rounded-md"
              title="Disconnect"
            >
              <LogOut className="w-4 h-4" />
              LOG OUT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function MenuDialog({ open, onOpenChange }: MenuDialogProps) {
  const [selectedMenu, setSelectedMenu] = useState<MenuItem>("profile");
  const { address } = useAccount();
  const [copiedRef, setCopiedRef] = useState(false);

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
        return (
          <div className="w-full text-white p-6">
            <h2 className="text-2xl font-bold mb-4">Profile</h2>
            <p className="text-gray-300 mb-4">View your wallet details, copy your address, and sign out.</p>
            <WalletArea />
          </div>
        );
      case "referrals": {
        const origin = typeof window !== "undefined" ? window.location.origin : "";
        const referralUrl = address ? `${origin}/?ref=${address}` : "";
        const sampleRefs = [
          "0x12a3...9fB2",
          "0x5Cde...11A0",
          "0x98F1...3b44",
          "0xA0B3...77c9",
          "0x3E2d...0F01",
        ];
        const totalEarnings = "12.50 EGG"; // örnek toplam kazanç
        const copyReferral = async () => {
          if (!referralUrl) return;
          try {
            await navigator.clipboard.writeText(referralUrl);
            setCopiedRef(true);
            setTimeout(() => setCopiedRef(false), 1200);
          } catch (_) {
            // noop
          }
        };

        return (
          <div className="w-full text-white p-6">
            <h2 className="text-2xl font-bold mb-3">Referrals</h2>
            <p className="text-gray-300 mb-4">Earn extra rewards based on your number of referrals. More referrals mean more rewards.</p>

            <div className="bg-black/50 rounded-lg p-4 mb-4">
              <h3 className="font-semibold mb-2">Referral Addresses</h3>
              <ul className="list-disc list-inside text-gray-200">
                {sampleRefs.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </div>

            <div className="bg-black/50 rounded-lg p-4 mb-4">
              <h3 className="font-semibold mb-2">Total Referral Earnings</h3>
              <p className="text-[#a4e24d] text-lg font-bold">{totalEarnings}</p>
            </div>

            <div className="bg-black/50 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Your Referral Link</h3>
              {address ? (
                <div className="flex items-center gap-2">
                  <input
                    readOnly
                    value={referralUrl}
                    className="flex-1 bg-black/40 text-gray-200 px-3 py-2 rounded border border-gray-700 focus:outline-none"
                  />
                  <button
                    onClick={copyReferral}
                    className="inline-flex items-center gap-1 bg-gray-700 hover:bg-gray-600 text-white text-xs font-semibold px-3 py-2 rounded-md"
                  >
                    <Copy className="w-4 h-4" /> {copiedRef ? "Copied" : "Copy"}
                  </button>
                </div>
              ) : (
                <p className="text-gray-300">Please connect your wallet to generate your referral link.</p>
              )}
            </div>
          </div>
        );
      }
      case "how-to-play":
        return (
          <div className="text-center text-white p-8">
            <h2 className="text-3xl font-bold">How to Play (Coming Soon)</h2>
          </div>
        );
      case "trade":
        return (
          <div className="text-center text-white p-8">
            <h2 className="text-3xl font-bold">Trade $EGG Page (Coming Soon)</h2>
          </div>
        );
      default:
        return null;
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="bg-black/30 border-none p-0 overflow-hidden sm:max-w-4xl">
        <DialogClose aria-label="Close" className="absolute right-3 top-3 size-10">
          <Image src="/icons/close.png" alt="Close" className="h-10 w-10" width={40} height={40} />
        </DialogClose>

        <div className="flex flex-col md:flex-row h-full min-h-[420px]">
          <div className="md:w-1/3 bg-black/80 flex flex-col items-center justify-center p-6 gap-6 text-center">
            <button
              onClick={() => onOpenChange(false)}
              className="inline-flex items-center justify-center px-5 py-3 rounded-lg bg-[#a4e24d] text-black font-bold text-[clamp(1rem,4vw,1.75rem)] hover:bg-[#93cf3f] transition-colors shadow"
            >
              RETURN TO GAME
            </button>
            <button
              onClick={() => setSelectedMenu("profile")}
              className={`${getMenuClass("profile")} font-bold text-[clamp(1rem,4vw,1.5rem)]`}
            >
              PROFILE
            </button>
            <button
              onClick={() => setSelectedMenu("referrals")}
              className={`${getMenuClass("referrals")} font-bold text-[clamp(1rem,4vw,1.5rem)]`}
            >
              REFERRALS
            </button>
            <button
              onClick={() => setSelectedMenu("settings")}
              className={`${getMenuClass("settings")} font-bold text-[clamp(1rem,4vw,1.5rem)]`}
            >
              SETTINGS
            </button>
            <a
              href="/how-to-play"
              target="_blank"
              rel="noopener noreferrer"
              className={`${getMenuClass("how-to-play")} font-bold text-[clamp(1rem,4vw,1.5rem)]`}
              onClick={() => setSelectedMenu("how-to-play")}
            >
              HOW TO PLAY
            </a>
            <a
              href="/trade"
              target="_blank"
              rel="noopener noreferrer"
              className={`${getMenuClass("trade")} font-bold text-[clamp(1rem,4vw,1.5rem)]`}
              onClick={() => setSelectedMenu("trade")}
            >
              TRADE $EGG
            </a>
          </div>

          <div className="md:w-2/3 bg-black/70 flex flex-col items-center justify-start p-6 gap-6">
            {renderPanel()}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

