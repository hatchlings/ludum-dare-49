import { Scene } from "phaser";
import { Entropy } from '../entities/entropy';
import { Fortune } from '../entities/fortune';
import { MapExplore } from '../entities/mapexplore';
import { Shop } from '../entities/shop';

export class MainScene extends Scene {

  constructor() {
    super({key: "MainScene"});
  }

  create() {

    this.fortune = new Fortune(this, 360, 20);
    this.entropy = new Entropy(this);
    this.shop = new Shop(this);
    this.toMap = new MapExplore(this);

  }

  goToMap() {
    this.cleanup();
    this.scene.start("MapScene");
  }

  cleanup() {
    this.fortune.cleanup();
    this.shop.cleanup();
    this.entropy.cleanup();
  }

}
