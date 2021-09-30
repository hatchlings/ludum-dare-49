import { Scene } from "phaser";

export class HUDScene extends Scene {

  constructor() {
    super({key: "HUDScene"});
  }

  create() {
    console.log("It's HUD  time!")
  }

  update(time, delta) {
    
  }

}
