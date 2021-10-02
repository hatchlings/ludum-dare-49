import character from '../model/character';
import eventBus from '../util/eventbus';

export class Entropy {

    constructor(scene) {
        this.scene = scene;
        this.createEntropy();

        this.setupListeners();
    }

    setupListeners() {
        this.onEntropyUpdated = () => {
            this.updateEntropy();
        };

        eventBus.on("game:entropyUpdated", this.onEntropyUpdated);
    }

    createEntropy() {
        this.entropy = this.scene.add.text(680, 50, `Entropy: ${character.entropy}`);
    }

    updateEntropy() {
        this.entropy.text = `Entropy: ${character.entropy}`;
    }

    cleanup() {
        eventBus.off("game:entropyUpdated", this.onStatsUpdated);
    }

}