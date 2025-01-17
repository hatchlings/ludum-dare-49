const LINE_WIDTH = 0.75;
const LINE_COLOR = 0xffff00;
const LINE_COLOR_GRAD = 0x00ff00;

export class MapLines {
    constructor(scene, center) {
        this.scene = scene;
        this.center = center;
        this.lines = [];
        this.createLines();
    }

    createLines() {
        this.scene.orbitLocations.forEach((location) => {
            let graphics = this.scene.graphics.add({
                lineStyle: { width: LINE_WIDTH, color: LINE_COLOR },
            });
            let line = new Phaser.Geom.Line(location.x, location.y, this.center, this.center.y);

            this.lines.push({ obj: line, graphics: graphics, location: location });
        });

        // this.lineA = this.scene.add.graphics();
        // this.lineA.lineGradientStyle(LINE_WIDTH, LINE_COLOR, LINE_COLOR_GRAD, LINE_COLOR, LINE_COLOR_GRAD, 0.3);
        // this.lineA.lineBetween(580, 200, 830, 384);

        // this.lineB = this.scene.add.graphics();
        // this.lineB.lineGradientStyle(LINE_WIDTH, LINE_COLOR, LINE_COLOR_GRAD, LINE_COLOR, LINE_COLOR_GRAD, 0.3);
        // this.lineB.lineBetween(450, 200, 194, 384);

        // this.lineC = this.scene.add.graphics();
        // this.lineC.lineGradientStyle(LINE_WIDTH, LINE_COLOR, LINE_COLOR_GRAD, LINE_COLOR, LINE_COLOR_GRAD, 0.3);
        // this.lineC.lineBetween(194, 450, 465, 650);

        // this.lineD = this.scene.add.graphics();
        // this.lineD.lineGradientStyle(LINE_WIDTH, LINE_COLOR, LINE_COLOR_GRAD, LINE_COLOR, LINE_COLOR_GRAD, 0.3);
        // this.lineD.lineBetween(830, 464, 580, 650);

        // this.lineE = this.scene.add.graphics();
        // this.lineE.lineGradientStyle(LINE_WIDTH, LINE_COLOR, LINE_COLOR_GRAD, LINE_COLOR, LINE_COLOR_GRAD, 0.3);
        // this.lineE.lineBetween(512, 150, 1024/2, 768/2);

        // this.lineF = this.scene.add.graphics();
        // this.lineF.lineGradientStyle(LINE_WIDTH, LINE_COLOR, LINE_COLOR_GRAD, LINE_COLOR, LINE_COLOR_GRAD, 0.3);
        // this.lineF.lineBetween(874, 424, 1024/2, 768/2);

        // this.lineG = this.scene.add.graphics();
        // this.lineG.lineGradientStyle(LINE_WIDTH, LINE_COLOR, LINE_COLOR_GRAD, LINE_COLOR, LINE_COLOR_GRAD, 0.3);
        // this.lineG.lineBetween(512, 618, 1024/2, 768/2);

        // this.lineH = this.scene.add.graphics();
        // this.lineH.lineGradientStyle(LINE_WIDTH, LINE_COLOR, LINE_COLOR_GRAD, LINE_COLOR, LINE_COLOR_GRAD, 0.3);
        // this.lineH.lineBetween(210, 424, 1024/2, 768/2);
    }

    update() {
        this.lines.forEach((line) => {
            line.graphics.clear();
            Phaser.Geom.Line.RotateAroundXY(line.obj, line.obj.x2, line.obj.y2, 0.03);
            line.graphics.strokeLine(line.obj);
        });
    }
}
