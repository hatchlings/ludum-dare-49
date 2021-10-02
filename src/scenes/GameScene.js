import { Scene } from "phaser";
import { Character } from '../model/character';

export class GameScene extends Scene {

  constructor() {
    super({key: "GameScene"});
  }

  create() {
    const c = new Character();

    for(let i = 0; i < 10; i++) {
      let s = c.applyEntropy(["EARTH", "WATER", "FIRE"]);
      console.log(s);
    }

    this.input.on("pointerup", () => {
      this.scene.start("MapScene");
    });

  }

  update(time, delta) {
    
  }

}
