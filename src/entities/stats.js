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

        eventBus.on('game:statsUpdated', this.onStatsUpdated);
    }

    createStats() {
        this.earth = this.scene.add.text(20, 50, `Earth: ${character.stats.EARTH} / 100`);
        this.air = this.scene.add.text(20, 80, `Air: ${character.stats.AIR} / 100`);
        this.fire = this.scene.add.text(20, 110, `Fire: ${character.stats.FIRE} / 100`);
        this.water = this.scene.add.text(20, 140, `Water: ${character.stats.WATER} / 100`);
    }

    updateStats() {
        this.earth.text = `Earth: ${character.stats.EARTH} / 100`;
        this.air.text = `Air: ${character.stats.AIR} / 100`;
        this.fire.text = `Fire: ${character.stats.FIRE} / 100`;
        this.water.text = `Water: ${character.stats.WATER} / 100`;
    }

    cleanup() {
        eventBus.off('game:statsUpdated', this.onStatsUpdated);
    }
}
