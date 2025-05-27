class Game {
    static get WINDOWWIDTH() { return 800; }
    static get WINDOWHEIGHT() { return 600; }
    static get GAMEWIDTH() { return 500; }
    static get GAMEHEIGHT() { return 600; }
    static get BOUNDSMARGIN() { return 48; }
    static get FRAMERATE() { return 60; }

    static get MAXLIFE() { return 5; }
    static get MAXBOMB() { return 8; }

    static get SWAPFRAMES() { return 30; }


    constructor() {
        this.objects = [];
        this.lifecount = 3;
        this.bombcount = 3;
        this.sprites = new SpriteManager();
        this.current_color = 0;
        this.swap_cooldown = 0;
    }

    get obj() { return this.objects; }
    get life() { return this.lifecount; }
    get bomb() { return this.bombcount; }
    get spr() { return this.sprites; }

    initialize() {
        this.sprites.loadSprites();
        this.obj.splice(0, this.obj.length);
        this.obj.push(new Ribbon());
        this.obj.push(new Goggles());
        this.obj.push(new Bellbottoms());
    }


    updateObjects() {
        for (var i = 0; i < this.obj.length; i++) {
            this.obj[i].update();
            if (this.obj[i].outOfBounds()) { this.obj.splice(i, 1); }
        }
    }

    checkColorSwap() {
        if (this.swap_cooldown > 0) { this.swap_cooldown -= 1; }
        if (KeyDown.C) {
            if (this.swap_cooldown > 0) { return; }
            this.swap_cooldown = Game.SWAPFRAMES;
            this.obj[this.current_color].swapColors();
        }
    }


    drawBoundary() {
        stroke(Colors.BLACK);
        noFill();
        rect(Game.GAMEWIDTH / 2, Game.GAMEHEIGHT / 2, Game.GAMEWIDTH - 2, Game.GAMEHEIGHT - 2);
    }

    drawStatus() {
        push();
        clip(this.statusMask);
        translate(Game.GAMEWIDTH, 0);
        this.statusBackground();
        // this.statusText(50, 100);
        pop();
    }
    statusMask() {
        rect(Game.GAMEWIDTH + (Game.WINDOWWIDTH - Game.GAMEWIDTH) / 2, Game.GAMEHEIGHT / 2, Game.WINDOWWIDTH - Game.GAMEWIDTH, Game.WINDOWHEIGHT);
    }
    statusBackground() {
        push();
        var r = { "x": 250, "y": 320, "l": 150 };
        var g = { "x": 80, "y": 450, "r": 250 };
        var b = { "x": 210, "y": 400, "h": 120 };
        background(Colors.WHITE);
        noFill();
        stroke(Colors.GREEN);
        ellipse(g.x, g.y, g.r);
        rotateWithAnchor(b.x, b.y, 0.1);
        stroke(Colors.BLUE);
        triangle(b.x, b.y, b.x - b.h, b.y + b.h * Math.sqrt(3), b.x + b.h, b.y + b.h * Math.sqrt(3));
        rotateWithAnchor(r.x, r.y, 1.6);
        stroke(Colors.RED);
        line(r.x - Math.cos(QUARTER_PI) * r.l, r.y - Math.sin(QUARTER_PI) * r.l, r.x + Math.cos(QUARTER_PI) * r.l, r.y + Math.sin(QUARTER_PI) * r.l);
        line(r.x - Math.cos(HALF_PI + QUARTER_PI) * r.l, r.y - Math.sin(HALF_PI + QUARTER_PI) * r.l, r.x + Math.cos(HALF_PI + QUARTER_PI) * r.l, r.y + Math.sin(HALF_PI + QUARTER_PI) * r.l);
        pop();
    }
    statusText(x, y) {
        noStroke();
        fill(Colors.BLACK);
        text("LIFE: ", x, y);
    }

    drawObjects() {
        for (var i = 0; i < this.obj.length; i++) {
            this.obj[i].draw();
        }
    }


    update() {
        this.updateObjects();
        this.checkColorSwap();
    }

    draw() {
        this.drawObjects();
        // this.drawBoundary();
        this.drawStatus();
    }
}