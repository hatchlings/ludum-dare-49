import { Scene } from "phaser";
import { Egg } from "../entities/egg";

export class GameScene extends Scene {

  constructor() {
    super({key: "GameScene"});
  }

  create() {
    new Egg(this, 400, 300);
  }

  update(time, delta) {

  }

}
