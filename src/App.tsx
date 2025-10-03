'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { IRefPhaserGame, PhaserGame } from './PhaserGame';
import { EventBus } from './game/EventBus';
import { ShopDialog } from './components/dialogs/ShopDialog';
import { CoopDialog } from './components/dialogs/CoopDialog';
import { CollectDialog } from './components/dialogs/CollectDialog';
import { GameUI } from './components/GameUI';
import { Toaster } from './components/ui/sonner';
import { AnnouncementDialog } from './components/dialogs/AnnouncementsDialog';
import { useGame } from '@/context/GameContext';

// This component cannot be 'async' because it uses hooks (useState, useEffect).
export default function App() {
    const phaserRef = useRef<IRefPhaserGame | null>(null);
    const { playerChickens } = useGame();
    // pendingDialogType: dialog type awaiting confirmation when entering an area
    // activeDialogType: the dialog that is actually open
    const [pendingDialogType, setPendingDialogType] = useState<string | null>(null);
    const [activeDialogType, setActiveDialogType] = useState<string | null>(null);

    useEffect(() => {
        const handleOpenDialog = (objectName: string) => {
            // Entered the area; show a confirmation prompt first
            setPendingDialogType(objectName);
        };
        const handleCloseDialog = () => {
            // Left the area; close both the pending prompt and the open dialog
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

    // Notify Phaser scene about owned chickens
    useEffect(() => {
        const indices = (playerChickens || []).map((c: any) => Number(c.chickenIndex));
        EventBus.emit('update-chickens', indices);
    }, [playerChickens]);

    // When the scene is ready, resend current data
    useEffect(() => {
        const handler = () => {
            const indices = (playerChickens || []).map((c: any) => Number(c.chickenIndex));
            EventBus.emit('update-chickens', indices);
        };
        EventBus.on('current-scene-ready', handler);
        return () => {
            EventBus.removeListener('current-scene-ready', handler);
        };
    }, [playerChickens]);

    const closeDialog = () => {
        // If the dialog is closed manually, close the active one
        setActiveDialogType(null);
    };

    // Confirm opening with Enter (or via callback)
    const confirmOpen = useCallback(() => {
        if (pendingDialogType) {
            setActiveDialogType(pendingDialogType);
            // Do not clear pending; it will clear when leaving the area.
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
                return 'Shop';
            case 'coop':
                return 'Coop';
            case 'collect':
                return 'Dealer';
            case 'announcements':
                return 'Mail Box';
            default:
                return '';
        }
    };

    return (
        <div id="app">
            <Toaster />
            <GameUI />
            <PhaserGame ref={phaserRef} />
            
            {/* Small notification asking for confirmation when entering an area */}
            {pendingDialogType && !activeDialogType && (
                <div className="pointer-events-none fixed top-[30%] left-1/2 -translate-x-1/2 z-5">
                    <div
                        role="button"
                        tabIndex={0}
                        aria-label={`You arrived at the ${labelFor(pendingDialogType)} area. Click to open or press Enter.`}
                        onClick={confirmOpen}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') confirmOpen();
                        }}
                        className="pointer-events-auto select-none rounded-md bg-black/70 px-4 py-2 text-white shadow-lg ring-1 ring-white/20 hover:bg-black/80 focus:outline-hidden focus:ring-2 focus:ring-[#a4e24d] cursor-pointer"
                    >
                        <span className="mx-1 ">Welcome</span>
                        <span className="font-medium mr-2">{labelFor(pendingDialogType)}</span>
                        
                        <span className="text-white/80">Click to open or press Enter.</span>
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

