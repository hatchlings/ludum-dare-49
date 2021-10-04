import character from '../model/character';
import eventBus from '../util/eventbus';

const ATTACK_POS = {
    "EARTH": { x: 512, y: 90 },
    "AIR": { x: 874, y: 384 },
    "FIRE": { x: 512, y: 618 },
    "WATER": { x: 150, y: 394 },
};

export class ShardRing {

    constructor(scene) {
        this.scene = scene;

        this.currentEntropy = character.entropy;
        this.capacity = character.entropyCapacity;

        this.points = character.entropyCapacity;

        this.radius = 120;

        this.entropyIndex = 0;

        this.pointPool = [];
        this.shardPool = [];

        this.createEntropy();
        this.setupListeners();
    }

    setupListeners() {
        this.onEntropyUpdated = () => {
            this.updateEntropy();
        };

        this.onAttack = (type) => {
            this.attack(type);
        };

        eventBus.on("game:entropyUpdated", this.onEntropyUpdated);
        eventBus.on("game:damageIsland", this.onAttack)
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

    attack(type) {
        console.log(`Sending shard ${this.entropyIndex} to type ${type}`);
        let attackShard = this.shardPool[this.entropyIndex];    
        let duplicateShard = this.scene.add.sprite(attackShard.x, attackShard.y, "shard");

        attackShard.setAlpha(0.3);

        const dest = ATTACK_POS[type];
        const angleBetween = Phaser.Math.Angle.Between(duplicateShard.x, duplicateShard.y, dest.x, dest.y);

        this.scene.tweens.add({
            targets: duplicateShard,
            duration: 500,
            angle: angleBetween + 45
        });

        this.scene.tweens.add({
            targets: duplicateShard,
            duration: 750,
            x: dest.x,
            y: dest.y,
            onComplete: () => {
                duplicateShard.destroy();
            }
        });

        this.entropyIndex++;
    }

    updateEntropy() {
        if(this.capacity !== character.entropyCapacity) {
            this.capacity = character.entropyCapacity;

            this.pointPool = [];
            this.createShardPoints();
            this.destroyShards();
            this.createShards();
        } else if(this.currentEntropy !== character.entropy) {

            if(character.entropy < this.currentEntropy) {
                this.entropyIndex = 0;
            }

            this.currentEntropy = character.entropy

            this.shardPool.forEach((shard, index) => {
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
        eventBus.off("game:damageIsland", this.onAttack)
    }

}