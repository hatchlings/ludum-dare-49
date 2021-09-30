import LoaderScene from "./scenes/LoaderScene";
import HUDScene from "./scenes/HUDScene";
import GameScene from "./scenes/GameScene";

export const gameConfig = {
  type: Phaser.AUTO,
  parent: "GameCanvas",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 800 },
      debug: true
    }
  },
  fps: {
    target: 60,
    min: 30,
    forceSetTimeOut: true
  },
  scale: {
    mode: Phaser.Scale.NONE,
    width: "100%",
    height: "100%",
    autoCenter: Phaser.Scale.CENTER_BOTH,
    fullScreenTarget: document.body
  },
  roundPixels: true,
  input: {
    windowEvents: false
  },
  transparent: true,
  scene: [LoaderScene, HUDScene, GameScene],
  callbacks: {}
};
