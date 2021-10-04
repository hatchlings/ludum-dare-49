import character from '../model/character';
import gameState from '../model/gamestate';
import eventBus from '../util/eventbus';

const CHARACTER_STAND_OFFSETS = {
    EARTH: { x: 60, y: 70 },
    WATER: { x: 100, y: 0 },
    AIR: { x: -100, y: 0 },
    FIRE: { x: -60, y: -50 },
    HOME: { x: 0, y: 0 },
};

const ORB_OFFSETS = {
    EARTH: [
        { x: 0, y: -20 },
        { x: 120, y: 0 },
        { x: 130, y: 40 },
        { x: 0, y: 100 },
        { x: -100, y: 20 },
    ],
    WATER: [
        { x: -80, y: -30 },
        { x: -100, y: 10 },
        { x: -105, y: 55 },
        { x: 0, y: 100 },
        { x: 40, y: 80 },
    ],
    AIR: [
        { x: 60, y: -30 },
        { x: 80, y: 10 },
        { x: 85, y: 55 },
        { x: 0, y: 100 },
        { x: 40, y: 110 },
    ],
    FIRE: [
        { x: 60, y: -20 },
        { x: -10, y: 100 },
        { x: 70, y: 40 },
        { x: 50, y: 90 },
        { x: -50, y: 55 },
    ],
};

export class MapIcon {
    constructor(scene, x, y, type, path, startAt) {
        this.scene = scene;
        this._x = x;
        this._y = y;
        this.startAt = startAt;
        this.type = type;
        this.path = path;
        this.state = 1;
        this.scale = 1.0;

        this.setupListeners();
        this.addToScene();
    }

    get x() {
        return this.sprite.x;
    }

    get y() {
        return this.sprite.y;
    }

    update() {
        //nothing yet...
    }

    startOrbit() {
        if (this.type !== 'HOME') {
            this.sprite.startFollow({
                duration: 60000,
                yoyo: false,
                repeat: -1,
                rotateToPath: false,
                positionOnPath: true,
                startAt: this.startAt,
            });
        }
    }
    resumeOrbit() {
        if (this.type !== 'HOME') this.sprite.resumeFollow();
    }
    pauseOrbit() {
        if (this.type !== 'HOME') this.sprite.pauseFollow();
    }

    setupListeners() {
        this.onStatsUpdated = () => {
            this.statsUpdated();
        };

        this.onTypeHit = () => {
            this.onHit();
        };

        this.fnPause = this.pauseOrbit.bind(this);
        this.fnResume = this.resumeOrbit.bind(this);

        eventBus.on('game:pauseOrbit', this.fnPause);
        eventBus.on('game:resumeOrbit', this.fnResume);

        eventBus.on(`game:${this.type}Hit`, this.onTypeHit);
        eventBus.on("game:statsUpdated", this.onStatsUpdated);
    }

    statsUpdated() {
        if (this.type !== 'HOME') {
            const newState = this.calculateState();
            if (newState !== this.state) {
                this.state = newState;
                this.scene.tweens.add({
                    targets: this.sprite,
                    duration: 250,
                    scale: 0,
                    yoyo: true,
                    ease: 'Bounce.inOut',
                    onYoyo: () => {
                        this.sprite.setTexture(`${this.type}-${this.state}`);
                    },
                });
            }
        }
    }

    addToScene() {
        if (this.type === 'HOME') {
            this.sprite = this.scene.add.sprite(this._x, this._y, 'cat');
            this.sprite.setScale(0.75);
            this.scale = 0.75;
        } else {
            let startPoint = this.path.getPoint(this.startAt);
            this.sprite = this.scene.add.follower(
                this.path,
                startPoint.x,
                startPoint.y,
                `${this.type}-${this.state}`
            );
            this.sprite.setScale(0.5);
            this.scale = 0.5;
        }

        if (this.type !== 'HOME') {
            this.createOrbs();
        }

        this.sprite.setInteractive();

        this.sprite.on('pointerup', this.handleSelect.bind(this));
        this.sprite.on('pointerover', this.hoverOver.bind(this));
        this.sprite.on('pointerout', this.hoverOff.bind(this));

        this.scene.tweens.add({
            targets: this.sprite,
            y: '-=3',
            duration: 1000,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1,
        });
    }

    createOrbs() {
        this.orbPool = [];

        const locs = ORB_OFFSETS[this.type];

        locs.forEach((loc, index) => {
            let orbState = 1;

            if (index === 0) {
                orbState = 3;
            }

            const orb = this.scene.add.sprite(
                this.sprite.x + loc.x,
                this.sprite.y + loc.y,
                `${this.type}-ORB-${orbState}`
            );

            this.scene.tweens.add({
                targets: orb,
                y: Phaser.Math.RND.pick(['-=2', '+=2', '-=3', '+=3']),
                yoyo: true,
                duration: Phaser.Math.RND.pick([1500, 2000, 2500]),
                repeat: -1,
                ease: 'Sine.easeInOut',
            });

            this.scene.tweens.add({
                targets: orb,
                angle: 360,
                duration: 20000,
                repeat: -1,
            });

            this.orbPool.push(orb);
        });
    }

    hoverOver() {
        if (!gameState.blockingMapInput && character.mapPositionName !== this.type) {
            eventBus.emit('game:pauseOrbit');
            this.sprite.scale = this.scale + 0.05;
        }
    }

    hoverOff() {
        if (!gameState.blockingMapInput && character.mapPositionName !== this.type) {
            eventBus.emit('game:resumeOrbit');
            this.sprite.scale = this.scale - 0.05;
        }
    }

