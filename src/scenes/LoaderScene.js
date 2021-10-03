import { Scene } from "phaser";
/* Force the singleton to instantiate, weird parcel behavior */
import audioManager from '../managers/audiomanager';
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
    this.load.image("grass", "/assets/grass.png");
    this.load.image("pet", "/assets/pet.png");

    /* REAL */

    this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');


    this.load.image("background", "/assets/final/background.png");
    this.load.image("character", "/assets/final/character.png");
    this.load.image("cat", "/assets/final/chaoscat.png");
    this.load.image("orb", "/assets/final/orb.png");
    this.load.image("shard", "/assets/final/shard.png");
    
    STAT_TYPES.forEach((type) => {
      for(let i = 1; i <= 5; i++) {
        this.load.image(`${type}-${i}`, `/assets/final/${type}/${type}-${i}.png`);
      }
    });

    /* Weird singleton behavior */
    void character;
    void gameManager;
    void gameState;
    void audioManager;
  }

  create() {
    WebFont.load({
      google: {
        families: ["Amatic SC"]
      },
      active: () => {
        this.scene.start("MainScene");
      }
    });
  }

}
