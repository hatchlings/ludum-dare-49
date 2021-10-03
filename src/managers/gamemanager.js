import character, { STAT_TYPES } from '../model/character';
import eventBus from '../util/eventbus';
import { animationTimeout } from '../util/timing';

// Wait times for various Animations
const APPLY_ENTROPY_WAIT = 500;
const DEATH_WAIT = 100;
const RESET_ENTROPY_WAIT = 500;
const APPLY_CHAOS_WAIT = 500;
const ROLL_CHAOS_WAIT = 500;

class GameManager {
    constructor() {
        this.setupListeners();
    }

    setScene(scene) {
        this.mapScene = scene;
    }

    setupListeners() {
        eventBus.on('game:positionChanged', this.positionChanged.bind(this));
        eventBus.on('game:turnEnded', this.processTurn.bind(this));
    }

    positionChanged(pos, _data, name) {
        character.applyPositionChange(pos, _data, name);
        console.log(
            `Position changed. Now located at ${name}, entropy is now ${character.entropy}.`
        );
    }

    runHomeActions() {
        animationTimeout(APPLY_ENTROPY_WAIT, undefined, () => {
            this.applyEntropy();
        })
            .then(() => {
                if (character.isDead) {
                    return this.handleDeath().then(() => {
                        return false;
                    });
                }
                return true;
            })
            .then((isAlive) => {
                if (isAlive) {
                    return animationTimeout(RESET_ENTROPY_WAIT, undefined, () => {
                        character.resetCurrentEntropy();
                    });
                }
            })
            .then(() => {
                eventBus.emit('game:enableInput');
            });
    }

    runTravelActions() {
        this.applyStatBonus()
            .then(() => {
                if (character.entropy === character.entropyCapacity) {
                    return this.applyChaos();
                } else {
                    return this.rollForChaos();
                }
            })
            .then(() => {
                /* This is firing off BEFORE rollForChaos is complete */
                /* Hacked in this temp solution. */

                return new Promise((resolve) => {
                    setTimeout(() => {
                        if (character.isDead) {
                            resolve(this.handleDeath());
                        } else {
                            resolve();
                        }
                    }, ROLL_CHAOS_WAIT + 500);
                });
            })
            .then(() => {
                eventBus.emit('game:enableInput');
            });
    }

    processTurn() {
        console.log(
            `STATS: Earth: ${character.stats['EARTH']} Air: ${character.stats['AIR']} FIRE: ${character.stats['FIRE']} Water: ${character.stats['WATER']}`
        );
        if (character.mapPositionName === 'HOME') {
            this.runHomeActions();
            return;
        }
        this.runTravelActions();
    }

    applyStatBonus() {
        const type = character.mapPositionName;
        const extra = Phaser.Math.RND.pick(character.staffStats);
        const quantity = 1 + extra;

        if (quantity <= 0) {
            console.log(`${character.staffName} failed! Stats: ${character.staffStats}.`);
        } else {
            const fortuneRoll = Phaser.Math.RND.between(1, 3);
            if (fortuneRoll <= 2) {
                character.addFortune();
            }
        }

        character.applyStat(type, quantity);

        eventBus.emit('game:fortuneUpdated');
        console.log(`${type} increased by ${quantity}. ${type} is now ${character.stats[type]}.`);

        return animationTimeout(2000, undefined, () => {});
    }

    applyEntropy() {
        for (let i = 0; i < character.entropy; i++) {
            const roll = Phaser.Math.RND.between(1, 6);
            if (roll < 5) {
                const type = STAT_TYPES[roll - 1];
                character.applyStat(type, -1);
                console.log(`Entropy rolled: ${roll}. -1 ${type}.`);
            } else {
                console.log(`Entropy rolled: ${roll}. No stat deducted.`);
            }
        }
    }

    rollForChaos() {
        return animationTimeout(ROLL_CHAOS_WAIT, undefined, () => {
            const roll = Phaser.Math.RND.between(1, 10);
            if (roll <= character.entropy) {
                console.log(`Chaos HIT. Rolled ${roll}, entropy was ${character.entropy}.`);
                return this.applyChaos();
            } else {
                console.log(`Chaos MISSED. Rolled ${roll}, entropy was ${character.entropy}.`);
            }
        });
    }

    applyChaos() {
        return animationTimeout(APPLY_CHAOS_WAIT, undefined, () => {
            for (let i = 0; i < character.entropyCapacity; i++) {
                const roll = Phaser.Math.RND.between(1, 6);
                if (roll < 5) {
                    const type = STAT_TYPES[roll - 1];
                    if (character.shield > 0) {
                        character.reduceShieldDurability();
                        console.log(
                            `Shield blocked Chaos hit to ${type}! Remaining shield: ${character.shield}`
                        );
                    } else {
                        character.applyStat(type, -1);
                        console.log(`Chaos rolled: ${roll}. -1 ${type}.`);
                    }
                } else {
                    console.log(`Chaos rolled: ${roll}. No stat deducted.`);
                }
            }
            character.resetCurrentEntropy();
        });
    }

    handleDeath() {
        console.log('Oops, you died!');
        character.applyRndBane();

        return animationTimeout(DEATH_WAIT, undefined, () => {
            character.resetForRound();
            this.mapScene.returnHome();
        });
    }

    forceHome() {
        eventBus.emit('game:positionChanged', 0, { x: 400, y: 300 }, 'HOME');
    }
}

let gameManager = new GameManager();
export default gameManager;
