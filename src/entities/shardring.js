import character from '../model/character';
import eventBus from '../util/eventbus';

const ATTACK_POS = {
    EARTH: { x: 512, y: 90 },
    AIR: { x: 874, y: 384 },
    FIRE: { x: 512, y: 618 },
    WATER: { x: 150, y: 394 },
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
        this.emitters = [];
        this.particles = this.scene.add.particles('shardspark');

        this.addBacklight(0);
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

        eventBus.on('game:entropyUpdated', this.onEntropyUpdated);
        eventBus.on('game:damageIsland', this.onAttack);
    }

    createEntropy() {
        console.log(
            `Creating ${character.entropyCapacity} shards with ${character.entropy} active.`
        );
        this.createShardPoints();
        this.createShards();
    }

    createShardPoints() {
        for (let i = 0; i < this.points; i++) {
            const point = {
                x: this.radius * Math.cos((i * 2 * Math.PI) / this.points),
                y: this.radius * Math.sin((i * 2 * Math.PI) / this.points),
            };
            this.pointPool.push(point);
        }
    }

    createShards() {
        this.emitters = [];
        this.pointPool.forEach((p) => {
            const shard = this.scene.add.sprite(p.x + 1024 / 2, p.y + 768 / 2, 'shard');
            shard.setScale(0.5);
            shard.setAlpha(0.7);
            shard.activeShard = false;
            this.shardPool.push(shard);

            let emitter = this.particles.createEmitter();

            emitter.setPosition(shard.x, shard.y);
            emitter.setSpeed(20);
            emitter.setBlendMode(Phaser.BlendModes.ADD);
            emitter.stop();
            this.emitters.push(emitter);
        });
    }

    destroyShards() {
        this.shardPool.forEach((shard) => {
            shard.destroy();
        });
        this.emitters.forEach((emitter) => {
            emitter.remove();
        });
    }

    attack(type) {
        //console.log(`Sending shard ${this.entropyIndex} to type ${type}`);
        let attackShard = this.shardPool[this.entropyIndex];
        let duplicateShard = this.scene.add.sprite(attackShard.x, attackShard.y, 'shard');
        duplicateShard.setScale(0.5);

        attackShard.setAlpha(0.7);

        //const dest = ATTACK_POS[type];
        let dest = this.scene.orbitLocations.find((island) => island.type === type);
        const angleBetween = Phaser.Math.Angle.Between(
            duplicateShard.x,
            duplicateShard.y,
            dest.x,
            dest.y
        );

        this.scene.tweens.add({
            targets: duplicateShard,
            duration: 350,
            angle: angleBetween + 45,
        });

        this.scene.tweens.add({
            targets: duplicateShard,
            duration: 500,
            x: dest.x,
            y: dest.y,
            onComplete: () => {
                eventBus.emit(`game:${type}Hit`);
                console.log(
                    `Shard hit ${type} at (${Number.parseInt(duplicateShard.x)},${Number.parseInt(
                        duplicateShard.y
                    )})`
                );

                duplicateShard.destroy();
            },
        });

        this.entropyIndex++;
    }

    addBacklight(radius) {
        let intensity = 0.35;
        let attenuation = 0.21;
        this.backlight && this.backlight.destroy();
        this.backlight = this.scene.add.pointlight(512, 384, 0, radius, intensity);
        this.backlight.color.setTo(50, 0, 50);
        this.backlight.attenuation = attenuation;
    }

    updateBacklight() {
        this.scene.tweens.add({
            targets: this.backlight,
            radius: (200 * this.currentEntropy + 1) / this.capacity,
            duration: 500,
            ease: 'Sine.easeInOut',
        });
    }

    updateEntropy() {
        if (this.capacity !== character.entropyCapacity) {
            this.capacity = character.entropyCapacity;

            this.pointPool = [];
            this.createShardPoints();
            this.destroyShards();
            this.createShards();
        } else if (this.currentEntropy !== character.entropy) {
            if (character.entropy < this.currentEntropy) {
                this.entropyIndex = 0;
            }

            this.currentEntropy = character.entropy;

            this.shardPool.forEach((shard, index) => {
                if (index < this.currentEntropy) {
                    shard.setAlpha(1);
                    this.emitters[index].start();
                } else {
                    shard.setAlpha(0.5);
                    this.emitters[index].stop();
                }
            });
        }
        this.updateBacklight();
    }

    cleanup() {
        eventBus.off('game:entropyUpdated', this.onEntropyUpdated);
        eventBus.off('game:damageIsland', this.onAttack);
    }
}
