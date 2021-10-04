import audioManager from '../managers/audiomanager';
import eventBus from '../util/eventbus';
import { AnimatedText } from './animatedtext';

export class MapCharacter {

    constructor(scene, x, y) {
        this.scene = scene;
        this.x = x;
        this.y = y;

        this.setupListeners();
        this.addToScene();
    }

    setupListeners() {

        this.onPositionChanged = (_pos, data) => {
            this.moveTo(data.x, data.y);
        };

        this.onStaffSuccess = (quantity) => {
            this.sprite.play("good-staff");

            if(quantity > 1) {
                audioManager.play(this.scene, "large-stat-increase");
            } else {
                audioManager.play(this.scene, "small-stat-increase");
            }

            new AnimatedText(
                this.scene,
                this.sprite.x,
                this.sprite.y,
                `Success! +${quantity}`,
                {fontFamily: "Amatic SC", fontSize: 50, stroke: "#000", strokeThickness: 6},
                {y: "-=10", duration: 1500, alpha: 0}
            );
        }

        this.onStaffFailure = () => {
            this.sprite.play("bad-staff");
            new AnimatedText(
                this.scene,
                this.sprite.x,
                this.sprite.y,
                "Staff failed!",
                {fontFamily: "Amatic SC", fontSize: 50, stroke: "#000", strokeThickness: 6},
                {y: "-=10", duration: 1000, alpha: 0}
            );
        }

        eventBus.on("game:staffSuccess", this.onStaffSuccess);
        eventBus.on("game:staffFailure", this.onStaffFailure);
        eventBus.on("game:positionChanged", this.onPositionChanged);
    }

    addToScene() {

        this.scene.anims.create({
            key: "good-staff",
            frames: "character-good-staff",
            frameRate: 18
        });


        this.scene.anims.create({
            key: "bad-staff",
            frames: "character-bad-staff",
            frameRate: 18
        });

        this.sprite = this.scene.add.sprite(this.x, this.y, "character");
        this.sprite.setScale(0.33);
    }

    moveTo(x, y) {
        
        if(this.sprite.x < x) {
            this.sprite.flipX = false;
        } else if(this.sprite.x > x) {
            this.sprite.flipX = true;
        }

        this.scene.tweens.add({
            targets: this.sprite,
            duration: 1000,
            x: x,
            y: y,
            ease: "Sine.easeInOut",
            onComplete: () => {
                eventBus.emit("game:turnEnded");
            }
        });
    }

    cleanup() {
        eventBus.off("game:staffSuccess", this.onStaffSuccess);
        eventBus.off("game:staffFailure", this.onStaffFailure);
        eventBus.off("game:positionChanged", this.onPositionChanged);
    }

}