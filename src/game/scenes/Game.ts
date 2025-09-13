import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

/**
 * Ana oyun sahnesi.
 * Oyuncunun haritada hareket ettiği, etkileşimde bulunduğu ve oyunun temel mantığının işlediği yerdir.
 */
export class Game extends Scene {
    // Sahne Özellikleri
    camera: Phaser.Cameras.Scene2D.Camera;
    map: Phaser.Tilemaps.Tilemap;
    player: Phaser.Physics.Arcade.Sprite;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    wasd: { up: Phaser.Input.Keyboard.Key, down: Phaser.Input.Keyboard.Key, left: Phaser.Input.Keyboard.Key, right: Phaser.Input.Keyboard.Key };

    // Harita Katmanları
    groundLayer: Phaser.Tilemaps.TilemapLayer;
    decorationsLayer: Phaser.Tilemaps.TilemapLayer;
    buildingsLayer: Phaser.Tilemaps.TilemapLayer;
    fencesLayer: Phaser.Tilemaps.TilemapLayer;

    // Özel Etkileşim Alanları
    private triggers: { name: 'shop' | 'coop' | 'collect'; rect: Phaser.Geom.Rectangle; inside: boolean }[] = [];
    private lastDirection: 'up' | 'down' | 'left' | 'right' = 'down';

    constructor() {
        super('Game');
    }

    create() {
        // --- Harita ve Katmanların Kurulumu ---
        this.map = this.make.tilemap({ key: 'game_map' });
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

        this.groundLayer = this.map.createLayer('ground', allTilesets)!;
        this.decorationsLayer = this.map.createLayer('decorations', allTilesets)!;
        this.fencesLayer = this.map.createLayer('fences', allTilesets)!;
        this.buildingsLayer = this.map.createLayer('buildings', allTilesets)!;

        // --- Oyuncu Kurulumu ---
        const startX = this.map.widthInPixels / 2;
        const startY = this.map.heightInPixels / 2;
        this.player = this.physics.add.sprite(startX, startY, 'player_sheet', 4);

        if (this.player.body) {
            // Spritesheet 64x64 yüklense bile, fiziksel çarpışma kutusunu (hitbox)
            // karakterin gerçek boyutlarına (16x16) indirgiyoruz.
            this.player.body.setSize(16, 16);
            
            // Küçültülmüş hitbox'ı, 64x64'lük karenin merkezine yerleştiriyoruz.
            // Ofset = (Sprite Boyutu - Hitbox Boyutu) / 2  =>  (64 - 16) / 2 = 24
            this.player.body.setOffset(24, 24);
        }

        // --- Animasyonların Tanımlanması ---
        this.createPlayerAnimations();

        // --- Fizik ve Etkileşim Alanları ---
        this.setupCollisionsAndTriggers();
        
        // --- Kamera Kurulumu ---
        this.setupCamera();

        // --- Kontrol Mekanizması ---
        this.setupInput();

        // Sahnenin hazır olduğunu React UI'a bildiriyoruz.
        EventBus.emit('current-scene-ready', this);
    }

    update() {
        // Player body'si henüz oluşmadıysa update fonksiyonunu çalıştırma.
        if (!this.player || !this.player.body) return;

        this.handlePlayerMovement();
        this.checkInteractionTriggers();
    }

    /**
     * Oyuncu animasyonlarını oluşturur ve `anims` yöneticisine kaydeder.
     */
    private createPlayerAnimations() {
        this.anims.create({ key: 'walk-right', frames: this.anims.generateFrameNumbers('player_sheet', { frames: [0, 1] }), frameRate: 8, repeat: -1 });
        this.anims.create({ key: 'walk-left', frames: this.anims.generateFrameNumbers('player_sheet', { frames: [2, 3] }), frameRate: 8, repeat: -1 });
        this.anims.create({ key: 'walk-down', frames: this.anims.generateFrameNumbers('player_sheet', { frames: [4, 5] }), frameRate: 8, repeat: -1 });
        this.anims.create({ key: 'walk-up', frames: this.anims.generateFrameNumbers('player_sheet', { frames: [6, 7] }), frameRate: 8, repeat: -1 });
    }

