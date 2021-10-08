import audioManager from '../managers/audiomanager';
import eventBus from '../util/eventbus';
import { AnimatedText } from './animatedtext';

export class MapCharacter {
    constructor(scene, x, y) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.location;
        this.moving = false;
        this.locationChange = false;
        this.tween = undefined;

        this.setupListeners();
        this.addToScene();
    }

    update() {
        if (this.location && !this.moving && !this.locationChange) {
            if (this.location.playerLocation.x !== this.x) {
                this.moveTo(this.location.playerLocation.x, this.location.playerLocation.y, 10);
            }
        }
    }

    setupListeners() {
        this.onPositionChanged = (location) => {
            this.location = location;
            this.locationChange = true;
            this.moveTo(location.playerLocation.x, location.playerLocation.y, 750);
        };

        this.onStaffSuccess = (quantity) => {
            this.sprite.play('good-staff');

            if (quantity > 1) {
                audioManager.play(this.scene, 'large-stat-increase');
            } else {
                audioManager.play(this.scene, 'small-stat-increase');
            }

            new AnimatedText(
                this.scene,
                this.sprite.x,
                this.sprite.y,
                `Success! +${quantity}`,
                { fontFamily: 'Amatic SC', fontSize: 50, stroke: '#000', strokeThickness: 6 },
                { y: '-=10', duration: 1500, alpha: 0 }
            );
        };

        this.onStaffFailure = () => {
            this.sprite.play('bad-staff');
            audioManager.play(this.scene, 'whiff');
            new AnimatedText(
                this.scene,
                this.sprite.x,
                this.sprite.y,
                'Staff failed!',
                { fontFamily: 'Amatic SC', fontSize: 50, stroke: '#000', strokeThickness: 6 },
                { y: '-=10', duration: 1000, alpha: 0 }
            );
        };

        eventBus.on('game:staffSuccess', this.onStaffSuccess);
        eventBus.on('game:staffFailure', this.onStaffFailure);
        eventBus.on('game:positionChanged', this.onPositionChanged);
    }

    addToScene() {
        this.scene.anims.create({
            key: 'good-staff',
            frames: 'character-good-staff',
            frameRate: 18,
        });

        this.scene.anims.create({
            key: 'bad-staff',
            frames: 'character-bad-staff',
            frameRate: 18,
        });

        this.sprite = this.scene.add.follower(this.path, this.x, this.y, 'character');
        this.sprite.setScale(0.33);
    }

    moveTo(x, y, duration = 1000) {
        if (this.sprite.x < x) {
            this.sprite.flipX = false;
        } else if (this.sprite.x > x) {
            this.sprite.flipX = true;
        }
        if (this.tween) this.tween.stop();
        this.tween = this.scene.tweens.add({
            targets: this.sprite,
            duration: duration,
            x: x,
            y: y,
            ease: 'Sine.easeInOut',
            onStart: () => {
                this.moving = true;
            },
            onComplete: () => {
                if (this.locationChange) {
                    this.locationChange = false;
                    eventBus.emit('game:turnEnded');
                }
                this.moving = false;
            },
        });
    }

    cleanup() {
        eventBus.off('game:staffSuccess', this.onStaffSuccess);
        eventBus.off('game:staffFailure', this.onStaffFailure);
        eventBus.off('game:positionChanged', this.onPositionChanged);
    }
}
