import character from '../model/character';
import eventBus from '../util/eventbus';

export class ShopItem {

    constructor(scene, x, y, name, description, cost) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.name = name;
        this.description = description;
        this.cost = cost;
        this.purchased = false;
        this.purchasable = character.fortune >= cost;

        this.setupListeners();
        this.createItem();
    }

    createItem() {
        this.nameEntity = this.scene.add.text(this.x, this.y, this.name);
        this.descriptionEntity = this.scene.add.text(250, this.y, this.description);
        this.buyEntity = this.scene.add.text(600, this.y, `BUY FOR ${this.cost} FORTUNE`);

        if(!this.purchasable) {
            this.buyEntity.setAlpha(0.3);
        }

        this.buyEntity.setInteractive();
        this.buyEntity.on("pointerup", () => {
            if(this.purchasable && !this.purchased) {
                this.purchased = true;
                character.removeFortune(this.cost);
                
                this.buyEntity.setAlpha(0.5);
                this.buyEntity.setColor("#00FF00");

                eventBus.emit("game:itemPurchased", this.name);
            } else {
                console.log("Nope!");
            }
        });
    }

    setupListeners() {

        this.onFortuneUpdated = () => {
            this.purchasable = character.fortune >= this.cost;
            if(!this.purchasable && !this.purchased) {
                this.buyEntity.setAlpha(0.3);
            }
        };

        eventBus.on("game:fortuneUpdated", this.onFortuneUpdated)
    }

    cleanup() {
        eventBus.off("game:fortuneUpdated", this.onFortuneUpdated);
    }

}