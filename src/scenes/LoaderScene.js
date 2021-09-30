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
    /* Run HUD scene in parallel with game scene. */
    this.scene.run("HUDScene");
    this.scene.start("GameScene");
  }

}
