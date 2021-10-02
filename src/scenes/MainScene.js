import { Scene } from "phaser";
import { Fortune } from '../entities/fortune';
import { MapExplore } from '../entities/mapexplore';
import { Shop } from '../entities/shop';

export class MainScene extends Scene {

  constructor() {
    super({key: "MainScene"});
  }

  create() {

    this.fortune = new Fortune(this, 360, 20);
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
  }

}
