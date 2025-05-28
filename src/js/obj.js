class GameObject {
    constructor(x, y, w, h, r, c) {
        this.coordinates = { "x": x, "y": y }; // center of object
        this.dimensions = { "width": w, "height": h }; // for drawing
        this.radius = r; // hitbox
        this.sprite = game.spr.placeholder;
        this.clr = c;
    }

    get c() { return this.coordinates; }
    get d() { return this.dimensions; }
    get x() { return this.c.x; }
    get y() { return this.c.y; }
    set x(v) { this.c.x = v; }
    set y(v) { this.c.y = v; }
    get w() { return this.d.width; }
    get h() { return this.d.height; }
    get r() { return this.radius; }
    get sb_left() { return -1 * this.w / 2; }
    get sb_right() { return Game.GAMEWIDTH + this.w / 2; }
    get sb_top() { return -1 * this.h / 2; }
    get sb_bottom() { return Game.GAMEHEIGHT + this.h / 2; }
    get colortype() { return this.clr; }

    addCoord(x, y) {
        this.c.x += x;
        this.c.y += y;
    }
    setCoord(x, y) {
        this.c.x = x;
        this.c.y = y;
    }

    isColliding(other) {
        return circleCollide(this.c, other.c, this.r, other.r);
    }

    drawSprite() {
        this.sprite.draw(this.x, this.y, 0, 1);
    }

    drawHitbox() {
        stroke(Colors.RED);
        fill(Colors.WHITE);
        ellipse(this.x, this.y, this.r, this.r);
    }

    outOfBounds() { return false; }

    draw() {
        this.drawSprite();
        // this.drawHitbox();
    }

    update() { }
}

class Bomb extends GameObject {

}

class Bullet extends GameObject {
    constructor(x, y, w, h, r, c, d, s) {
        super(x, y, w, h, r, c);
        this.direction = d;
        this.speed = s;
        this.xvel = this.speed * Math.cos(this.direction);
        this.yvel = this.speed * Math.sin(this.direction);
        this.sprite = game.spr.shot_black;
    }

    outOfBounds() {
        return (this.x < this.sb_left || this.x > this.sb_right || this.y < this.sb_top || this.y > this.sb_bottom);
    }

    update() {
        this.addCoord(this.xvel, this.yvel);
    }
}

class EnemyShot extends Bullet {
    constructor(x, y, w, h, r, c, d, s) {
        super(x, y, w, h, r, c, d, s);
    }
}

class PlayerShot extends Bullet {
    static get WIDTH() { return 4; }
    static get HEIGHT() { return 6; }
    static get RADIUS() { return 4; }
    constructor(x, y, w, h, r, c, d, s) {
        super(x, y, w, h, r, c, d, s);
        switch (c) {
            case "K":
                this.sprite = game.spr.shot_black;
                break;
            case "R":
                this.sprite = game.spr.shot_red;
                break;
            case "G":
                this.sprite = game.spr.shot_green;
                break;
            case "B":
                this.sprite = game.spr.shot_blue;
                break;
        }
    }
}

class ShotSource extends GameObject {
    constructor(o, c, x, y, a, sp, fr, sx, sy, sa) {
        super(0, 0, 0, 0, 0, c);
        this.owner = o;
        this.offsetx = x;
        this.offsety = y;
        this.angle = a;
        this.speed = sp;
        this.firerate = fr;
        this.soffsetx = sx;
        this.soffsety = sy;
        this.sangle = sa;
        switch (c) {
            case "K":
                this.sprite = game.spr.ss_k;
                break;
            case "R":
                this.sprite = game.spr.ss_r;
                break;
            case "G":
                this.sprite = game.spr.ss_g;
                break;
            case "B":
                this.sprite = game.spr.ss_b;
                break;
        }
    }

    updatePosition() {
        if (KeyDown.SHIFT) { this.setCoord(this.owner.x + this.soffsetx, this.owner.y + this.soffsety); }
        else { this.setCoord(this.owner.x + this.offsetx, this.owner.y + this.offsety); }
    }

    shoot() {
        if (frameCount % this.firerate != 0) { return; }
        var appliedangle = (KeyDown.SHIFT) ? this.sangle : this.angle;
        if (appliedangle > HALF_PI) {
            appliedangle = (KeyDown.SHIFT) ? (Math.random() - 0.5) * Goggles.SLOW_SHOTSPREAD : (Math.random() - 0.5) * Goggles.SHOTSPREAD;
        }
        game.obj.push(new PlayerShot(this.x, this.y, PlayerShot.WIDTH, PlayerShot.HEIGHT, PlayerShot.RADIUS, this.colortype, -HALF_PI + appliedangle, this.speed));
    }
}

