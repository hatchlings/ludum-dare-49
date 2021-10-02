
const BASE_STAT = 1;

class Character {

    constructor() {
        this.stats = {
            "EARTH": BASE_STAT,
            "AIR": BASE_STAT,
            "FIRE": BASE_STAT,
            "WATER": BASE_STAT
        }

        this.permanentStatBoosts = {
            "EARTH": 0,
            "AIR": 0,
            "FIRE": 0,
            "WATER": 0
        }

        this.entropy = 1;
        this.mapPosition = 0;
        this.mapPositionName = "HOME";

    }

    applyPositionChange(pos, _data, name) {
        if(name !== "HOME") {
            if(this.mapPosition === 0 || pos === 0) {
                this.entropy += 1;
            } else if(Math.abs(this.mapPosition - pos) === 2) {
                this.entropy += 2;
            } else {
                this.entropy += 1;
            }
        }

        this.mapPosition = pos;
        this.mapPositionName = name;
    }

    applyStat(stat, quantity) {
        this.stats[stat] += quantity;
    }

    applyPermanentStatBoost(stat, quantity) {
        this.permanentStatBoosts[stat] += quantity;
    }

    resetEntropy() {
        this.entropy = 1;
    }
    
    resetForRound() {
        this.stats["EARTH"] = BASE_STAT + this.permanentStatBoosts["EARTH"];
        this.stats["AIR"] = BASE_STAT + this.permanentStatBoosts["AIR"];
        this.stats["FIRE"] = BASE_STAT + this.permanentStatBoosts["FIRE"];
        this.stats["WATER"] = BASE_STAT + this.permanentStatBoosts["WATER"];
        this.mapPositionName = "HOME";
        this.resetEntropy();
    }

}

let character = new Character();
export default character;