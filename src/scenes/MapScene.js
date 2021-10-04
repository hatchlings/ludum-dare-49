import { Scene } from 'phaser';
import { Fortune } from '../entities/fortune';
import { MapCharacter } from '../entities/mapcharacter';
//import { MapLines } from '../entities/maplines';
import { MapIcon } from '../entities/mapicon';
import { Roll } from '../entities/roll';
import { ShardRing } from '../entities/shardring';
import gameManager from '../managers/gamemanager';
import gameState from '../model/gamestate';
import eventBus from '../util/eventbus';

const ORBIT_LOCATIONS = [
    { type: 'AIR', startAt: 0 },
    { type: 'FIRE', startAt: 0.75 },
    { type: 'WATER', startAt: 0.5 },
    { type: 'EARTH', startAt: 0.25 },
];
const ORBIT_CENTER = { x: 512, y: 390 }; //Also HOME position
const ORBIT_WIDTH = 700;
const ORBIT_HEIGHT = 500;
const ORBIT_ANGLE = 0; //degrees

export class MapScene extends Scene {
    constructor() {
        super({ key: 'MapScene' });

        gameManager.setScene(this);

        this.travelPoints = [];
    }

    create() {
        this.background = this.add.image(400, 300, 'background');

        // this.stats = new Stats(this);
        // this.ressurections = new Ressurections(this);
        // this.entropy = new Entropy(this);

        gameState.blockingMapInput = false;

        this.onWin = () => {
            this.scene.run("VictoryScene");
            this.scene.pause();
        };

        eventBus.on("game:win", this.onWin);

        this.fortune = new Fortune(this, 960, 10);
        this.shardRing = new ShardRing(this);

        this.orbit = new Phaser.Curves.Path(ORBIT_CENTER.x + ORBIT_WIDTH / 2, ORBIT_CENTER.y - 40);
        this.orbit.ellipseTo(ORBIT_WIDTH / 2, ORBIT_HEIGHT / 2, 0, 360, true, ORBIT_ANGLE);

        this.addTravelPoints();
        this.addLocations();
        //this.mapLines = new MapLines(this, ORBIT_CENTER);
        this.addCharacter();
        
        this.roll = new Roll(this);

        this.startOrbits();

        this.input.keyboard.on('keyup-B', () => {
            this.scene.start('MainScene');
        });
    }

    update(time, delta) {
        this.updateLocations();
        this.character.update();
        //this.mapLines.update();
    }

    addCharacter() {
        this.character = new MapCharacter(this, ORBIT_CENTER.x, ORBIT_CENTER.y, this.orbit);
    }

    addTravelPoints() {
        const home = new MapIcon(this, ORBIT_CENTER.x, ORBIT_CENTER.y, 'HOME');
        this.travelPoints.push(home);
    }

    addLocations() {
        this.orbitLocations = ORBIT_LOCATIONS.map((location) => {
            const tp = new MapIcon(this, 0, 0, location.type, this.orbit, location.startAt);
            this.travelPoints.push(tp);
            return tp;
        });
    }

    startOrbits() {
        this.orbitLocations.forEach((island) => {
            island.startOrbit();
        });
    }

    updateLocations() {
        this.orbitLocations.forEach((island) => {
            island.update();
        });
    }

    returnHome() {
        this.character.cleanup();
        // this.stats.cleanup();
        // this.ressurections.cleanup();
        // this.entropy.cleanup();
        this.fortune.cleanup();
        this.fortune.hideFortune();

        this.roll.cleanup();
        
        this.shardRing.cleanup();

        this.travelPoints.forEach((tp) => {
            tp.cleanup();
        });

        eventBus.off("game:win", this.onWin);
        this.scene.run('DeathScene');
    }
}
