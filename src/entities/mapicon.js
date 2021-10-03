import character from '../model/character';
import gameState from '../model/gamestate';
import eventBus from '../util/eventbus';

const CHARACTER_STAND_OFFSETS = {
    "EARTH": {x: 60, y: 50},
    "WATER": {x: 100, y: 0},
    "AIR": {x: -100, y: 0},
    "FIRE": {x: -60, y: -50},
    "HOME": {x: 0, y: 0}
}

export class MapIcon {

    constructor(scene, x, y, type, mapPosition) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.type = type;
        this.mapPosition = mapPosition;
        this.state = 1;

        this.setupListeners();
        this.addToScene();
    }

    setupListeners() {
        this.onStatsUpdated = () => {
            this.statsUpdated();
        };

        eventBus.on("game:statsUpdated", this.onStatsUpdated);

    }

    statsUpdated() {
        if(this.type !== "HOME") {
            const newState = this.calculateState();
            if(newState !== this.state) {
                this.state = newState;
                this.scene.tweens.add({
                    targets: this.sprite,
                    duration: 500,
                    scale: 0,
                    yoyo: true,
                    ease: "Bounce.inOut",
                    onYoyo: () => {
                        this.sprite.setTexture(`${this.type}-${this.state}`);
                    }
                });
            }
        }
    }

    addToScene() {
        this.sprite = this.scene.add.sprite(this.x, this.y, `${this.type}-${this.state}`);
        this.sprite.setScale(0.5);

        this.sprite.setInteractive();
        this.sprite.on('pointerup', this.handleSelect.bind(this));

        this.scene.tweens.add({
            targets: this.sprite,
            y: "-=3",
            duration: 1000,
            ease: "Sine.easeInOut",
            yoyo: true,
            repeat: -1
        });

    }

    handleSelect() {
        if(!gameState.blockingMapInput && character.mapPosition !== this.mapPosition) {
            eventBus.emit("game:blockInput");
            eventBus.emit(
                "game:positionChanged",
                this.mapPosition,
                {
                    x: this.x + CHARACTER_STAND_OFFSETS[this.type].x, 
                    y: this.y + CHARACTER_STAND_OFFSETS[this.type].y  
                },
                this.type
            );
        }
    }

    calculateState() {
        const stat = character.stats[this.type];
        let newState = this.state;

        if(stat <= 2) {
            newState = 1;
        } else if(stat <= 4) {
            newState = 2;
        } else if(stat <= 6) {
            newState = 3;
        } else if(stat <= 8) {
            newState = 4;
        } else if(stat >= 10) {
            newState = 5;
        }

        return newState;
    }

    cleanup() {
        eventBus.off("game:statsUpdated", this.onStatsUpdated);
    }

}