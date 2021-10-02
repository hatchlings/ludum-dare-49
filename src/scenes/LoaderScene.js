import { Scene } from "phaser";
/* Force the singleton to instantiate, weird parcel behavior */
import character from '../model/character';


export class LoaderScene extends Scene {

  constructor() {
    super({key: "LoaderScene"});
  }

  preload() {
    /* Load all assets before jumping to game scene. */
    this.load.image("darkblue", "/assets/darkblue.png");
    this.load.image("background", "/assets/grass.png");

    /* Weird singleton behavior */
    void character;
  }

  create() {
    this.scene.start("GameScene");
  }

}
