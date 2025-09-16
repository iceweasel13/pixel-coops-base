import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SettingsPanel } from "@/components/panels/SettingsPanel";
import { useAccount, useBalance, useDisconnect } from "wagmi";
import { signOut } from "next-auth/react";
import { Copy, LogOut } from "lucide-react";

type MenuItem = "settings" | "how-to-play" | "trade";

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
  const [selectedMenu, setSelectedMenu] = useState<MenuItem>("settings");

  useEffect(() => {
    if (open) {
      setSelectedMenu("settings");
    }
  }, [open]);

  const renderPanel = () => {
    switch (selectedMenu) {
      case "settings":
        return <SettingsPanel />;
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
      <DialogContent className="bg-black/30 border-none p-0 overflow-hidden sm:max-w-4xl">

        <div className="flex flex-col md:flex-row h-full min-h-[420px]">
          <div className="md:w-1/3 bg-black/80 flex flex-col items-center justify-center p-6 gap-6 text-center">
            <button
              onClick={() => onOpenChange(false)}
              className="font-bold text-[clamp(1rem,4vw,1.75rem)] text-[#a4e24d]"
            >
              RETURN TO GAME
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
            {selectedMenu === "settings" ? null : <WalletArea />}
            {renderPanel()}
            {selectedMenu === "settings" && <WalletArea />}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