    handleSelect() {
        if (!gameState.blockingMapInput && character.mapPositionName !== this.type) {
            eventBus.emit('game:pauseOrbit');
            eventBus.emit('game:blockInput');
            this.sprite.scale = this.scale - 0.05;
            eventBus.emit('game:positionChanged', this.type, {
                x: this.x + CHARACTER_STAND_OFFSETS[this.type].x,
                y: this.y + CHARACTER_STAND_OFFSETS[this.type].y,
            });
        }
    }

    onHit() {
        console.log("here??");
        this.scene.tweens.add({
            targets: this.sprite,
            x: Phaser.Math.RND.pick(["-=10", "+=10"]),
            duration: 50,
            yoyo: true,
            ease: 'Bounce.easeInOut',
            onStart: () => { this.sprite.setTint(0xff0000); }, 
            onComplete: () => { this.sprite.setTint(0xffffff); }
        })
    }

    calculateState() {
        const stat = character.stats[this.type];
        let newState = this.state;

        if(stat <= 0) {
            setTimeout(() => {
                this.scene.tweens.add({
                    targets: this.orbPool.concat([this.sprite]),
                    alpha: 0,
                    duration: 250
                });
            }, 1000);
        }

        if(stat < 4) {
            newState = 1;
        } else if (stat >= 4 && stat < 6) {
            newState = 2;
        } else if (stat >= 6 && stat < 8) {
            newState = 3;
        } else if (stat >= 8 && stat < 10) {
            newState = 4;
        } else if (stat >= 10) {
            newState = 5;
        }

        const orbA = this.orbPool[0];
        const orbB = this.orbPool[1];
        const orbC = this.orbPool[2];
        const orbD = this.orbPool[3];
        const orbE = this.orbPool[4];

        if (stat === 0) {
            this.orbPool.forEach((orb) => {
                orb.setTexture(`${this.type}-ORB-1`);
            });
        } else if (stat === 1) {
            orbA.setTexture(`${this.type}-ORB-2`);
            orbB.setTexture(`${this.type}-ORB-1`);
            orbC.setTexture(`${this.type}-ORB-1`);
            orbD.setTexture(`${this.type}-ORB-1`);
            orbE.setTexture(`${this.type}-ORB-1`);
        } else if (stat === 2) {
            orbA.setTexture(`${this.type}-ORB-3`);
            orbB.setTexture(`${this.type}-ORB-1`);
            orbC.setTexture(`${this.type}-ORB-1`);
            orbD.setTexture(`${this.type}-ORB-1`);
            orbE.setTexture(`${this.type}-ORB-1`);
        } else if (stat === 3) {
            orbA.setTexture(`${this.type}-ORB-3`);
            orbB.setTexture(`${this.type}-ORB-2`);
            orbC.setTexture(`${this.type}-ORB-1`);
            orbD.setTexture(`${this.type}-ORB-1`);
            orbE.setTexture(`${this.type}-ORB-1`);
        } else if (stat === 4) {
            orbA.setTexture(`${this.type}-ORB-3`);
            orbB.setTexture(`${this.type}-ORB-3`);
            orbC.setTexture(`${this.type}-ORB-1`);
            orbD.setTexture(`${this.type}-ORB-1`);
            orbE.setTexture(`${this.type}-ORB-1`);
        } else if (stat === 5) {
            orbA.setTexture(`${this.type}-ORB-3`);
            orbB.setTexture(`${this.type}-ORB-3`);
            orbC.setTexture(`${this.type}-ORB-2`);
            orbD.setTexture(`${this.type}-ORB-1`);
            orbE.setTexture(`${this.type}-ORB-1`);
        } else if (stat === 6) {
            orbA.setTexture(`${this.type}-ORB-3`);
            orbB.setTexture(`${this.type}-ORB-3`);
            orbC.setTexture(`${this.type}-ORB-3`);
            orbD.setTexture(`${this.type}-ORB-1`);
            orbE.setTexture(`${this.type}-ORB-1`);
        } else if (stat === 7) {
            orbA.setTexture(`${this.type}-ORB-3`);
            orbB.setTexture(`${this.type}-ORB-3`);
            orbC.setTexture(`${this.type}-ORB-3`);
            orbD.setTexture(`${this.type}-ORB-2`);
            orbE.setTexture(`${this.type}-ORB-1`);
        } else if (stat === 8) {
            orbA.setTexture(`${this.type}-ORB-3`);
            orbB.setTexture(`${this.type}-ORB-3`);
            orbC.setTexture(`${this.type}-ORB-3`);
            orbD.setTexture(`${this.type}-ORB-3`);
            orbE.setTexture(`${this.type}-ORB-1`);
        } else if (stat === 9) {
            orbA.setTexture(`${this.type}-ORB-3`);
            orbB.setTexture(`${this.type}-ORB-3`);
            orbC.setTexture(`${this.type}-ORB-3`);
            orbD.setTexture(`${this.type}-ORB-3`);
            orbE.setTexture(`${this.type}-ORB-2`);
        } else if (stat === 10) {
            this.orbPool.forEach((orb) => {
                orb.setTexture(`${this.type}-ORB-3`);
            });
        }

        return newState;
    }

    cleanup() {
        eventBus.off('game:pauseOrbit', this.fnPause);
        eventBus.off('game:resumeOrbit', this.fnResume);
        eventBus.off(`game:${this.type}Hit`, this.onTypeHit);
        eventBus.off("game:statsUpdated", this.onStatsUpdated);
        eventBus.off('game:statsUpdated', this.onStatsUpdated);
    }
}
