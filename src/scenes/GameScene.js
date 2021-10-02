import { Scene } from "phaser";
import { Character } from '../model/character';

export class GameScene extends Scene {

  constructor() {
    super({key: "GameScene"});
  }

  create() {
    const c = new Character();
    let s = c.applyEntropy(["EARTH", "EARTH", "WATER"]);
    console.log(s);
  }

  update(time, delta) {
    
  }

}
