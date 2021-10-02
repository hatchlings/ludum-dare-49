import eventBus from '../util/eventbus';

class GameState {

    constructor() {
        this.blockingMapInput = false;
        this.setupListeners();
    }

    setupListeners() {
        eventBus.on("game:blockInput", () => {
            this.blockingMapInput = true;
        });

        eventBus.on("game:enableInput", () => {
            this.blockingMapInput = false;
        });
    }

}

let gameState = new GameState();
export default gameState;