let game = new Game();
let lang_global = "en";
let textbox_font = "IBM Plex Sans KR"
let dialoguedata;

function preload() {
    dialoguedata = loadJSON('src/dialogue.json');
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