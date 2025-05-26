let testobjects = [];

function preload() {
    var o1 = new GameObject(10, 10, 12, 12, 10);
    var o2 = new GameObject(15, 20, 16, 16, 10);
    testobjects.push(o1, o2);
    console.log(o1.isColliding(o2));
}

function setup() {
    createCanvas(740, 480);
    frameRate(60);
    rectMode(CENTER);
    angleMode(DEGREES);
}

function draw() {
    background(220);
    for (var i = 0; i < testobjects.length; i++) {
        testobjects[i].drawSprite();
        testobjects[i].drawHitbox();
    }
}