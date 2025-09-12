import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class Game extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    map: Phaser.Tilemaps.Tilemap;
    // Katmanlar
    groundLayer: Phaser.Tilemaps.TilemapLayer;
    decorationsLayer: Phaser.Tilemaps.TilemapLayer;
    buildingsLayer: Phaser.Tilemaps.TilemapLayer;
    fencesLayer: Phaser.Tilemaps.TilemapLayer;
    
    // Yeni nesneler
    player: Phaser.GameObjects.Rectangle;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys;
wasd: { up: Phaser.Input.Keyboard.Key, down: Phaser.Input.Keyboard.Key, left: Phaser.Input.Keyboard.Key, right: Phaser.Input.Keyboard.Key };
    constructor ()
    {
        super('Game');
    }

    create ()
    {
        this.camera = this.cameras.main;

        // --- Haritayı Yükleme ---
        this.map = this.make.tilemap({ key: 'game_map' });

        // Tileset'leri haritaya ekle. İlk parametre Tiled'daki tileset adı, ikincisi preload'da verdiğin key.
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

        // Tiled'daki katmanları oluştur.
        // Katmanların oluşturulma sırası önemlidir. Z-ekseni (derinlik) sırasına göre en alttan en üste gidilir.
        this.groundLayer = this.map.createLayer('ground', allTilesets)!;
        this.decorationsLayer = this.map.createLayer('decorations', allTilesets)!;
          this.fencesLayer = this.map.createLayer('fences', allTilesets)!;
        this.buildingsLayer = this.map.createLayer('buildings', allTilesets)!;
      

        // --- Karakteri Oluşturma ---
        const startX = this.map.widthInPixels / 2;
        const startY = this.map.heightInPixels / 2;
        this.player = this.add.rectangle(startX, startY, 16, 16, 0xffff00);
        this.physics.add.existing(this.player);

        // --- Çarpışmaları Ekleme ---
        const collisionLayer = this.map.getObjectLayer('collisions');
        const collisionObjects = this.physics.add.staticGroup();

        if (collisionLayer) {
            collisionLayer.objects.forEach(object => {
                const rect = this.add.rectangle(object.x!, object.y!, object.width!, object.height!).setOrigin(0);
                collisionObjects.add(rect);
                rect.visible = false; // Çarpışma alanlarını görünmez yapar
            });
        }
        
        this.physics.add.collider(this.player, collisionObjects);
        
        // --- Kamera Takibi ve Zoom ---
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(this.player, true, 0.05, 0.05);
        this.cameras.main.setZoom(2);
        
        // Mouse ile zoom yapma özelliği ekle
        this.input.on('wheel', (pointer: Phaser.Input.Pointer, gameObjects: Phaser.GameObjects.GameObject[], deltaX: number, deltaY: number, deltaZ: number) => {
            if (deltaY > 0) { // Uzaklaşmak
                // Eğer zoom 2'den büyükse uzaklaşmaya devam et
                if (this.cameras.main.zoom > 2) {
                    this.cameras.main.zoom /= 1.1;
                }
            } else { // Yakınlaşmak
                this.cameras.main.zoom *= 1.1;
            }
        });

        // Klavye girdisini ayarla
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

        // Yön tuşları veya WASD ile hareket
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
    }
}