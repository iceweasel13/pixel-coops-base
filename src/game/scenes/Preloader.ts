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

        this.load.image('logo', 'logo.png');
        this.load.image('star', 'star.png');

        // Harita JSON dosyasını yükle
        this.load.tilemapTiledJSON('game_map', 'map.json');

        // Tileset görsellerini yükle.
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