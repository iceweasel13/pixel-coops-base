// Konum: src/game/scenes/Preloader.ts

import { Scene } from 'phaser';

export class Preloader extends Scene
{
    constructor ()
    {
        super('Preloader');
    }

    init ()
    {
        // Loading UI handled by Boot via a full-screen HTML overlay.
        // Keep Preloader lightweight.
    }

    preload ()
    {
        this.load.setPath('assets');
        // Update DOM loading bar created in Boot
        this.load.on('progress', (progress: number) => {
            try {
                const fill = document.getElementById('loading-bar-fill') as HTMLDivElement | null;
                if (fill) {
                    const pct = Math.max(0, Math.min(100, Math.floor(progress * 100)));
                    fill.style.width = pct + '%';
                }
            } catch {}
        });
        
        // Önceki karakteri kaldırıp yenisini ekliyoruz
        // ÖNEMLİ: Eski player_sheet satırını sildiğinden emin ol.
        this.load.spritesheet('player_sheet', 'character.png', {
            frameWidth: 64,
            frameHeight: 64 
        });

        // Harita ve diğer görseller
        this.load.tilemapTiledJSON('game_map', 'map.json');
        this.load.image('Autotile_Grass_and_Dirt_Path_Tileset', 'Autotile_Grass_and_Dirt_Path_Tileset.png');
        this.load.image('Barn_Tileset', 'Barn_Tileset.png');
        this.load.image('Exterior_Tileset', 'Exterior_Tileset.png');
        this.load.image('farm_buildings_all_assets', 'farm_buildings_all_assets.png');
        this.load.image('House_Tileset', 'House_Tileset.png');
        this.load.image('Nature_Tileset', 'Nature_Tileset.png');
        this.load.image('Tileset_Floor_Detail', 'Tileset_Floor_Detail.png');
        this.load.image('UI_Tileset', 'UI_Tileset.png');

        // Tavuk görselleri (1..10)
        for (let i = 1; i <= 10; i++) {
            this.load.image(`chicken_${i}` as const, `sittingChicken/chicken${i}.png`);
        }
    }

    create ()
    {
        // Remove loading overlay once assets are ready
        try {
            const overlay = document.getElementById('loading-overlay');
            if (overlay && overlay.parentElement) {
                overlay.parentElement.removeChild(overlay);
            }
        } catch {}
        this.scene.start('Game');
    }
}
