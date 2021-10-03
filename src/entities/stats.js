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
        this.earth = this.scene.add.text(20, 50, `Earth: ${character.stats.EARTH}/10`, {fontFamily: "Amatic SC", fontSize: 24, stroke: "#000", strokeThickness: 6});
        this.air = this.scene.add.text(20, 90, `Air: ${character.stats.AIR}/10`, {fontFamily: "Amatic SC", fontSize: 24, stroke: "#000", strokeThickness: 6});
        this.fire = this.scene.add.text(20, 130, `Fire: ${character.stats.FIRE}/10`, {fontFamily: "Amatic SC", fontSize: 24, stroke: "#000", strokeThickness: 6});
        this.water = this.scene.add.text(20, 170, `Water: ${character.stats.WATER}/10`, {fontFamily: "Amatic SC", fontSize: 24, stroke: "#000", strokeThickness: 6});
    }

    updateStats() {
        this.earth.text = `Earth: ${character.stats.EARTH}/10`;
        this.air.text = `Air: ${character.stats.AIR}/10`;
        this.fire.text = `Fire: ${character.stats.FIRE}/10`;
        this.water.text =`Water: ${character.stats.WATER}/10`;
    }

    cleanup() {
        eventBus.off("game:statsUpdated", this.onStatsUpdated);
    }

}