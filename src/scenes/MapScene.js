import { Scene } from "phaser";
import { MapCharacter } from '../entities/mapcharacter';
import { MapIcon } from '../entities/mapicon';
import gameManager from '../managers/gamemanager';

const TRAVEL_POS = [
  {x: 400, y: 100},
  {x: 700, y: 300},
  {x: 400, y: 500},
  {x: 100, y: 300}
]

const LOCATIONS = [
  "EARTH",
  "AIR",
  "FIRE",
  "WATER"
];

export class MapScene extends Scene {

  constructor() {
    super({key: "MapScene"});
    
    gameManager.setScene(this);

    this.travelPoints = [];
  }

  create() {
    this.background = this.add.image(400, 300, "background");
    this.addTravelPoints();
    this.addCharacter();

    this.input.keyboard.on("keyup-B", () => {
      this.scene.start("GameScene");
    });

  }

  addCharacter() {
    this.character = new MapCharacter(this, 400, 300);
  }

  addTravelPoints() {
    const home = new MapIcon(this, 400, 300, "HOME", 0);
    this.travelPoints.push(home);

    LOCATIONS.forEach((location, index) => {
      const tp = new MapIcon(this, TRAVEL_POS[index].x, TRAVEL_POS[index].y, location, index + 1);
      this.travelPoints.push(tp);
    });
  }

  returnHome() {
    this.character.cleanup();
    this.scene.start("GameScene");
  }

}
