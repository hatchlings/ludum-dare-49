import { Scene } from "phaser";

export class LoaderScene extends Scene {

  constructor() {
    super({key: "LoaderScene"});
  }

  preload() {
    /* Load all assets before jumping to game scene. */
    this.load.image("darkblue", "/assets/darkblue.png");
    this.load.image("background", "/assets/grass.png");
  }

  create() {
    this.scene.start("GameScene");
  }

}
