export class Carousel {

    constructor(scene, x, y) {
        this.scene = scene;
        this.x = x;
        this.y = y;

        this.slideTextures = [
            'texture-a',
            'texture-b',
            'texture-c'
        ];

        this.slideIndex = 0;

        this.createCarousel();
    }

    createCarousel() {

        this.buttonPrevious = this.scene.add.text(this.x - 100, this.y, "Previous");
        this.buttonNext = this.scene.add.text(this.x + 100, this.y, "Next");

        this.buttonPrevious.setInteractive();
        this.buttonPrevious.on('pointerup', () => {
            this.handlePrevious();
        });

        this.buttonPrevious.setVisible(falase);

        this.buttonNext.setInteractive();
        this.buttonNext.on('pointerup', () => {
            this.handleNext();
        })

        this.slide = this.scene.add.sprite(
            this.x,
            this.y,
            this.slideTextures[this.slideIndex]
        );
    }

    handlePrevious() {
        this.slideIndex = Phaser.Math.Clamp(this.slideIndex - 1, 0, this.slideTextures.length - 1);
        this.buttonNext.text = "Next";

        this.slide.texture = this.slideTextures[this.slideIndex];

        if(this.slideIndex === 0) {
            this.buttonPrevious.setVisible(false);
        }
    }

    handleNext() {

        if(this.buttonNext.text === "Play") {
            console.log("Start the game!");
            return;
        }

        this.buttonPrevious.setVisible(true);

        this.slideIndex = Phaser.Math.Clamp(this.slideIndex + 1, 0, this.slideTextures.length - 1);
        this.slide.texture = this.slideTextures[this.slideIndex];

        if(this.slideIndex + 1 === this.slideTextures.length) {
            this.buttonNext.text = "Play";
        }
    }

}