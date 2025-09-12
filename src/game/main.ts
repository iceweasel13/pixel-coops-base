import { Boot } from './scenes/Boot';
import { GameOver } from './scenes/GameOver';
import { Game as MainGame } from './scenes/Game';
import { MainMenu } from './scenes/MainMenu';
import { AUTO, Game, Scale } from 'phaser';
import { Preloader } from './scenes/Preloader';


const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    // Ekranı boşluksuz doldurmak için Scale.RESIZE modunu kullanıyoruz
    scale: {
        mode: Scale.RESIZE,
        autoCenter: Scale.CENTER_BOTH
    },
    width: 1024,
    height: 768,
    parent: 'game-container',
    backgroundColor: '#028af8',
    scene: [
        Boot,
        Preloader,
        MainMenu,
        MainGame,
        GameOver
    ],
    // Fiziği etkinleştiriyoruz
    physics: {
        default: 'arcade',
        arcade: {
            debug: true // Geliştirme için çarpışma alanlarını görünür yapar
        }
    }
};

const StartGame = (parent: string) => {

    return new Game({ ...config, parent });

}

export default StartGame;