import character from '../model/character';
import eventBus from '../util/eventbus';

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
        this.fortune = this.scene.add.text(this.x, this.y, `Fortune: ${character.fortune}`);
    }

    updateFortune() {
        this.fortune.text = `Fortune: ${character.fortune}`;
    }

    cleanup() {
        eventBus.off("game:fortuneUpdated", this.onFortuneUpdated);
    }

}