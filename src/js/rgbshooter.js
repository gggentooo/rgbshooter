let game = new Game();

function preload() {
}

function setup() {
    createCanvas(Game.WINDOWWIDTH, Game.WINDOWHEIGHT);
    frameRate(Game.FRAMERATE);
    angleMode(RADIANS);
    ellipseMode(CENTER);
    rectMode(CENTER);
    textFont("Nunito", 16);
    game.initialize();
}

function draw() {
    background(Colors.WHITE);
    game.update();

    game.draw();
}