import Phaser from "phaser";
import eventBus from '../util/eventbus';

const BASE_STAT = 3;
const STAT_TYPES = [
    "EARTH",
    "AIR",
    "FIRE",
    "WATER"
];

class Character {

    constructor() {
        this.stats = {
            "EARTH": BASE_STAT,
            "AIR": BASE_STAT,
            "FIRE": BASE_STAT,
            "WATER": BASE_STAT
        }

        this.setupListeners();
    }

    setupListeners() {
        eventBus.on("game:entropyGained", (type) => {
            this.applyEntropy([type]);
            console.log(this.stats);
        });
    }

    applyEntropy(kinds) {
        this.applyNegativeEntropy(kinds.length);
        this.applyPositiveEntropy(kinds);
        return this.stats;
    }

    applyNegativeEntropy(quantity) {
        for(let i = 0; i < quantity; i++) {
            const shouldDeduct = Phaser.Math.RND.between(1, 6);
            if(shouldDeduct < 5) {
                const type = STAT_TYPES[shouldDeduct - 1]
                console.log(`Deducting 1 entropy of type: ${type}`);
                this.stats[type] -= 1;
            }
        }
    }

    applyPositiveEntropy(kinds) {
        kinds.forEach((kind) => {
            const chanceForExtra = Phaser.Math.RND.pick([0, 0, 0, 1]);
            const quantity = (1 + chanceForExtra);
            this.stats[kind] += (1 + chanceForExtra);
            console.log(`Applying ${quantity} entropy of type: ${kind}`);
        });
    }

}

let character = new Character();
export default character;