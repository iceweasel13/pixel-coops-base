import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class Game extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    map: Phaser.Tilemaps.Tilemap;
    // Layers
    groundLayer: Phaser.Tilemaps.TilemapLayer;
    decorationsLayer: Phaser.Tilemaps.TilemapLayer;
    buildingsLayer: Phaser.Tilemaps.TilemapLayer;
    fencesLayer: Phaser.Tilemaps.TilemapLayer;
    
    // Objects
    player: Phaser.GameObjects.Rectangle;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    wasd: { up: Phaser.Input.Keyboard.Key, down: Phaser.Input.Keyboard.Key, left: Phaser.Input.Keyboard.Key, right: Phaser.Input.Keyboard.Key };
    private triggers: { name: 'shop' | 'coop' | 'collect'; rect: Phaser.Geom.Rectangle; inside: boolean }[] = [];

    constructor ()
    {
        super('Game');
    }

    create ()
    {
        this.camera = this.cameras.main;

        // Load tilemap
        this.map = this.make.tilemap({ key: 'game_map' });

        // Add tilesets (names must match Tiled)
        const allTilesets = [
            this.map.addTilesetImage('Autotile_Grass_and_Dirt_Path_Tileset', 'Autotile_Grass_and_Dirt_Path_Tileset'),
            this.map.addTilesetImage('Exterior_Tileset', 'Exterior_Tileset'),
            this.map.addTilesetImage('House_Tileset', 'House_Tileset'),
            this.map.addTilesetImage('Barn_Tileset', 'Barn_Tileset'),
            this.map.addTilesetImage('Nature_Tileset', 'Nature_Tileset'),
            this.map.addTilesetImage('Tileset_Floor_Detail', 'Tileset_Floor_Detail'),
            this.map.addTilesetImage('UI_Tileset', 'UI_Tileset'),
            this.map.addTilesetImage('farm_buildings_all_assets', 'farm_buildings_all_assets')
        ].filter(tileset => tileset !== null) as Phaser.Tilemaps.Tileset[];

        // Create layers
        this.groundLayer = this.map.createLayer('ground', allTilesets)!;
        this.decorationsLayer = this.map.createLayer('decorations', allTilesets)!;
        this.fencesLayer = this.map.createLayer('fences', allTilesets)!;
        this.buildingsLayer = this.map.createLayer('buildings', allTilesets)!;
      
        // Create player
        const startX = this.map.widthInPixels / 2;
        const startY = this.map.heightInPixels / 2;
        this.player = this.add.rectangle(startX, startY, 16, 16, 0xffff00);
        this.physics.add.existing(this.player);

        // Collisions and triggers
        const collisionLayer = this.map.getObjectLayer('collisions');
        const collisionObjects = this.physics.add.staticGroup();

        if (collisionLayer) {
            collisionLayer.objects.forEach(object => {
                const name = (object.name || '').toLowerCase();
                const x = object.x!;
                const y = object.y!;
                const w = object.width!;
                const h = object.height!;

                if (name === 'wall') {
                    const rect = this.add.rectangle(x, y, w, h).setOrigin(0);
                    collisionObjects.add(rect);
                    rect.visible = false;
                } else if (name === 'shop' || name === 'coop' || name === 'collect') {
                    this.triggers.push({
                        name: name as 'shop' | 'coop' | 'collect',
                        rect: new Phaser.Geom.Rectangle(x, y, w, h),
                        inside: false
                    });
                }
            });
        }
        
        this.physics.add.collider(this.player, collisionObjects);
        
        // Camera follow and zoom
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(this.player, true, 0.05, 0.05);
        this.cameras.main.setZoom(2);
        
        // Mouse wheel zoom
        this.input.on('wheel', (pointer: Phaser.Input.Pointer, gameObjects: Phaser.GameObjects.GameObject[], deltaX: number, deltaY: number, deltaZ: number) => {
            if (deltaY > 0) {
                if (this.cameras.main.zoom > 2) {
                    this.cameras.main.zoom /= 1.1;
                }
            } else {
                this.cameras.main.zoom *= 1.1;
            }
        });

        // Keyboard input
        this.cursors = this.input.keyboard!.createCursorKeys();
        this.wasd = {
            up: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            down: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            left: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            right: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D)
        };

        EventBus.emit('current-scene-ready', this);
    }

    update ()
    {
        const speed = 200;
        (this.player.body as Phaser.Physics.Arcade.Body).setVelocity(0);

        // Movement with arrows or WASD
        if (this.cursors.left.isDown || this.wasd.left.isDown) {
            (this.player.body as Phaser.Physics.Arcade.Body).setVelocityX(-speed);
        } else if (this.cursors.right.isDown || this.wasd.right.isDown) {
            (this.player.body as Phaser.Physics.Arcade.Body).setVelocityX(speed);
        }

        if (this.cursors.up.isDown || this.wasd.up.isDown) {
            (this.player.body as Phaser.Physics.Arcade.Body).setVelocityY(-speed);
        } else if (this.cursors.down.isDown || this.wasd.down.isDown) {
            (this.player.body as Phaser.Physics.Arcade.Body).setVelocityY(speed);
        }

        (this.player.body as Phaser.Physics.Arcade.Body).velocity.normalize().scale(speed);

        // Trigger zone enter/exit handling
        if (this.triggers.length > 0) {
            const hasGetTopLeft = (this.player as any).getTopLeft !== undefined;
            const topLeft = hasGetTopLeft
                ? (this.player as any).getTopLeft()
                : new Phaser.Math.Vector2(this.player.x - this.player.width / 2, this.player.y - this.player.height / 2);
            const playerRect = new Phaser.Geom.Rectangle(topLeft.x, topLeft.y, this.player.width, this.player.height);

            this.triggers.forEach(t => {
                const isInside = Phaser.Geom.Intersects.RectangleToRectangle(playerRect, t.rect);
                if (isInside && !t.inside) {
                    EventBus.emit('open-dialog', t.name);
                } else if (!isInside && t.inside) {
                    EventBus.emit('close-dialog', t.name);
                }
                t.inside = isInside;
            });
        }
    }
}

