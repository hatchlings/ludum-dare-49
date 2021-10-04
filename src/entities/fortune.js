import character from '../model/character';
import eventBus from '../util/eventbus';
import { AnimatedText } from './animatedtext';

export class Fortune {

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
        this.fortune = this.scene.add.sprite(this.x - 20, this.y + 30, "fortunecoin");
        this.fortune.setScale(0.25);

        this.fortuneText = this.scene.add.text(this.x, this.y, character.fortune, {fontFamily: "Amatic SC", fontSize: 50, stroke: "#000", strokeThickness: 6});
    }

    updateFortune() {
        this.fortuneText.text = character.fortune;
        new AnimatedText(
            this.scene,
            this.fortuneText.x,
            this.fortuneText.y + 50,
            "+1",
            {fontFamily: "Amatic SC", fontSize: 50, stroke: "#000", strokeThickness: 6},
            {y: "+=20", duration: 1500, alpha: 0}
        );
    }

    cleanup() {
        eventBus.off("game:fortuneUpdated", this.onFortuneUpdated);
    }

}