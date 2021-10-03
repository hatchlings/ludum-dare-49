import character from '../model/character';
import eventBus from '../util/eventbus';
import { ShopItem } from './shopitem';

const SHOP_ITEMS = [
    {
        name: "Improved Staff", 
        description: "Your staff fails less", 
        cost: 3,
        upgrades: [
            {name: "Advanced Staff", description: "Your staff fails even less", cost: 5}
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
        filter: {
            f: () => {
                return character.entropyCapacity <= character.minimumEntropyCapacity;
            },
            buyText: "UNAVAILABLE"
        }
    }
]

export class Shop {

    constructor(scene) {
        this.scene = scene;

        this.setupListeners();
        this.showItems();
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
                character.setStaffStats([-1, 0, 0, 0, 1], name);
                break;
            case "Shield":
                character.setShieldDurability(1);
                break;
            case "Advanced Shield":
                character.setShieldDurability(5);
                break;
            case "Decrease Entropy":
                character.updateEntropyPool(-1)
                break;
        }
    }

    showItems() {
        SHOP_ITEMS.forEach((item, index) => {
            new ShopItem(this.scene, 20, 100 + (50 * index), item.name, item.description, item.cost, item.upgrades, item.filter);
        });
    }

    cleanup() {
        eventBus.off("game:itemPurchased", this.onItemPurchased);
    }

}