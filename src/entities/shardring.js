import character from '../model/character';
import eventBus from '../util/eventbus';

export class ShardRing {

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
        console.log(`Creating ${character.entropyCapacity} shards with ${character.entropy} active.`);
    }

    updateEntropy() {
    }

    cleanup() {
        eventBus.off("game:entropyUpdated", this.onEntropyUpdated);
    }

}