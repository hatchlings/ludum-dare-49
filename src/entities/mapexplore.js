export class MapExplore {

    constructor(scene) {
        this.scene = scene;
        this.createIcon();
    }

    createIcon() {
        this.icon = this.scene.add.text(260, 450, "GO TO MAP", {fontSize: 48});
        this.icon.setInteractive();
        this.icon.on('pointerup', () => {
            this.scene.goToMap();
        });
    }

}