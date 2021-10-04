import eventBus from '../util/eventbus';

const BASE_STAT = 2;
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

        this.entropyCapacity = 5;
        this.minimumEntropyCapacity = 3;

        this.fortune = 30;

        this.staffName = 'Basic Staff';
        this.staffStats = [-1, -1, 0, 1];

        this.shield = 0;

        this.entropy = 0;
        this.mapPosition = 0;
        this.mapPositionName = 'HOME';
    }

    get isDead() {
        return Object.values(this.stats).some((val) => val <= 0);
    }

    applyPositionChange(pos, _data) {
        let increase = 1;
        switch (pos) {
            case 'EARTH':
                if (this.mapPositionName === 'FIRE') increase = 2;
                break;
            case 'FIRE':
                if (this.mapPositionName === 'EARTH') increase = 2;
                break;
            case 'AIR':
                if (this.mapPositionName === 'WATER') increase = 2;
                break;
            case 'WATER':
                if (this.mapPositionName === 'AIR') increase = 2;
                break;
            default:
                this.mapPositionName = pos;
                return;
        }
        this.entropy = Phaser.Math.Clamp(this.entropy + increase, 0, this.entropyCapacity);
        this.mapPositionName = pos;
        eventBus.emit('game:entropyUpdated');
    }

    applyStat(stat, quantity) {
        this.stats[stat] = Phaser.Math.Clamp(this.stats[stat] + quantity, 0, 10);
        eventBus.emit('game:statsUpdated');
        if (quantity < 0) {
            eventBus.emit('game:damageIsland', stat);
        }
    }

    applyPermanentStatBoost(stat, quantity) {
        this.permanentStatBoosts[stat] += quantity;
    }

    // applyRndBoon() {
    //     let stat = Phaser.Math.RND.pick(Object.keys(this.stats));
    //     this.applyPermanentStatBoost(stat, Phaser.Math.RND.pick([1, 2]));
    // }

    applyRndBane() {
        this.entropyCapacity += Phaser.Math.RND.pick([0, 0, 1, 2, 3]);
        eventBus.emit('game:entropyUpdated');
    }

    resetCurrentEntropy() {
        this.entropy = 0;
        eventBus.emit('game:entropyUpdated');
    }

    addFortune() {
        this.fortune += 1;
        eventBus.emit('game:fortuneUpdated');
    }

    removeFortune(quantity) {
        this.fortune -= quantity;
        eventBus.emit('game:fortuneUpdated');
    }

    setStaffStats(stats, name) {
        this.staffStats = stats;
        this.staffName = name;
    }

    setShieldDurability(amount) {
        this.shield += amount;
    }

    reduceShieldDurability() {
        this.shield -= 1;
    }

    updateEntropyPool(amount) {
        this.entropyCapacity += amount;
        eventBus.emit('game:entropyUpdated');
    }

    resetForRound() {
        STAT_TYPES.forEach((type) => {
            this.stats[type] = BASE_STAT + this.permanentStatBoosts[type];
        });

        this.deathCount += 1;
        this.entropy = 0;

        this.mapPosition = 0;
        this.mapPositionName = 'HOME';

        this.staffName = 'Basic Staff';
        this.staffStats = [-1, -1, 0, 1];

        this.shield = 0;

        eventBus.emit('game:roundReset');
    }
}

let character = new Character();
export default character;
