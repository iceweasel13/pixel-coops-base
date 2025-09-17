// Konum: src/App.tsx

'use client'; // Bu bir istemci bileşenidir.

import { useEffect, useRef, useState, useCallback } from 'react';
import { IRefPhaserGame, PhaserGame } from './PhaserGame';
import { EventBus } from './game/EventBus';
import { ShopDialog } from './components/dialogs/ShopDialog';
import { CoopDialog } from './components/dialogs/CoopDialog';
import { CollectDialog } from './components/dialogs/CollectDialog';
import { GameUI } from './components/GameUI';
import { Toaster } from 'sonner';
import { AnnouncementDialog } from './components/dialogs/AnnouncementsDialog';

// Bu bileşen 'async' olamaz çünkü hook'lar (useState, useEffect) kullanıyor.
export default function App() {
    const phaserRef = useRef<IRefPhaserGame | null>(null);
    // pendingDialogType: alana girildiğinde onay bekleyen diyalog tipi
    // activeDialogType: gerçekten açılmış olan diyalog
    const [pendingDialogType, setPendingDialogType] = useState<string | null>(null);
    const [activeDialogType, setActiveDialogType] = useState<string | null>(null);

    useEffect(() => {
        const handleOpenDialog = (objectName: string) => {
            // Alana girildi; önce onay istemi göster
            setPendingDialogType(objectName);
        };
        const handleCloseDialog = () => {
            // Alandan çıkıldı; hem bekleyen istemi hem de açık diyalogu kapat
            setPendingDialogType(null);
            setActiveDialogType(null);
        };

        EventBus.on('open-dialog', handleOpenDialog);
        EventBus.on('close-dialog', handleCloseDialog);

        return () => {
            EventBus.removeListener('open-dialog', handleOpenDialog);
            EventBus.removeListener('close-dialog', handleCloseDialog);
        };
    }, []);

    const closeDialog = () => {
        // Diyalog manuel kapatılırsa aktif olanı kapat, alandaysan onay istemi tekrar görünsün
        setActiveDialogType(null);
    };

    // Onay istemine Enter ile onay verme (veya callback ile)
    const confirmOpen = useCallback(() => {
        if (pendingDialogType) {
            setActiveDialogType(pendingDialogType);
            // pending'i temizlemiyoruz; alandan çıkınca temizlenecek.
        }
    }, [pendingDialogType]);

    useEffect(() => {
        if (!pendingDialogType || activeDialogType) return;
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                confirmOpen();
            }
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [pendingDialogType, activeDialogType, confirmOpen]);

    const labelFor = (type: string | null) => {
        switch (type) {
            case 'shop':
                return 'Mağaza';
            case 'coop':
                return 'Kümes';
            case 'collect':
                return 'Toplama';
            case 'announcements':
                return 'Duyurular';
            default:
                return '';
        }
    };

    return (
        <div id="app">
            <Toaster />
            <GameUI />
            <PhaserGame ref={phaserRef} />
            
            {/* Alana girince onay isteyen küçük bildirim */}
            {pendingDialogType && !activeDialogType && (
                <div className="pointer-events-none fixed top-[30%] left-1/2 -translate-x-1/2 z-30">
                    <div
                        role="button"
                        tabIndex={0}
                        aria-label={`${labelFor(pendingDialogType)} alanına geldiniz. Açmak için tıklayın veya Enter tuşuna basın.`}
                        onClick={confirmOpen}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') confirmOpen();
                        }}
                        className="pointer-events-auto select-none rounded-md bg-black/70 px-4 py-2 text-white shadow-lg ring-1 ring-white/20 hover:bg-black/80 focus:outline-hidden focus:ring-2 focus:ring-[#a4e24d] cursor-pointer"
                    >
                        <span className="font-medium">{labelFor(pendingDialogType)}</span>
                        <span className="mx-2">alanına geldiniz.</span>
                        <span className="text-white/80">Açmak için tıklayın veya Enter tuşuna basın.</span>
                    </div>
                </div>
            )}

            {activeDialogType === 'shop' && <ShopDialog isOpen={true} onClose={closeDialog} />}
            {activeDialogType === 'coop' && <CoopDialog isOpen={true} onClose={closeDialog} />}
            {activeDialogType === 'collect' && <CollectDialog isOpen={true} onClose={closeDialog} />}

            {activeDialogType === 'announcements' && <AnnouncementDialog isOpen={true} onClose={closeDialog} />} 
        </div>
    );
}
