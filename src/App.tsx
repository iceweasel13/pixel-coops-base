import { useEffect, useRef, useState } from 'react';
import { IRefPhaserGame, PhaserGame } from './PhaserGame';
import { EventBus } from './game/EventBus';
import { ShopDialog } from './components/ShopDialog';
import { CoopDialog } from './components/CoopDialog';
import { CollectDialog } from './components/CollectDialog';

function App()
{
    const phaserRef = useRef<IRefPhaserGame | null>(null);
    const [dialogType, setDialogType] = useState<string | null>(null);

    useEffect(() => {
        // Phaser'dan gelen diyalog olaylarını dinle
        const handleOpenDialog = (objectName: string) => {
            setDialogType(objectName);
        };
        const handleCloseDialog = () => {
            setDialogType(null);
        };

        EventBus.on('open-dialog', handleOpenDialog);
        EventBus.on('close-dialog', handleCloseDialog);

        return () => {
            EventBus.removeListener('open-dialog', handleOpenDialog);
            EventBus.removeListener('close-dialog', handleCloseDialog);
        };
    }, []);

    const closeDialog = () => {
        setDialogType(null);
    };

    return (
        <div id="app">
            <PhaserGame ref={phaserRef} />
            
            {dialogType === 'shop' && <ShopDialog isOpen={true} onClose={closeDialog} />}
            {dialogType === 'coop' && <CoopDialog isOpen={true} onClose={closeDialog} />}
            {dialogType === 'collect' && <CollectDialog isOpen={true} onClose={closeDialog} />}
        </div>
    );
}

export default App
