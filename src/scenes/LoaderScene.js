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
    this.load.atlas("character-good-staff", "/assets/final/goodstaffsprite.png", "/assets/final/goodstaffsprite.json");
    this.load.atlas("character-bad-staff", "/assets/final/badstaffsprite.png", "/assets/final/badstaffsprite.json");

    this.load.image("cat", "/assets/final/chaoscat.png");
    this.load.atlas("cat-squish", "/assets/final/chaoscatsquish.png", "/assets/final/chaoscatsquish.json");

    this.load.image("orb", "/assets/final/orb.png");
    this.load.image("shard", "/assets/final/shard.png");
    this.load.image("fortunecoin", "/assets/final/fortunecoin.png");
    
    STAT_TYPES.forEach((type) => {
      for(let i = 1; i <= 5; i++) {
        if(i <= 3) {
          this.load.image(`${type}-ORB-${i}`, `/assets/final/${type}/${type}-ORB-${i}.png`);
        }
        this.load.image(`${type}-${i}`, `/assets/final/${type}/${type}-${i}.png`);
      }
    });

    this.load.audio("small-stat-increase", "/assets/final/audio/smallstatincrease.mp3");
    this.load.audio("large-stat-increase", "/assets/final/audio/largestatincrease.mp3");

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
