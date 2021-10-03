import character from '../model/character';
import gameState from '../model/gamestate';
import eventBus from '../util/eventbus';

export class MapIcon {

    constructor(scene, x, y, type, mapPosition) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.type = type;
        this.mapPosition = mapPosition;
        this.state = 1;

        
        this.addToScene();
    }

    addToScene() {
        this.sprite = this.scene.add.sprite(this.x, this.y, "darkblue");
        this.sprite.setScale(0.5);

        this.sprite.setInteractive();
        this.sprite.on('pointerup', this.handleSelect.bind(this));

        this.scene.add.text(this.x - 20, this.y, this.type);
    }

    handleSelect() {
        if(!gameState.blockingMapInput && character.mapPosition !== this.mapPosition) {
            eventBus.emit("game:blockInput");
            eventBus.emit(
                "game:positionChanged",
                this.mapPosition,
                { x: this.x, y: this.y },
                this.type
            );
        }
    }

    calculateState() {

    }

}