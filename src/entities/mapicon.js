import character from '../model/character';
import gameState from '../model/gamestate';
import eventBus from '../util/eventbus';
import { AnimatedText } from './animatedtext';

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

        this.orbitPeriod = 120000;
        this.setupListeners();
        this.addToScene();
    }

    get x() {
        return this.sprite.x;
    }

    get y() {
        return this.sprite.y;
    }

    get playerLocation() {
        return {
            x: this.x + CHARACTER_STAND_OFFSETS[this.type].x,
            y: this.y + CHARACTER_STAND_OFFSETS[this.type].y,
        };
    }

    update() {
        //this.updateOrbs();
        //this.updateIsland();
    }

    startOrbit() {
        if (this.type !== 'HOME') {
            console.log('ORBIT START');
            this.sprite.startFollow({
                duration: this.orbitPeriod,
                yoyo: false,
                repeat: -1,
                rotateToPath: false,
                positionOnPath: true,
                startAt: this.startAt,
            });
            this.orbPool.forEach((orb) => {
                orb.startFollow({
                    duration: this.orbitPeriod,
                    yoyo: false,
                    repeat: -1,
                    rotateToPath: false,
                    positionOnPath: false,
                    startAt: this.startAt,
                });
            });
        }
    }
    resumeOrbit() {
        if (this.type !== 'HOME') {
            this.sprite.resumeFollow();
            this.orbPool.forEach((orb) => {
                orb.resumeFollow();
            });
        }
    }
    pauseOrbit() {
        if (this.type !== 'HOME') {
            this.sprite.pauseFollow();
            this.orbPool.forEach((orb) => {
                orb.pauseFollow();
            });
        }
    }

    setupListeners() {
        this.onStatsUpdated = () => {
            this.statsUpdated();
        };

        this.onTypeHit = () => {
            this.onHit();
        };

        this.onTypeShield = () => {
            this.onShield();
        };

        this.fnPause = this.pauseOrbit.bind(this);
        this.fnResume = this.resumeOrbit.bind(this);

        eventBus.on('game:pauseOrbit', this.fnPause);
        eventBus.on('game:resumeOrbit', this.fnResume);

        eventBus.on(`game:${this.type}Hit`, this.onTypeHit);
        eventBus.on(`game:${this.type}Shield`, this.onTypeShield);
        eventBus.on('game:statsUpdated', this.onStatsUpdated);
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

            this.scene.anims.create({
                key: 'squish',
                frames: 'cat-squish',
                frameRate: 8,
            });

            this.onChaos = () => {
                this.sprite.play('squish');
            };

            eventBus.on('game:chaosHit', this.onChaos);
        } else {
            let startPoint = this.path.getPoint(0);
            this.sprite = this.scene.add.follower(
                this.path,
                startPoint.x,
                startPoint.y,
                `${this.type}-${this.state}`
            );
            this.sprite.setScale(0.5);
            this.scale = 0.5;
        }
        let target = this.sprite;
        this.sprite.pathOffset = new Phaser.Math.Vector2(0, 0);
        if (this.type !== 'HOME') {
            this.createOrbs();
            target = this.sprite.pathOffset;
        }

        this.sprite.setInteractive();

        this.sprite.on('pointerup', this.handleSelect.bind(this));
        this.sprite.on('pointerover', this.hoverOver.bind(this));
        this.sprite.on('pointerout', this.hoverOff.bind(this));

        this.scene.tweens.add({
            targets: target,
            y: Phaser.Math.RND.pick(['-=3', '+=3']),
            duration: Phaser.Math.RND.between(1000, 2000),
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1,
        });
    }

    createOrbs() {
        this.orbPool = [];
        let startPoint = this.path.getPoint(0);
        this.offsets = ORB_OFFSETS[this.type];

        this.offsets.forEach((loc, index) => {
            let orbState = 1;

            if (index === 0) {
                orbState = 3;
            }

            const orb = this.scene.add.follower(
                this.path,
                startPoint.x + loc.x,
                startPoint.y + loc.y,
                `${this.type}-ORB-${orbState}`
            );

            orb.pathOffset = new Phaser.Math.Vector2(0, 0);

            this.scene.tweens.add({
                targets: orb.pathOffset,
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
            eventBus.emit('game:positionChanged', this);
        }
    }

    onHit() {
        this.scene.tweens.add({
            targets: this.sprite,
            x: Phaser.Math.RND.pick(['-=10', '+=10']),
            duration: 50,
            yoyo: true,
            ease: 'Bounce.easeInOut',
            onStart: () => {
                this.sprite.setTint(0xff0000);
            },
            onComplete: () => {
                this.sprite.setTint(0xffffff);
            },
        });
    }

    onShield() {
        const shield = this.scene.add.sprite(this.sprite.x, this.sprite.y, "shield");
        shield.setScale(0.45);

        new AnimatedText(
            this.scene,
            this.sprite.x - 40,
            this.sprite.y,
            `Blocked!`,
            { fontFamily: 'Amatic SC', fontSize: 50, stroke: '#000', strokeThickness: 6 },
            { y: '-=10', duration: 1500, alpha: 0 }
        );

        this.scene.tweens.add({
            targets: shield,
            duration: 1500,
            alpha: 0,
            onComplete: () => {
                shield.destroy();
            }
        });
    }

    calculateState() {
        const stat = character.stats[this.type];
        let newState = this.state;

        if (stat <= 0) {
            setTimeout(() => {
                this.scene.tweens.add({
                    targets: this.orbPool.concat([this.sprite]),
                    alpha: 0,
                    duration: 250,
                });
            }, 1000);
        }

        if (stat < 4) {
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
        if (this.onChaos) {
            eventBus.off('game:chaosHit', this.onChaos);
        }

        eventBus.off('game:pauseOrbit', this.fnPause);
        eventBus.off('game:resumeOrbit', this.fnResume);
        eventBus.off(`game:${this.type}Shield`, this.onTypeShield);
        eventBus.off(`game:${this.type}Hit`, this.onTypeHit);
        eventBus.off('game:statsUpdated', this.onStatsUpdated);
        eventBus.off('game:statsUpdated', this.onStatsUpdated);
    }
}
