let game = new Game();
let enemydata;

function preload() {
    // enemydata = loadJSON('src/enemydata.json');
}

function setup() {
    createCanvas(Game.WINDOWWIDTH, Game.WINDOWHEIGHT);
    frameRate(Game.FRAMERATE);
    angleMode(RADIANS);
    ellipseMode(CENTER);
    rectMode(CENTER);
    textFont("Quicksand", 16);
    background(Colors.WHITE);
    game.initialize();
}

function draw() {
    background(Colors.WHITE);
    game.update();

    game.draw();
}