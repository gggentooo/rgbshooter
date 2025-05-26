let game = new Game();

function preload() {
    game.initialize();
}

function setup() {
    createCanvas(740, 480);
    frameRate(60);
    rectMode(CENTER);
    angleMode(DEGREES);
}

function draw() {
    background(220);
    game.drawObjects();
}