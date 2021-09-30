import eventBus from "../util/eventbus";

export class Egg {

    constructor(scene, x, y) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.addToScene();
    }

    addToScene() {
        this.sprite = this.scene.add.sprite(this.x, this.y, "darkblue");
        
        this.scene.tweens.add({
            targets: this.sprite,
            duration: 1000,
            scale: 1.5,
            yoyo: true,
            ease: "Bounce.inOut",
            repeat: -1,
            onRepeat: () => {
                eventBus.emit("game:egg");
            }
        });
    }

}