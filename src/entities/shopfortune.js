import character from '../model/character';
import eventBus from '../util/eventbus';

export class ShopFortune {

    constructor(scene, x, y) {
        this.scene = scene;
        this.x = x;
        this.y = y;

        this.createFortune();
        this.setupListeners();
    }

    setupListeners() {
        this.onFortuneUpdated = () => {
            this.updateFortune();
        };

        eventBus.on("game:fortuneUpdated", this.onFortuneUpdated);
    }

    createFortune() {
        this.fortuneText = this.scene.add.text(this.x, this.y, character.fortune, {fontFamily: "Amatic SC", fontSize: 50, stroke: "#000", strokeThickness: 6});
    }

    updateFortune() {
        this.fortuneText.text = character.fortune;
    }

    cleanup() {
        eventBus.off("game:fortuneUpdated", this.onFortuneUpdated);
    }

}