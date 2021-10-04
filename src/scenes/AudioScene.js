import { Scene } from "phaser";
import audioManager from '../managers/audiomanager';

export class AudioScene extends Scene {

  constructor() {
    super({key: "AudioScene"});
  }

  create() {
      audioManager.play(this, "whitenoise", {loop: true, volume: 0.4});
      audioManager.play(this, "melody", {loop: true, delay: 10, volume: 0.6});
  }

}
