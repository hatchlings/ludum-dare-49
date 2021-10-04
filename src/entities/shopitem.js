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
        this.nameEntity = this.scene.add.text(this.x + 100, this.y + 50, this.name, {fontFamily: "Amatic SC", fontSize: 32, stroke: "#000", strokeThickness: 6});
        this.descriptionEntity = this.scene.add.text(360, this.y + 85, this.description, {fontFamily: "Amatic SC", fontSize: 22, stroke: "#000", strokeThickness: 6});
        this.buyEntity = this.scene.add.text(640, this.y + 45, `${this.cost}`, {fontFamily: "Amatic SC", fontSize: 42, stroke: "#000", strokeThickness: 6});
        

        this.ghostButton = this.scene.add.sprite(790, this.y + 70, "smallbuttonpressed");
        this.ghostButton.setVisible(false);

        this.newBuyEntity = this.scene.add.text(770, this.y + 51, "B U Y", {fontFamily: "Amatic SC", fontSize: 32, stroke: "#000", strokeThickness: 6});
        
        // this.fortuneIcon = this.scene.add.sprite(835, this.y + 10, "fortunecoin");
        // this.fortuneIcon.setScale(0.20);

        if(this.filter && this.filter.f()) {
            this.purchasable = false;
            this.newBuyEntity.text = this.filter.buyText;
            this.newBuyEntity.setColor("#FF0000");
            return;
        }

        if(!this.purchasable) {
           this.newBuyEntity.setAlpha(0.3);
        }

        this.newBuyEntity.setInteractive({ useHandCursor: true });

        this.newBuyEntity.on("pointerover", () => {
            if(this.purchasable && !this.purchased) {
                this.ghostButton.setVisible(true);
            }
        });

        this.newBuyEntity.on("pointerout", () => {
                this.ghostButton.setVisible(false);
        })

        this.newBuyEntity.on("pointerup", () => {

            if(this.quantity && this.quantity === "UNLIMITED") {
                this.purchased = false;
                this.purchasable = character.fortune >= this.cost;

                if(this.filter && this.filter.f()) {
                    this.purchasable = false;
                    this.newBuyEntity.text = this.filter.buyText;
                    this.newBuyEntity.setColor("#FF0000");
                    this.ghostButton.setVisible(false);
                    return;
                }
            }
            
            if(this.purchasable && !this.purchased) {
                        
                character.removeFortune(this.cost);

                eventBus.emit("game:itemPurchased", this.name);

                this.purchased = true;

                if(this.filter && this.filter.f()) {
                    this.purchasable = false;
                    this.newBuyEntity.text = this.filter.buyText;
                    this.newBuyEntity.setColor("#FF0000");
                    this.ghostButton.setVisible(false);
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
                    this.buyEntity.text = `${this.cost}`;

                    if(!this.purchasable) {
                        this.newBuyEntity.setAlpha(0.3);
                        this.ghostButton.setVisible(false);
                    }
                } else {
                    if(!this.quantity) {
                        //this.newBuyEntity.setAlpha(0.5);
                        this.buyEntity.setColor("#00FF00");
                        this.newBuyEntity.setColor("#00FF00");
                        this.newBuyEntity.text = "M A X"
                        this.ghostButton.setVisible(false);
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
                this.ghostButton.setVisible(false);
                this.newBuyEntity.setAlpha(0.3);
            }
        };

        eventBus.on("game:fortuneUpdated", this.onFortuneUpdated)
    }

    cleanup() {
        eventBus.off("game:fortuneUpdated", this.onFortuneUpdated);
    }

}