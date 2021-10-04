export class Carousel {

    constructor(scene, x, y) {
        this.scene = scene;
        this.x = x;
        this.y = y;

        this.slideTextures = [
            'card1',
            'card2',
            'card3',
            'card4',
            'card5',
            'card6'
        ];

        this.slideIndex = 0;

        this.createCarousel();
    }

    createCarousel() {

        this.background = this.scene.add.image(400, 300, 'background');

        this.slide = this.scene.add.sprite(
            this.x,
            this.y,
            this.slideTextures[this.slideIndex]
        );

        this.slide.setScale(0.4);

        this.buttonPrevious = this.scene.add.text(this.x - 300, this.y + 200, "Previous", {fontFamily: "Amatic SC", fontSize: 50, stroke: "#000", strokeThickness: 6});
        this.buttonNext = this.scene.add.text(this.x + 300, this.y + 200, "Next", {fontFamily: "Amatic SC", fontSize: 50, stroke: "#000", strokeThickness: 6});

        this.buttonPrevious.setInteractive({ useHandCursor: true });
        this.buttonPrevious.on('pointerup', () => {
            this.handlePrevious();
        });

        this.buttonPrevious.setVisible(false);

        this.buttonNext.setInteractive({ useHandCursor: true });
        this.buttonNext.on('pointerup', () => {
            this.handleNext();
        })

    }

    handlePrevious() {
        this.slideIndex = Phaser.Math.Clamp(this.slideIndex - 1, 0, this.slideTextures.length - 1);
        this.buttonNext.text = "Next";

        this.slide.setTexture(this.slideTextures[this.slideIndex]);

        if(this.slideIndex === 0) {
            this.buttonPrevious.setVisible(false);
        }
    }

    handleNext() {

        if(this.buttonNext.text === "Play") {
            this.scene.scene.start("MapScene");
            this.scene.scene.stop();
            return;
        }

        this.buttonPrevious.setVisible(true);

        this.slideIndex = Phaser.Math.Clamp(this.slideIndex + 1, 0, this.slideTextures.length - 1);
        this.slide.setTexture(this.slideTextures[this.slideIndex]);

        if(this.slideIndex + 1 === this.slideTextures.length) {
            this.buttonNext.text = "Play";
        }
    }

}