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

        eventBus.on('game:entropyUpdated', this.onEntropyUpdated);
    }

    createEntropy() {
        this.entropy = this.scene.add.text(
            580,
            50,
            `Chaos Force: ${character.entropy} / ${character.entropyCapacity}`
        );
    }

    updateEntropy() {
        this.entropy.text = `Chaos Force: ${character.entropy}/${character.entropyCapacity}`;
    }

    cleanup() {
        eventBus.off('game:entropyUpdated', this.onEntropyUpdated);
    }
}
