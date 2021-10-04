const TEXT_DEPTH = 100;

export class AnimatedText {

    constructor(scene, x, y, text, config, animConfig) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.text = text;
        this.config = config;
        this.animConfig = animConfig;

        this.play();
    }

    play() {
        const textEntity = this.scene.add.text(this.x, this.y, this.text, this.config);
        textEntity.setDepth(TEXT_DEPTH);
        this.scene.tweens.add(Object.assign(this.animConfig, { targets: textEntity, onComplete: () => { textEntity.destroy(); } }));
    }

}