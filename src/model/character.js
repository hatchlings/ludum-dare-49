import Phaser from "phaser";

const BASE_STAT = 3;
const STAT_TYPES = [
    "EARTH",
    "AIR",
    "FIRE",
    "WATER"
];

export class Character {

    constructor() {
        this.stats = {
            "EARTH": BASE_STAT,
            "AIR": BASE_STAT,
            "FIRE": BASE_STAT,
            "WATER": BASE_STAT
        }
    }

    applyEntropy(kinds) {
        this.applyNegativeEntropy(kinds.length);
        this.applyPositiveEntropy(kinds);
        return this.stats;
    }

    applyNegativeEntropy(quantity) {
        for(let i = 0; i < quantity + 1; i++) {
            const shouldDeduct = Phaser.Math.RND.between(1, 6);
            if(shouldDeduct < 5) {
                this.stats[STAT_TYPES[shouldDeduct - 1]] -= 1;
            }
        }
    }

    applyPositiveEntropy(kinds) {
        kinds.forEach((kind) => {
            const chanceForExtra = Phaser.Math.RND.pick([0, 0, 0, 1]);
            this.stats[kind] += (1 + chanceForExtra);
        });
    }


}