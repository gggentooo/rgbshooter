class GameObject {
    constructor(x, y, w, h, r) {
        this.coordinates = { "x": x, "y": y }; // center of object
        this.dimensions = { "width": w, "height": h }; // for drawing
        this.radius = r; // hitbox
        this.sprite = game.spr.placeholder;
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

class Bullet extends GameObject {
    constructor(x, y, w, h, r, c, d, s) {
        super(x, y, w, h, r);
        this.color = c;
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
    constructor(x, y, w, h, r, c, d, s) {
        super(x, y, w, h, r, c, d, s);
    }
}

class Player extends GameObject {
    static get w() { return 16; }
    static get h() { return 16; }
    static get sb_left() { return Player.w / 2 - 1; }
    static get sb_right() { return Game.GAMEWIDTH - Player.w / 2 - 1; }
    static get sb_top() { return Player.h / 2 - 1; }
    static get sb_bottom() { return Game.GAMEHEIGHT - Player.h / 2 - 1; }

    constructor() {
        super(Game.GAMEWIDTH / 2, Game.GAMEHEIGHT - Game.BOUNDSMARGIN, Player.w, Player.h, 4);
        this.is_active = false;
        this.shotspeed = 4;
        this.sprite = game.spr.placeholder;
    }
    get next_color() { return 0; }
    get speed_default() { return 4; }
    get speed_slow() { return 2; }

    get active() { return this.is_active; }
    set active(v) { this.is_active = v; }

    swapColors() {
        this.active = false;
        game.obj[this.next_color].active = true;
        game.obj[this.next_color].setCoord(this.x, this.y)
        game.current_color = this.next_color;
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
        game.obj.push(new Bullet(this.x, this.y - this.h / 2, 5, 8, 4, Colors.BLACK, -HALF_PI, 12));
    }

    draw() {
        if (!this.active) { return; }
        this.drawSprite();
        // this.drawHitbox();
    }

    update() {
        if (!this.active) { return; }
        this.move();
        if (KeyDown.Z && (frameCount % this.shotspeed == 0)) {
            this.shoot();
        }
        if (KeyDown.X) {
            this.sprite.triggerRotate();
        }
        this.sprite.animate();
    }
}

class Ribbon extends Player {
    constructor() {
        super();
        this.is_active = true;
        this.sprite = game.spr.ribbon;
    }
    get next_color() { return 1; }
    get speed_default() { return 7; }
    get speed_slow() { return 4; }
}

class Goggles extends Player {
    constructor() {
        super();
        this.sprite = game.spr.goggles;
    }
    get next_color() { return 2; }
    get speed_default() { return 5; }
    get speed_slow() { return 3; }
}

class Bellbottoms extends Player {
    constructor() {
        super();
        this.sprite = game.spr.bellbottoms;
    }
    get next_color() { return 0; }
    get speed_default() { return 4; }
    get speed_slow() { return 2; }
}