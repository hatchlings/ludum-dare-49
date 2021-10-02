import character from '../model/character';
import eventBus from '../util/eventbus';

export class Stats {

    constructor(scene) {
        this.scene = scene;
        this.createStats();

        this.setupListeners();
    }

    setupListeners() {
        this.onStatsUpdated = () => {
            this.updateStats();
        };

        eventBus.on("game:statsUpdated", this.onStatsUpdated);
    }

    createStats() {
        this.earth = this.scene.add.text(20, 50, `Earth: ${character.stats.EARTH}`);
        this.air = this.scene.add.text(20, 80, `Air: ${character.stats.AIR}`);
        this.fire = this.scene.add.text(20, 110, `Fire: ${character.stats.FIRE}`);
        this.water = this.scene.add.text(20, 140, `Water: ${character.stats.WATER}`);
    }

    updateStats() {
        this.earth.text = `Earth: ${character.stats.EARTH}`;
        this.air.text = `Air: ${character.stats.AIR}`;
        this.fire.text = `Fire: ${character.stats.FIRE}`;
        this.water.text =`Water: ${character.stats.WATER}`;
    }

    cleanup() {
        eventBus.off("game:statsUpdated", this.onStatsUpdated);
    }

}