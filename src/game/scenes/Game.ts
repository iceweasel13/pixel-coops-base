import { EventBus } from '../EventBus';
import { Scene, Math as PhaserMath } from 'phaser';

/**
 * Ana oyun sahnesi.
 * Oyuncunun haritada hareket ettiği, etkileşimde bulunduğu ve oyunun temel mantığının işlediği yerdir.
 * Klavye ve mobil dokunmatik kontrolleri destekler.
 */
export class Game extends Scene {
    // Sahne Özellikleri
    camera: Phaser.Cameras.Scene2D.Camera;
    map: Phaser.Tilemaps.Tilemap;
    player: Phaser.Physics.Arcade.Sprite;

    // Harita Katmanları
    groundLayer: Phaser.Tilemaps.TilemapLayer;
    decorationsLayer: Phaser.Tilemaps.TilemapLayer;
    buildingsLayer: Phaser.Tilemaps.TilemapLayer;
    fencesLayer: Phaser.Tilemaps.TilemapLayer;

    // Kontrol Mekanizmaları
    cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    wasd: { up: Phaser.Input.Keyboard.Key, down: Phaser.Input.Keyboard.Key, left: Phaser.Input.Keyboard.Key, right: Phaser.Input.Keyboard.Key };
    private isTouching: boolean = false;
    private touchPosition: PhaserMath.Vector2 = new PhaserMath.Vector2();

    // Durum (State) Yönetimi
    private triggers: { name: 'shop' | 'coop' | 'collect' | 'announcements'; rect: Phaser.Geom.Rectangle; inside: boolean }[] = [];
    private lastDirection: 'up' | 'down' | 'left' | 'right' = 'down';

    constructor() {
        super('Game');
    }

    create() {
        this.setupMapAndLayers();
        this.setupPlayer();
        this.createPlayerAnimations();
        this.setupCollisionsAndTriggers();
        this.setupCamera();
        this.setupInputControls(); // Klavye ve dokunmatik kontrolleri birleştirdik

        EventBus.emit('current-scene-ready', this);
    }

    update() {
        if (!this.player || !this.player.body) return;

        this.handleMovement();
        this.checkInteractionTriggers();
    }

    /**
     * Tiled editöründe oluşturulan haritayı ve katmanlarını sahneye yükler.
     */
    private setupMapAndLayers() {
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
    }

    /**
     * Oyuncuyu oluşturur, fiziksel özelliklerini ve başlangıç pozisyonunu ayarlar.
     */
    private setupPlayer() {
        const startX = this.map.widthInPixels / 2;
        const startY = this.map.heightInPixels / 2;
        this.player = this.physics.add.sprite(startX, startY, 'player_sheet', 4);

        if (this.player.body) {
            this.player.body.setSize(16, 16).setOffset(24, 24);
        }
    }

    /**
     * Oyuncu animasyonlarını oluşturur.
     */
    private createPlayerAnimations() {
        this.anims.create({ key: 'walk-right', frames: this.anims.generateFrameNumbers('player_sheet', { frames: [0, 1] }), frameRate: 8, repeat: -1 });
        this.anims.create({ key: 'walk-left', frames: this.anims.generateFrameNumbers('player_sheet', { frames: [2, 3] }), frameRate: 8, repeat: -1 });
        this.anims.create({ key: 'walk-down', frames: this.anims.generateFrameNumbers('player_sheet', { frames: [4, 5] }), frameRate: 8, repeat: -1 });
        this.anims.create({ key: 'walk-up', frames: this.anims.generateFrameNumbers('player_sheet', { frames: [6, 7] }), frameRate: 8, repeat: -1 });
    }

    /**
     * Haritadaki duvarları ve etkileşim alanlarını (triggers) ayarlar.
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
                } else if (['shop', 'coop', 'collect', 'announcements'].includes(objectName)) {
                    this.triggers.push({ name: objectName as any, rect: new Phaser.Geom.Rectangle(x, y, width, height), inside: false });
                }
            });
        }
        this.physics.add.collider(this.player, collisionObjects);
    }

    /**
     * Kamera ayarlarını yapılandırır.
     */
    private setupCamera() {
        this.camera = this.cameras.main;
        this.camera.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.camera.startFollow(this.player, true, 0.1, 0.1);
        // Use integer zoom to avoid camera jitter on diagonal movement
        this.camera.setZoom(3);
    }