class Player extends GameObject {
    static get w() { return 16; }
    static get h() { return 16; }
    static get sb_left() { return Player.w / 2 - 1; }
    static get sb_right() { return Game.GAMEWIDTH - Player.w / 2 - 1; }
    static get sb_top() { return Player.h / 2 - 1; }
    static get sb_bottom() { return Game.GAMEHEIGHT - Player.h / 2 - 1; }
    static get fade_frames() { return 30 }

    constructor(c) {
        super(Game.GAMEWIDTH / 2, Game.GAMEHEIGHT - Game.BOUNDSMARGIN, Player.w, Player.h, 4, c);
        this.is_active = false;
        this.shotspeed = 4;
        this.sprite = game.spr.placeholder;

        this.linger = 0;

        this.ss = [];
    }
    get next_color() { return 0; }
    get speed_default() { return 4; }
    get speed_slow() { return 2; }

    get active() { return this.is_active; }
    set active(v) { this.is_active = v; }

    swapColors() {
        this.sprite.triggerSpin();
        this.sprite.triggerFade();
        this.active = false;
        game.obj[this.next_color].active = true;
        game.obj[this.next_color].sprite.clearAnimations();
        game.obj[this.next_color].setCoord(this.x, this.y)
        game.current_color = this.next_color;
        this.linger = Player.fade_frames;
    }
    drawSwapCooldown() {
        arc(this.x, this.y, 24, 24, -HALF_PI, TWO_PI * game.swap_cooldown / Game.SWAPFRAMES - HALF_PI);
    }

    move() {
        var s = (KeyDown.SHIFT) ? this.speed_slow : this.speed_default;
        var dx = 0;
        var dy = 0;
        if (KeyDown.LEFT) { dx -= s; }
        if (KeyDown.RIGHT) { dx += s; }
        if (KeyDown.UP) { dy -= s; }
        if (KeyDown.DOWN) { dy += s; }
        this.addCoord(dx, dy);
        // constraint movement
        if (this.x < Player.sb_left) { this.x = Player.sb_left; }
        if (this.x > Player.sb_right) { this.x = Player.sb_right; }
        if (this.y < Player.sb_top) { this.y = Player.sb_top; }
        if (this.y > Player.sb_bottom) { this.y = Player.sb_bottom; }
    }

    shoot() {
        for (var i = 0; i < this.ss.length; i++) {
            this.ss[i].shoot();
        }
    }

    draw() {
        if (!this.active) {
            if (this.linger <= 0) { return; }
            else {
                this.linger -= 1;
            }
        } else {
            for (var i = 0; i < this.ss.length; i++) {
                this.ss[i].drawSprite();
            }
            if (game.debug === true) { this.drawHitbox(); }
        }
        this.sprite.animate();
        this.drawSprite();
        if (this.active && game.swap_cooldown > 0) { this.drawSwapCooldown(); }
    }

    update() {
        if (!this.active) { return; }
        this.move();
        for (var i = 0; i < this.ss.length; i++) {
            this.ss[i].updatePosition();
        }
        if (KeyDown.Z) {
            this.shoot();
        }
        if (KeyDown.X) {
            // this.sprite.triggerBlink(60);
        }
    }
}

class Ribbon extends Player {
    constructor() {
        super("R");
        this.is_active = true;
        this.sprite = game.spr.ribbon;
        this.ss.push(new ShotSource(this, "R", -16, -12, -0.03, 12, 4, -12, -16, 0.01));
        this.ss.push(new ShotSource(this, "R", 16, -12, 0.03, 12, 4, 12, -16, -0.01));
    }
    get next_color() { return 1; }
    get speed_default() { return 7; }
    get speed_slow() { return 4; }
}

class Goggles extends Player {
    static get SHOTSPREAD() { return 0.25; }
    static get SLOW_SHOTSPREAD() { return 0.12; }

    constructor() {
        super("G");
        this.sprite = game.spr.goggles;
        this.ss.push(new ShotSource(this, "G", 0, -16, 0, 8, 8, 0, -18, 0));
        this.ss.push(new ShotSource(this, "G", -10, -14, PI, 8, 8, -8, -16, PI));
        this.ss.push(new ShotSource(this, "G", 10, -14, PI, 8, 8, 8, -16, PI));
    }
    get next_color() { return 2; }
    get speed_default() { return 5; }
    get speed_slow() { return 3; }
}

class Bellbottoms extends Player {
    constructor() {
        super("B");
        this.sprite = game.spr.bellbottoms;
        this.ss.push(new ShotSource(this, "B", -18, -12, -0.12, 10, 4, -14, -16, -0.04));
        this.ss.push(new ShotSource(this, "B", 18, -12, 0.12, 10, 4, 14, -16, 0.04));
    }
    get next_color() { return 0; }
    get speed_default() { return 4; }
    get speed_slow() { return 2; }
}