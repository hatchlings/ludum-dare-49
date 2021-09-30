import Phaser from "phaser";
import gameConfig from "./config";

export default new Phaser.Game(gameConfig);

function resize(gameSize, baseSize, displaySize, resolution) {
  var width = gameSize.width;
  var height = gameSize.height;

  this.cameras.resize(width, height);

  this.bg.setSize(width, height);
  this.logo.setPosition(width / 2, height / 2);
}