    /**
     * Klavye ve dokunmatik (mobil) kontrol mekanizmalarını ayarlar.
     */
    private setupInputControls() {
        // Klavye Kontrolleri
        this.cursors = this.input.keyboard!.createCursorKeys();
        this.wasd = {
            up: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            down: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            left: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            right: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D)
        };

        // Mobil Dokunmatik Kontroller
        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            this.isTouching = true;
            this.touchPosition.set(pointer.worldX, pointer.worldY);
        });
        this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
            if (pointer.isDown) {
                this.touchPosition.set(pointer.worldX, pointer.worldY);
            }
        });
        this.input.on('pointerup', () => {
            this.isTouching = false;
        });
    }

    /**
     * Oyuncu hareketini aktif kontrole (dokunmatik veya klavye) göre yönetir.
     */
    private handleMovement() {
        const speed = 240;
        const body = this.player.body as Phaser.Physics.Arcade.Body;

        // Dokunmatik kontrol aktifse, onu öncelikli kullan
        if (this.isTouching) {
            const direction = this.touchPosition.clone().subtract(new PhaserMath.Vector2(this.player.x, this.player.y));

            // Titremeyi önlemek için sadece belirli bir mesafeden sonra hareket et
            if (direction.length() > 16) {
                direction.normalize();
                body.setVelocity(direction.x * speed, direction.y * speed);
                this.updateAnimationFromVelocity(direction);
            } else {
                body.setVelocity(0);
            }
        }
        // Dokunmatik aktif değilse, klavyeyi dinle
        else {
            let dx = 0;
            let dy = 0;
            if (this.cursors.left.isDown || this.wasd.left.isDown) dx = -1;
            else if (this.cursors.right.isDown || this.wasd.right.isDown) dx = 1;
            if (this.cursors.up.isDown || this.wasd.up.isDown) dy = -1;
            else if (this.cursors.down.isDown || this.wasd.down.isDown) dy = 1;

            const direction = new PhaserMath.Vector2(dx, dy).normalize();
            body.setVelocity(direction.x * speed, direction.y * speed);
            if (dx !== 0 || dy !== 0) {
                this.updateAnimationFromVelocity(direction);
            }
        }

        // Hiçbir hareket yoksa, durma animasyonunu göster
        if (body.velocity.x === 0 && body.velocity.y === 0) {
            this.player.anims.stop();
            const frameMap = { 'right': 0, 'left': 2, 'down': 4, 'up': 6 };
            this.player.setFrame(frameMap[this.lastDirection]);
        }
    }

    /**
     * Verilen yön vektörüne göre doğru yürüme animasyonunu oynatır.
     * @param direction Normalleştirilmiş yön vektörü
     */
    private updateAnimationFromVelocity(direction: PhaserMath.Vector2) {
        const angle = PhaserMath.RadToDeg(direction.angle());

        if (angle > -45 && angle <= 45) { // Sağ
            this.player.anims.play('walk-right', true);
            this.lastDirection = 'right';
        } else if (angle > 45 && angle <= 135) { // Aşağı
            this.player.anims.play('walk-down', true);
            this.lastDirection = 'down';
        } else if (angle > 135 || angle <= -135) { // Sol
            this.player.anims.play('walk-left', true);
            this.lastDirection = 'left';
        } else { // Yukarı (-135 ile -45 arası)
            this.player.anims.play('walk-up', true);
            this.lastDirection = 'up';
        }
    }

    /**
     * Oyuncunun etkileşim alanlarına girip çıkmadığını kontrol eder.
     */
    private checkInteractionTriggers() {
        if (this.triggers.length > 0) {
            const body = this.player.body as Phaser.Physics.Arcade.Body;
            const playerRect = new Phaser.Geom.Rectangle(this.player.x - body.width / 2, this.player.y - body.height / 2, body.width, body.height);

            this.triggers.forEach(trigger => {
                const isInside = Phaser.Geom.Intersects.RectangleToRectangle(playerRect, trigger.rect);
                if (isInside && !trigger.inside) {
                    //this.isTouching = false;
                    //this.touchPosition.set(0, 0);
                    EventBus.emit('open-dialog', trigger.name);
                } else if (!isInside && trigger.inside) {
                    EventBus.emit('close-dialog', trigger.name);
                }
                trigger.inside = isInside;
            });
        }
    }
}

