import character from '../model/character';
import eventBus from '../util/eventbus';
import { ShopEntropy } from './shopentropy';
import { ShopFortune } from './shopfortune';
import { ShopItem } from './shopitem';

const SHOP_ITEMS = [
    {
        name: "Improved Staff",
        description: "Your staff fails less",
        cost: 3,
        upgrades: [
            {name: "Advanced Staff", description: "Your staff fails even less", cost: 5},
            {name: "Superior Staff", description: "Your staff never fails", cost: 8}
        ]
    },
    {
        name: "Shield",
        description: "Block Chaos hits",
        cost: 1,
        upgrades: [
            {name: "Advanced Shield", description: "Block even more Chaos hits", cost: 5}
        ]
    },
    {
        name: "Decrease Entropy",
        description: "Entropy pool is decreased by one",
        cost: 1,
        quantity: "UNLIMITED",
        filter: {
            f: () => {
                return character.entropyCapacity <= character.minimumEntropyCapacity;
            },
            buyText: " N/A"
        }
    }
];

export class Shop {

    constructor(scene) {
        this.scene = scene;

        this.setupUI();
        this.setupListeners();
        this.showItems();
    }

    setupUI() {
        this.panel = this.scene.add.sprite(1024 / 2, 768 / 2, "shop");

        this.shopFortune = new ShopFortune(this.scene, 410, 455);
        this.shopEntropy = new ShopEntropy(this.scene, 695, 455);

        this.ghostButton = this.scene.add.sprite(535, 555, "buttonpressed");
        this.ghostButton.setVisible(false);

        this.play = this.scene.add.text(1024 / 2 - 28, 535, "P   L   A   Y", {
            fontFamily: "Amatic SC",
            fontSize: 36,
            stroke: "#000",
            strokeThickness: 6
        });

        const cat = this.scene.add.sprite(850, 560, "cat");

        this.scene.anims.create({
            key: "squish-repeat",
            frames: "cat-squish",
            frameRate: 6,
            repeat: -1
        });

        cat.setScale(0.75);
        cat.play("squish-repeat");

        this.scene.add.sprite(850, 615, "coinpile");
        
        this.play.setInteractive({ useHandCursor: true });
        
        this.play.on('pointerover', () => {
            this.ghostButton.setVisible(true);
        });
  
        this.play.on('pointerout', () => {
            this.ghostButton.setVisible(false);
        });
  
        this.play.on('pointerup', () => {
            this.scene.goToMap();
        });
        
    }

    setupListeners() {
        this.onItemPurchased = (name) => {
            this.itemPurchased(name);
        };

        eventBus.on("game:itemPurchased", this.onItemPurchased);
    }

    itemPurchased(name) {
        switch(name) {
            case "Improved Staff":
                character.setStaffStats([-1, 0, 0, 1], name);
                break;
            case "Advanced Staff":
                character.setStaffStats([-1, 0, 1, 2], name);
                break;
            case "Superior Staff":
                character.setStaffStats([0,0,1,1,2,3,4], name);
                break;
            case "Shield":
                character.setShieldDurability(1);
                break;
            case "Advanced Shield":
                character.setShieldDurability(5);
                break;
            case "Decrease Entropy":
                character.updateEntropyPool(-1);
                break;
        }
    }

    showItems() {
        SHOP_ITEMS.forEach((item, index) => {
            new ShopItem(this.scene, 150, 150 + (75 * index), item.name, item.description, item.cost, item.upgrades, item.filter, item.quantity);
        });
    }

    cleanup() {
        this.shopFortune.cleanup();
        this.shopEntropy.cleanup();
        eventBus.off("game:itemPurchased", this.onItemPurchased);
    }

}
