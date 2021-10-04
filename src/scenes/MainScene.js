import { Scene } from "phaser";
import { Shop } from '../entities/shop';

export class MainScene extends Scene {

  constructor() {
    super({key: "MainScene"});
  }

  create() {

    this.overlay = this.add.sprite(1024 / 2, 768 / 2, "overlay");
    this.overlay.setScale(2.0);
    
    //this.fortune = new Fortune(this, 480, 20);
    //this.entropy = new Entropy(this);
    this.shop = new Shop(this);
    //this.toMap = new MapExplore(this);

  }

  goToMap() {
    this.cleanup();

    this.scene.stop("MapScene");
    this.scene.start("MapScene");
    
    this.scene.stop();
  }

  cleanup() {
    //this.fortune.cleanup();
    this.shop.cleanup();
    //this.entropy.cleanup();
  }

}
