export class MapExplore {

    constructor(scene) {
        this.scene = scene;
        this.createIcon();
    }

    createIcon() {
        this.icon = this.scene.add.text(425, 450, "GO TO MAP", {fontSize: 48, fontFamily: "Amatic SC"});
        this.icon.setInteractive();
        this.icon.on('pointerup', () => {
            this.scene.goToMap();
        });
    }

}