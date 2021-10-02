import { Scene } from "phaser";
import { MapIcon } from '../entities/mapicon';

const TRAVEL_POS = [
  {x: 100, y: 100},
  {x: 700, y: 100},
  {x: 100, y: 500},
  {x: 700, y: 500}
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
    
    this.travelPoints = [];
  }

  create() {
    this.background = this.add.image(400, 300, "background");
    this.addTravelPoints();
  }

  addTravelPoints() {
    LOCATIONS.forEach((location, index) => {
      const tp = new MapIcon(this, TRAVEL_POS[index].x, TRAVEL_POS[index].y, location);
    });
  }

}