    /**
     * Haritadaki 'collisions' katmanından duvarları ve etkileşim alanlarını (triggers) ayarlar.
     */
    private setupCollisionsAndTriggers() {
        const collisionLayer = this.map.getObjectLayer('collisions');
        const collisionObjects = this.physics.add.staticGroup();

        if (collisionLayer) {
            collisionLayer.objects.forEach(object => {
                const { name = '', x = 0, y = 0, width = 0, height = 0 } = object;
                const objectName = name.toLowerCase();

                if (objectName === 'wall') {
                    const wall = this.add.rectangle(x, y, width, height).setOrigin(0);
                    collisionObjects.add(wall);
                } else if (['shop', 'coop', 'collect'].includes(objectName)) {
                    this.triggers.push({ 
                        name: objectName as any, 
                        rect: new Phaser.Geom.Rectangle(x, y, width, height), 
                        inside: false 
                    });
                }
            });
        }
        this.physics.add.collider(this.player, collisionObjects);
    }

    /**
     * Kamera ayarlarını yapılandırır: Sınırlar, oyuncu takibi ve başlangıç zoom seviyesi.
     */
    private setupCamera() {
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(this.player, true, 0.05, 0.05);
        this.cameras.main.setZoom(3);
    }

    /**
     * Klavye (WASD ve Yön Tuşları) girdilerini dinlemek için ayarları yapar.
     */
    private setupInput() {
        this.cursors = this.input.keyboard!.createCursorKeys();
        this.wasd = {
            up: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            down: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            left: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            right: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D)
        };
    }

    /**
     * Her frame'de oyuncu hareketini ve animasyonlarını kontrol eder.
     */
    private handlePlayerMovement() {
        const speed = 60;
        const body = this.player.body as Phaser.Physics.Arcade.Body;
        body.setVelocity(0);

        if (this.cursors.left.isDown || this.wasd.left.isDown) {
            body.setVelocityX(-speed); this.player.anims.play('walk-left', true); this.lastDirection = 'left';
        } else if (this.cursors.right.isDown || this.wasd.right.isDown) {
            body.setVelocityX(speed); this.player.anims.play('walk-right', true); this.lastDirection = 'right';
        }

        if (this.cursors.up.isDown || this.wasd.up.isDown) {
            body.setVelocityY(-speed); this.player.anims.play('walk-up', true); this.lastDirection = 'up';
        } else if (this.cursors.down.isDown || this.wasd.down.isDown) {
            body.setVelocityY(speed); this.player.anims.play('walk-down', true); this.lastDirection = 'down';
        }

        if (body.velocity.x === 0 && body.velocity.y === 0) {
            this.player.anims.stop();
            // Durma anında, son gidilen yöne ait sabit kareyi göster.
            const frameMap = { 'right': 0, 'left': 2, 'down': 4, 'up': 6 };
            this.player.setFrame(frameMap[this.lastDirection]);
        } else {
            // Çapraz harekette hızın artmasını engellemek için hızı normalleştir.
            body.velocity.normalize().scale(speed);
        }
    }

    /**
     * Oyuncunun etkileşim alanlarına girip çıkmadığını kontrol eder ve EventBus üzerinden bildirim gönderir.
     */
    private checkInteractionTriggers() {
        if (this.triggers.length > 0) {
            const body = this.player.body as Phaser.Physics.Arcade.Body;
            const playerRect = new Phaser.Geom.Rectangle(this.player.x - body.width / 2, this.player.y - body.height / 2, body.width, body.height);

            this.triggers.forEach(trigger => {
                const isInside = Phaser.Geom.Intersects.RectangleToRectangle(playerRect, trigger.rect);
                if (isInside && !trigger.inside) {
                    EventBus.emit('open-dialog', trigger.name);
                } else if (!isInside && trigger.inside) {
                    EventBus.emit('close-dialog', trigger.name);
                }
                trigger.inside = isInside;
            });
        }
    }
}