import character from '../model/character';
import eventBus from '../util/eventbus';

export class ShardRing {

    constructor(scene) {
        this.scene = scene;

        this.currentEntropy = character.entropy;
        this.capacity = character.entropyCapacity;

        this.points = character.entropyCapacity;

        this.radius = 120;

        this.pointPool = [];
        this.shardPool = [];

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
        this.createShardPoints();
        this.createShards();
    }

    createShardPoints() {
        for(let i = 0; i < this.points; i++) {
            const point = {
                x: this.radius * Math.cos((i * 2 * Math.PI) / this.points),
                y: this.radius * Math.sin((i * 2 * Math.PI) / this.points)
            }
            this.pointPool.push(point);
        }

    }

    createShards() {
        this.pointPool.forEach((p) => {
            const shard = this.scene.add.sprite(p.x + (1024 / 2), p.y + (768 / 2), "shard");
            shard.setAlpha(0.3);
            shard.activeShard = false;
            this.shardPool.push(shard);
        })
    }

    destroyShards() {
        this.shardPool.forEach((shard) => {
            shard.destroy();
        })
    }

    updateEntropy() {
        if(this.capacity !== character.entropyCapacity) {
            this.capacity = character.entropyCapacity;

            this.pointPool = [];
            this.createShardPoints();
            this.destroyShards();
            this.createShards();
        } else if(this.currentEntropy !== character.entropy) {
            this.currentEntropy = character.entropy



            this.shardPool.forEach((shard, index) => {
                console.log(index, this.currentEntropy);
                if(index < this.currentEntropy) {
                    shard.setAlpha(1);
                } else {
                    shard.setAlpha(0.3);
                }
            });
        }
    }

    cleanup() {
        eventBus.off("game:entropyUpdated", this.onEntropyUpdated);
    }

}