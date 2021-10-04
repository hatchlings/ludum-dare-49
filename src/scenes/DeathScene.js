import { Scene } from "phaser";
import character from '../model/character';

const FLAVOR_TEXT_CONFIG = {
    fontFamily: "Amatic SC",
    fontSize: 36,
    stroke: "#000",
    strokeThickness: 6
}

export class DeathScene extends Scene {

  constructor() {
    super({key: "DeathScene"});
  }

  create() {
      this.overlay = this.add.sprite(1024 / 2, 768 / 2, "overlay");
      this.overlay.setScale(2.0);
      
      this.swirl = this.add.sprite(1024 / 2, 768 / 2, "deathswirl");
      this.tweens.add({
          targets: this.swirl,
          angle: 360,
          duration: 250000,
          repeat: -1
      });

      this.add.text(1024 / 2 - 40, 195, "AW DARN!", FLAVOR_TEXT_CONFIG);
      this.add.text(1024 / 2 - 70, 245, "Chaos destroyed", FLAVOR_TEXT_CONFIG);
      this.add.text(1024 / 2 - 60, 285, "An elemental", FLAVOR_TEXT_CONFIG);
      this.add.text(1024 / 2 - 100, 325, "Island! Womp Womp.", FLAVOR_TEXT_CONFIG);

      const graphics = this.add.graphics();
      graphics.fillStyle(0x630460, 1);
      graphics.fillRoundedRect(370, 400, 320, 110, 16);

      this.add.text(1024 / 2 - 110, 405, `Bane of chaos        +  ${character.lastBane}`, FLAVOR_TEXT_CONFIG);
      this.add.text(1024 / 2 - 120, 455, `Boon of fortune     +  ${character.lastBoon}`, FLAVOR_TEXT_CONFIG);

      const shard = this.add.sprite(660, 425, "shard");
      shard.setScale(0.33);

      const fortune = this.add.sprite(660, 475, "fortunecoin");
      fortune.setScale(0.25);

      const button = this.add.sprite(1024 / 2 + 15, 555, "button");
      button.setInteractive({useHandCursor: true});

      this.add.tween({
          targets: button,
          scale: "+=0.025",
          duration: 250,
          yoyo: true,
          repeat: -1,
      });

      button.on('pointerover', () => {
          button.setTexture("buttonpressed");
      });

      button.on('pointerout', () => {
        button.setTexture("button");
      });

      button.on('pointerup', () => {
          this.scene.run("MainScene");
          this.scene.stop();
      });

      this.add.text(1024 / 2 - 35, 535, "   S H O P  ", FLAVOR_TEXT_CONFIG);

  }

}
