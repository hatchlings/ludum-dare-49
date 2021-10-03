import { Scene } from "phaser";
/* Force the singleton to instantiate, weird parcel behavior */
import gameManager from '../managers/gamemanager';
/* Force the singleton to instantiate, weird parcel behavior */
import character, { STAT_TYPES } from '../model/character';
/* Force the singleton to instantiate, weird parcel behavior */
import gameState from '../model/gamestate';


export class LoaderScene extends Scene {

  constructor() {
    super({key: "LoaderScene"});
  }

  preload() {
    /* Load all assets before jumping to game scene. */

    /* MOCK */

    this.load.image("darkblue", "/assets/darkblue.png");
    this.load.image("background", "/assets/grass.png");
    this.load.image("pet", "/assets/pet.png");

    /* REAL */

    console.log(STAT_TYPES);
    
    STAT_TYPES.forEach((type) => {
      for(let i = 1; i <= 5; i++) {
        this.load.image(`${type}-${i}`, `/assets/final/${type}/${type}-${i}.png`);
      }
    });

    /* Weird singleton behavior */
    void character;
    void gameManager;
    void gameState;
  }

  create() {
    this.scene.start("MainScene");
  }

}
