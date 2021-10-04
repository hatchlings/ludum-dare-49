import { Scene } from 'phaser';
import { Fortune } from '../entities/fortune';
import { MapCharacter } from '../entities/mapcharacter';
import { MapIcon } from '../entities/mapicon';
import { ShardRing } from '../entities/shardring';
import gameManager from '../managers/gamemanager';

const TRAVEL_POS = [
    { x: 512, y: 90 },
    { x: 874, y: 384 },
    { x: 512, y: 618 },
    { x: 150, y: 394 },
];

const LOCATIONS = ['EARTH', 'AIR', 'FIRE', 'WATER'];

export class MapScene extends Scene {
    constructor() {
        super({ key: 'MapScene' });

        gameManager.setScene(this);

        this.travelPoints = [];
    }

    create() {
        this.background = this.add.image(1024/2, 768/2, 'background');

        //this.stats = new Stats(this);
        //this.ressurections = new Ressurections(this);
        //this.entropy = new Entropy(this);
        this.fortune = new Fortune(this, 950, 10);
        this.shardRing = new ShardRing(this)

        this.addTravelPoints();
        this.addCharacter();

        this.input.keyboard.on('keyup-B', () => {
            this.scene.start('MainScene');
        });
    }

    addCharacter() {
        this.character = new MapCharacter(this, 512, 384);
    }

    addTravelPoints() {
        const home = new MapIcon(this, 512, 384, 'HOME', 0);
        this.travelPoints.push(home);

        LOCATIONS.forEach((location, index) => {
            const tp = new MapIcon(
                this,
                TRAVEL_POS[index].x,
                TRAVEL_POS[index].y,
                location,
                index + 1
            );
            this.travelPoints.push(tp);
        });
    }

    returnHome() {
        this.character.cleanup();
        //this.stats.cleanup();
        //this.ressurections.cleanup();
        //this.entropy.cleanup();
        this.fortune.cleanup();
        this.shardRing.cleanup();

        this.travelPoints.forEach((tp) => {
            if(tp) {
                tp.cleanup();
            }
        });

        this.scene.start('MainScene');
    }
}
