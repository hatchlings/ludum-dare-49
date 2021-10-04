import character from '../model/character';
import eventBus from '../util/eventbus';

export class ShopEntropy {

    constructor(scene, x, y) {
        this.scene = scene;
        this.x = x;
        this.y = y;

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
        this.entropy = this.scene.add.text(this.x, this.y, character.entropyCapacity, {fontFamily: "Amatic SC", fontSize: 50, stroke: "#000", strokeThickness: 6});
    }

    updateEntropy() {
        this.entropy.text = character.entropyCapacity;
    }

    cleanup() {
        eventBus.off("game:entropyUpdated", this.onEntropyUpdated);
    }

}