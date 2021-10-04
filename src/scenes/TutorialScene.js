import { Scene } from "phaser";
import { Carousel } from '../entities/carousel';

export class TutorialScene extends Scene {

  constructor() {
    super({key: "TutorialScene"});
  }

  create() {
      this.carousel = new Carousel(this, 1024/2, 768/2);
  }

}
