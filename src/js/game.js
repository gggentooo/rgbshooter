class Game {
    static get WINDOWWIDTH() { return 800; }
    static get WINDOWHEIGHT() { return 600; }
    static get GAMEWIDTH() { return 500; }
    static get GAMEHEIGHT() { return 600; }
    static get BOUNDSMARGIN() { return 48; }
    static get FRAMERATE() { return 60; }

    static get MAXLIFE() { return 5; }
    static get MAXBOMB() { return 8; }
    static get RESETBOMB() { return 3; }

    static get SWAPFRAMES() { return 24; }


    constructor() {
        this.objects = [];
        this.particles = [];
        this.lifecount = 3;
        this.bombcount = 3;
        this.sprites = new SpriteManager();
        this.scenes = new SceneManager();
        this.current_scene = null;
        this.changing_scenes = false;
        this.current_color = 0;
        this.current_colortype = "R";
        this.swap_cooldown = 0;

        this.debug = false;

        this.enemies = 0;
    }

    get obj() { return this.objects; }
    get ptc() { return this.particles; }
    get life() { return this.lifecount; }
    get bomb() { return this.bombcount; }
    get spr() { return this.sprites; }

    initialize() {
        this.sprites.loadSprites();
        this.scenes.loadScenes();
        this.obj.splice(0, this.obj.length);
        this.obj.push(new Ribbon());
        this.obj.push(new Goggles());
        this.obj.push(new Bellbottoms());
        this.current_scene = this.scenes.title;
        this.current_scene.initialize();
    }


    updateObjects() {
        for (var i = 0; i < this.obj.length; i++) {
            var o = this.obj[i];
            if (o instanceof Enemy && (frameCount - o.spawnframe > o.lifespan)) { o.destruct(); }
            o.update();
            if (o.outOfBounds()) { this.obj.splice(i, 1); }
            if (KeyDown.SHIFT && (o instanceof EnemyShot || o instanceof Enemy) && o.colortype === this.current_colortype) {
                o.sprite.seethrough = true;
                if (o instanceof Enemy) {
                    var ss = o.ss;
                    for (var j = 0; j < ss.length; j++) {
                        ss[j].sprite.seethrough = true;
                    }
                }
            }
        }
    }
    updateParticles() {
        for (var i = 0; i < this.ptc.length; i++) {
            this.ptc[i].update();
            if (this.ptc[i].finished()) { this.ptc.splice(i, 1); }
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
    checkDebugMode() {
        if (this.debug === true) { return; }
        if (KeyDown.D) { this.debug = true; }
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
        this.statusText(50, 100);
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
        // console.log("Triangle points: ", b.x, b.y, b.x - b.h, b.y + b.h * Math.sqrt(3), b.x + b.h, b.y + b.h * Math.sqrt(3))
        rotateWithAnchor(r.x, r.y, 1.6);
        stroke(Colors.RED);
        line(r.x - Math.cos(QUARTER_PI) * r.l, r.y - Math.sin(QUARTER_PI) * r.l, r.x + Math.cos(QUARTER_PI) * r.l, r.y + Math.sin(QUARTER_PI) * r.l);
        line(r.x - Math.cos(HALF_PI + QUARTER_PI) * r.l, r.y - Math.sin(HALF_PI + QUARTER_PI) * r.l, r.x + Math.cos(HALF_PI + QUARTER_PI) * r.l, r.y + Math.sin(HALF_PI + QUARTER_PI) * r.l);
        // console.log("Line1 points: ", r.x - Math.cos(QUARTER_PI) * r.l, r.y - Math.sin(QUARTER_PI) * r.l, r.x + Math.cos(QUARTER_PI) * r.l, r.y + Math.sin(QUARTER_PI) * r.l);
        // console.log("Line2 points: ", r.x - Math.cos(HALF_PI + QUARTER_PI) * r.l, r.y - Math.sin(HALF_PI + QUARTER_PI) * r.l, r.x + Math.cos(HALF_PI + QUARTER_PI) * r.l, r.y + Math.sin(HALF_PI + QUARTER_PI) * r.l);
        pop();
    }
    statusText(x, y) {
        noStroke();
        fill(Colors.BLACK);
        textSize(18);
        text("LIFE: " + this.lifecount + "\nBOMB: " + this.bombcount, x, y);
    }
    debugText(x, y) {
        noStroke();
        fill(Colors.BLACK_80);
        textSize(12);
        text("Framerate: " + Math.round(frameRate()) + "\nObjects: " + this.obj.length + "\nEnemy count: " + this.enemies, x, y);
    }

    drawObjects() {
        for (var i = 0; i < this.obj.length; i++) {
            this.obj[i].draw();
        }
    }
    drawParticles() {
        for (var i = 0; i < this.ptc.length; i++) {
            this.ptc[i].draw(this.ptc[i].tx, this.ptc[i].ty, this.ptc[i].ta, this.ptc[i].ts);
        }
    }


    update() {
        if (this.changing_scenes) {
            this.current_scene.end();
            if (this.current_scene.finished_ending) {
                this.changing_scenes = false;
                this.current_scene = this.current_scene.next;
                this.current_scene.initialize();
            }
        } else {
            this.current_scene.update();
            if (this.current_scene.sceneFinished()) {
                this.changing_scenes = true;
            }
        }
    }

    draw() {
        this.current_scene.draw();
    }
}