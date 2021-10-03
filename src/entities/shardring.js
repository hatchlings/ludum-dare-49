import character from '../model/character';
import eventBus from '../util/eventbus';

export class ShardRing {

    constructor(scene) {
        this.scene = scene;

        this.points = character.entropyCapacity;
        this.radius = 120;
        this.pointPool = [];

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

        for(let i = 0; i < this.points; i++) {
            const point = {
                x: this.radius * Math.cos((i * 2 * Math.PI) / this.points),
                y: this.radius * Math.sin((i * 2 * Math.PI) / this.points)
            }
            this.pointPool.push(point);
        }

        this.pointPool.forEach((p) => {
            this.scene.add.sprite(p.x + (1024 / 2), p.y + (768 / 2), "shard");
        })

    }

    updateEntropy() {
    }

    cleanup() {
        eventBus.off("game:entropyUpdated", this.onEntropyUpdated);
    }

}