import { Scene } from "phaser";

export class GameScene extends Scene {

  constructor() {
    super({key: "GameScene"});
  }

  create() {

    this.input.on("pointerup", () => {
      this.scene.start("MapScene");
    });

  }

  update(time, delta) {
    
  }

}
