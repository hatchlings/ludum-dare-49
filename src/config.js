import { LoaderScene } from "./scenes/LoaderScene";
import { HUDScene } from "./scenes/HUDScene";
import { GameScene } from "./scenes/GameScene";

export const gameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: "GameContainer",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 800 },
      debug: !true
    }
  },
  scene: [
    LoaderScene,
    HUDScene,
    GameScene
  ]
};
