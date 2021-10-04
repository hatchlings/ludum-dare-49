import { Scene } from "phaser";

const FLAVOR_TEXT_CONFIG = {
    fontFamily: "Amatic SC",
    fontSize: 36,
    stroke: "#000",
    strokeThickness: 6
}

export class VictoryScene extends Scene {

  constructor() {
    super({key: "VictoryScene"});
  }


  create() {
    this.overlay = this.add.sprite(1024 / 2, 768 / 2, "overlay");
    this.overlay.setScale(2.0);

    this.winSwirl = this.add.sprite(1024 / 2, 768 / 2, "winswirl");
    this.winCharacter = this.add.sprite(800, 768 / 2, "wincharacter");

    this.add.text(1024 / 2 - 40, 295, "You did it!", FLAVOR_TEXT_CONFIG);
    this.add.text(1024 / 2 - 80, 345, "The elements have", FLAVOR_TEXT_CONFIG);
    this.add.text(1024 / 2 - 80, 385, "aligned and a new", FLAVOR_TEXT_CONFIG);
    this.add.text(1024 / 2 - 75, 425, "universe is born!", FLAVOR_TEXT_CONFIG);

  }

}
