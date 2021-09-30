import { Scene } from "phaser";
import eventBus from "../util/eventbus";

export class HUDScene extends Scene {

  constructor() {
    super({key: "HUDScene"});
  }

  create() {
    console.log("It's HUD  time!")

    eventBus.on("game:egg", () => {
      console.log("Egg did a thing!");
    });

  }

  update(time, delta) {

  }

}
