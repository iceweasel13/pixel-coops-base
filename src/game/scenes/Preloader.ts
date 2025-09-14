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
        this.add.image(512, 384, 'background');
        this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);
        const bar = this.add.rectangle(512-230, 384, 4, 28, 0xffffff);
        this.load.on('progress', (progress: number) => {
            bar.width = 4 + (460 * progress);
        });
    }

    preload ()
    {
        this.load.setPath('assets');
        
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
    }

    create ()
    {
        this.scene.start('Game');
    }
}