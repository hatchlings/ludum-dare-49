import character, { STAT_TYPES } from '../model/character';
import eventBus from '../util/eventbus';
import { animationTimeout } from '../util/timing';
import audioManager from './audiomanager';

// Wait times for various Animations
const APPLY_ENTROPY_WAIT = 1000;
const DEATH_WAIT = 2000;
const RESET_ENTROPY_WAIT = 1000;
const APPLY_CHAOS_WAIT = 1000;
const ROLL_CHAOS_WAIT = 1000;
const APPLY_STAT_BONUS_WAIT = 1000;
const WIN_WAIT = 2000;

class GameManager {
    constructor() {
        this.setupListeners();
        this.moveCount = 0;
    }

    setScene(scene) {
        this.mapScene = scene;
    }

    setupListeners() {
        eventBus.on('game:positionChanged', this.positionChanged.bind(this));
        eventBus.on('game:turnEnded', this.processTurn.bind(this));
    }

    positionChanged(location) {
        character.applyPositionChange(location);
        console.log(
            `Position changed. Now located at ${location.type}, entropy is now ${character.entropy}.`
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
                        if (character.isWinner) {
                            resolve(this.handleWinner());
                        }

                        if (character.isDead) {
                            resolve(this.handleDeath());
                        } else {
                            resolve();
                        }
                    }, ROLL_CHAOS_WAIT + 5);
                });
            })
            .then(() => {
                eventBus.emit('game:enableInput');
                eventBus.emit('game:resumeOrbit');
            });
    }

    processTurn() {
        this.moveCount += 1;
        console.log(`Move Count: ${this.moveCount}`);
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
            eventBus.emit('game:staffFailure');
        } else {
            eventBus.emit('game:staffSuccess', quantity);
            const fortuneRoll = Phaser.Math.RND.between(1, 3);
            if (fortuneRoll <= 2) {
                audioManager.play(this.mapScene, 'chime');
                character.addFortune();
            }
        }

        character.applyStat(type, quantity);

        console.log(`${type} increased by ${quantity}. ${type} is now ${character.stats[type]}.`);

        return animationTimeout(APPLY_STAT_BONUS_WAIT, undefined, () => {});
    }

    applyEntropy() {
        eventBus.emit('game:chaosHome');
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
        eventBus.emit('game:chaosSpin');
        return animationTimeout(ROLL_CHAOS_WAIT, undefined, () => {
            const roll = Phaser.Math.RND.between(1, 10);
            if (this.moveCount <= 2 || roll > character.entropy) {
                eventBus.emit('game:chaosMiss');
                console.log(`Chaos MISSED. Rolled ${roll}, entropy was ${character.entropy}.`);
            } else {
                eventBus.emit('game:chaosHit');
                console.log(`Chaos HIT. Rolled ${roll}, entropy was ${character.entropy}.`);
                return this.applyChaos();
            }
        });
    }

    applyChaos() {
        return animationTimeout(APPLY_CHAOS_WAIT, undefined, () => {
            for (let i = 0; i < character.entropyCapacity; i++) {
                const roll = Phaser.Math.RND.between(1, 6);
                if (roll < 5) {
                    const type = STAT_TYPES[roll - 1];
                    if (
                        character.location.type === type &&
                        Phaser.Math.RND.pick([true, false, false, false])
                    ) {
                        eventBus.emit(`game:${type}Shield`);
                        console.log(
                            `El blocked Chaos hit to ${type}! Remaining shield: ${character.shield}`
                        );
                    } else if (character.shield > 0) {
                        character.reduceShieldDurability();
                        eventBus.emit(`game:${type}Shield`);
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

        return animationTimeout(DEATH_WAIT, undefined, () => {
            character.applyRndBane();
            character.applyRndBoon();
            character.resetForRound();
            this.mapScene.returnHome();
        });
    }

    handleWinner() {
        return animationTimeout(WIN_WAIT, undefined, () => {
            eventBus.emit('game:win');
        });
    }
}

let gameManager = new GameManager();
export default gameManager;
