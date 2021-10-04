import audioManager from '../managers/audiomanager';
import eventBus from '../util/eventbus';

const ROLL_TEXTURES = [
    "fishbone",
    "egg",
    "eye",
    "shardroll"
]

const MISS_ROLL = [
    "fishbone",
    "egg",
    "eye"
]

const HIT_ROLL = "shardroll";

export class Roll {

    constructor(scene) {
        this.scene = scene;

        this.setupListeners();
        this.addRoller();
        this.rollIndex = 0;
    }

    setupListeners() {
       
        this.onChaosSpin = () => {
            audioManager.play(this.scene, "chaosroll");
            this.roll.setVisible(true);
            this.slot.paused = false;
        };

        this.onChaosMiss = () => {
            this.slot.paused = true;
            this.roll.setTexture(Phaser.Math.RND.pick(MISS_ROLL));
            this.selectTween();
        }

        this.onChaosHit = () => {
            audioManager.play(this.scene, "chaoshits");
            this.slot.paused = true;
            this.roll.setTexture(HIT_ROLL);
            this.selectTween();
        }

        this.onChaosHome = () => {
            console.log("here");
            audioManager.play(this.scene, "chits");
        }

        eventBus.on("game:chaosSpin", this.onChaosSpin);
        eventBus.on("game:chaosMiss", this.onChaosMiss);
        eventBus.on("game:chaosHit", this.onChaosHit);
        eventBus.on("game:chaosHome", this.onChaosHome);
    }

    selectTween() {
        this.scene.tweens.add({
            targets: this.roll,
            scale: "+=0.2",
            duration: 200,
            yoyo: true,
            ease: "Bounce.inOut",
            onComplete: () => {
                setTimeout(() => {
                    this.roll.setVisible(false);
                }, 750);
            }
        });
    }

    addRoller() {
        this.roll = this.scene.add.sprite(1024/2 + 2, 768/2 , ROLL_TEXTURES[0]);
        this.roll.setVisible(false);
        this.roll.setScale(0.8);
        this.spin();
    }

    spin() {
        this.slot = this.scene.time.addEvent({
            delay: 100,
            loop: true,
            callback: () => {
                this.roll.setTexture(ROLL_TEXTURES[this.rollIndex % ROLL_TEXTURES.length]);
                this.rollIndex++;
            },
            paused: true
        });
    }

    cleanup() {
        eventBus.off("game:chaosSpin", this.onChaosSpin);
        eventBus.off("game:chaosMiss", this.onChaosMiss);
        eventBus.off("game:chaosHit", this.onChaosHit);
        eventBus.off("game:chaosHome", this.onChaosHome);
    }

}