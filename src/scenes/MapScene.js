import { Scene } from 'phaser';
import { Entropy } from '../entities/entropy';
import { Fortune } from '../entities/fortune';
import { MapCharacter } from '../entities/mapcharacter';
import { MapIcon } from '../entities/mapicon';
import { Ressurections } from '../entities/ressurections';
import { ShardRing } from '../entities/shardring';
import { Stats } from '../entities/stats';
import gameManager from '../managers/gamemanager';

const ORBIT_LOCATIONS = [
    { type: 'AIR', startAt: 0 },
    { type: 'FIRE', startAt: 0.75 },
    { type: 'WATER', startAt: 0.5 },
    { type: 'EARTH', startAt: 0.25 },
];
const ORBIT_CENTER = { x: 512, y: 390 }; //Also HOME position
const ORBIT_WIDTH = 740;
const ORBIT_HEIGHT = 480;
const ORBIT_ANGLE = 10; //degrees

export class MapScene extends Scene {
    constructor() {
        super({ key: 'MapScene' });

        gameManager.setScene(this);

        this.travelPoints = [];
    }

    create() {
        this.background = this.add.image(400, 300, 'background');

        this.stats = new Stats(this);
        this.ressurections = new Ressurections(this);
        this.entropy = new Entropy(this);
        this.fortune = new Fortune(this, 870, 10);
        this.shardRing = new ShardRing(this);

        this.orbit = new Phaser.Curves.Path(ORBIT_CENTER.x + 390, ORBIT_CENTER.y);
        this.orbit.ellipseTo(ORBIT_WIDTH / 2, ORBIT_HEIGHT / 2, 0, 360, true, ORBIT_ANGLE);

        this.addTravelPoints();
        this.addLocations();
        this.addCharacter();

        this.input.keyboard.on('keyup-B', () => {
            this.scene.start('MainScene');
            this.startOrbits();
        });
    }

    update(time, delta) {
        this.updateLocations();
        this.updateCharacter();
    }

    addCharacter() {
        this.character = new MapCharacter(this, ORBIT_CENTER.x, ORBIT_CENTER.y);
    }

    addTravelPoints() {
        const home = new MapIcon(this, ORBIT_CENTER.x, ORBIT_CENTER.y, 'HOME');
        this.travelPoints.push(home);
    }

    addLocations() {
        this.orbitLocations = ORBIT_LOCATIONS.map((location) => {
            return new MapIcon(this, 0, 0, location.type, this.orbit, location.startAt);
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
    updateCharacter() {}

    returnHome() {
        this.character.cleanup();
        this.stats.cleanup();
        this.ressurections.cleanup();
        this.entropy.cleanup();
        this.fortune.cleanup();
        this.shardRing.cleanup();

        this.travelPoints.forEach((tp) => {
            tp.cleanup();
        });

        this.scene.start('MainScene');
    }
}
