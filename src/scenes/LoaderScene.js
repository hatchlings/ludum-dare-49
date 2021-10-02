import Phaser from "phaser";

export class LoaderScene extends Phaser.Scene {

  constructor() {
    super({key: "LoaderScene"});
  }

  preload() {
    /* Load all assets before jumping to game scene. */
    this.load.image("darkblue", "/assets/darkblue.png");
  }

  create() {
    this.scene.start("GameScene");
  }

}
