import eventBus from '../util/eventbus';

const BASE_STAT = 7;
export const STAT_TYPES = ['EARTH', 'AIR', 'FIRE', 'WATER'];

class Character {
    constructor() {
        this.stats = {
            EARTH: BASE_STAT,
            AIR: BASE_STAT,
            FIRE: BASE_STAT,
            WATER: BASE_STAT,
        };

        this.permanentStatBoosts = {
            EARTH: 0,
            AIR: 0,
            FIRE: 0,
            WATER: 0,
        };

        this.deathCount = 0;

        this.entropyCapacity = 300;
        this.tamingPowerBoost = 0;
        this.entropy = 100;
        this.mapPosition = 0;
        this.mapPositionName = 'HOME';
    }

    applyPositionChange(pos, _data, name) {
        if (name !== 'HOME') {
            this.entropy += Phaser.Math.RND.between(8, 20);
            STAT_TYPES.forEach((type) => {
                this.stats[type] += Phaser.Math.RND.between(-3, 3);
                if (this.stats[type] < 0) this.stats[type] = 0;
            });
        } else {
            let sum = 0;
            let flux = 0;
            let prev = 0;
            Object.values(this.stats).forEach((val) => {
                sum += val;
                flux = Math.abs(val - prev);
            });
            console.log(`Taming power: ${sum / 4} with Flux reduction:${flux / 4}`);
            this.entropy -= parseInt((sum - flux) / 4);
            this.tamingPowerBoost = this.tamingPowerBoost >= 5 ? 5 : (this.tamingPowerBoost += 1);
            this.stats = {
                EARTH: BASE_STAT + this.tamingPowerBoost,
                AIR: BASE_STAT + this.tamingPowerBoost,
                FIRE: BASE_STAT + this.tamingPowerBoost,
                WATER: BASE_STAT + this.tamingPowerBoost,
            };
        }
        eventBus.emit('game:entropyUpdated');
        eventBus.emit('game:statsUpdated');
        this.mapPosition = pos;
        this.mapPositionName = name;
    }

    applyStat(stat, quantity) {
        this.stats[stat] += quantity;
        eventBus.emit('game:statsUpdated');
    }

    applyPermanentStatBoost(stat, quantity) {
        this.permanentStatBoosts[stat] += quantity;
    }

    applyRndBane() {
        this.entropyCapacity += Phaser.Math.RND.pick([-1, 1]);
    }

    applyRndBoon() {
        let stat = Phaser.Math.RND.pick(Object.keys(this.stats));
        this.applyPermanentStatBoost(stat, Phaser.Math.RND.pick([1, 2]));
    }

    randomBoonOrBane() {
        let baneOrBoon = Phaser.Math.RND.pick([this.applyRndBane, this.applyRndBoon]);
        baneOrBoon.call(this);
        eventBus.emit('game:entropyUpdated');
    }

    resetCurrentEntropy() {
        this.entropy = 0;
        eventBus.emit('game:entropyUpdated');
    }

    resetForRound() {
        STAT_TYPES.forEach((type) => {
            this.stats[type] = BASE_STAT + this.permanentStatBoosts[type];
        });

        this.deathCount += 1;
        this.entropy = 200;

        this.mapPosition = 0;
        this.mapPositionName = 'HOME';

        eventBus.emit('game:roundReset');
    }
}

let character = new Character();
export default character;
