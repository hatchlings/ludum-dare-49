import { LoaderScene } from "./scenes/LoaderScene";
import { MainScene } from "./scenes/MainScene";
import { MapScene } from "./scenes/MapScene";

export const gameConfig = {
  type: Phaser.AUTO,
  width: 1024,
  height: 768,
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
    MainScene
  ]
};
