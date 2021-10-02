import character from '../model/character';
import eventBus from '../util/eventbus';

export class Ressurections {
    constructor(scene) {
        this.scene = scene;
        this.createTextBlock();

        this.setupListeners();
    }

    setupListeners() {
        this.onRoundReset = () => {
            this.updateCount();
        };

        eventBus.on('game:roundReset', this.onRoundReset);
    }

    createTextBlock() {
        this.count = this.scene.add.text(630, 80, `Ressurections: ${character.deathCount}`);
    }

    updateCount() {
        this.count.text = `Ressurections: ${character.deathCount}`;
    }

    cleanup() {
        eventBus.off('game:roundReset', this.onRoundReset);
    }
}
