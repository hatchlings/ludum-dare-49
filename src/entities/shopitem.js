import character from '../model/character';
import eventBus from '../util/eventbus';

export class ShopItem {

    constructor(scene, x, y, name, description, cost, upgrades, filter, quantity) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.name = name;
        this.description = description;
        this.cost = cost;
        this.purchased = false;
        this.filter = filter;

        this.quantity = quantity;
        
        this.upgradeIndex = 0;
        this.upgrades = upgrades;
        
        this.purchasable = character.fortune >= cost;

        this.setupListeners();
        this.createItem();
    }

    createItem() {
        this.nameEntity = this.scene.add.text(this.x, this.y, this.name);
        this.descriptionEntity = this.scene.add.text(250, this.y, this.description);
        this.buyEntity = this.scene.add.text(600, this.y, `BUY FOR ${this.cost} FORTUNE`);

        if(this.filter && this.filter.f()) {
            this.purchasable = false;
            this.buyEntity.text = this.filter.buyText;
            this.buyEntity.setColor("#FF0000");
            return;
        }

        if(!this.purchasable) {
            this.buyEntity.setAlpha(0.3);
        }

        this.buyEntity.setInteractive();
        this.buyEntity.on("pointerup", () => {

            if(this.quantity && this.quantity === "UNLIMITED") {
                this.purchased = false;
                this.purchasable = character.fortune >= this.cost;

                if(this.filter && this.filter.f()) {
                    this.purchasable = false;
                    this.buyEntity.text = this.filter.buyText;
                    this.buyEntity.setColor("#FF0000");
                    return;
                }
            }
            
            if(this.purchasable && !this.purchased) {
                        
                character.removeFortune(this.cost);

                eventBus.emit("game:itemPurchased", this.name);

                this.purchased = true;

                if(this.filter && this.filter.f()) {
                    this.purchasable = false;
                    this.buyEntity.text = this.filter.buyText;
                    this.buyEntity.setColor("#FF0000");
                    return;
                }

                if(this.upgrades && this.upgrades[this.upgradeIndex]) {
                    this.purchased = false;
                    const nextUpgrade = this.upgrades[this.upgradeIndex];

                    this.upgradeIndex++;

                    this.name = nextUpgrade.name;
                    this.description = nextUpgrade.description;
                    this.cost = nextUpgrade.cost;

                    this.purchasable = character.fortune >= this.cost;

                    this.nameEntity.text = this.name;
                    this.descriptionEntity.text = this.description;
                    this.buyEntity.text = `BUY FOR ${this.cost} FORTUNE`;

                    if(!this.purchasable) {
                        this.buyEntity.setAlpha(0.3);
                    }
                } else {
                    if(!this.quantity) {
                        this.buyEntity.setAlpha(0.5);
                        this.buyEntity.setColor("#00FF00");
                    }
                } 
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