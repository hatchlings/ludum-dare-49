import { GameScene } from "./scenes/GameScene";
import { LoaderScene } from "./scenes/LoaderScene";
import { MapScene } from "./scenes/MapScene";

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
    MapScene,
    GameScene
  ]
};
