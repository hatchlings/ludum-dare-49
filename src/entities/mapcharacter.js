import eventBus from '../util/eventbus';

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

        eventBus.on("game:positionChanged", this.onPositionChanged);
    }

    addToScene() {
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
        eventBus.off("game:positionChanged", this.onPositionChanged);
    }

}