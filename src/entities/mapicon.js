
export class MapIcon {

    constructor(scene, x, y, type) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.type = type;

        this.addToScene();
    }

    addToScene() {
        this.sprite = this.scene.add.sprite(this.x, this.y, "darkblue");
        
        this.sprite.setInteractive();
        this.sprite.on('pointerup', this.handleSelect.bind(this));
    }

    handleSelect() {
        console.log("clicked!");
    }

}