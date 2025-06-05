class GameObject {
    constructor(x, y, w, h, r, c) {
        this.coordinates = { "x": x, "y": y }; // center of object
        this.dimensions = { "width": w, "height": h }; // for drawing
        this.radius = r; // hitbox
        this.sprite = game.spr.placeholder;
        this.clr = c;
        switch (c) {
            case "K":
                this.colorval = Colors.BLACK;
                break;
            case "R":
                this.colorval = Colors.RED;
                break;
            case "G":
                this.colorval = Colors.GREEN;
                break;
            case "B":
                this.colorval = Colors.BLUE;
                break;
        }
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
    get colorvalue() { return this.colorval; }

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
        fill(Colors.WHITE_200);
        ellipse(this.x, this.y, this.r, this.r);
    }

    outOfBounds() { return false; }

    draw() {
        this.drawSprite();
    }

    destruct() {
        game.obj.splice(game.obj.indexOf(this), 1);
    }

    update() { }
}

class Bomb extends GameObject {
    constructor(x, y, w, h, r, c) {
        super(x, y, w, h, r, c);
    }

    outOfBounds() {
        return this.r > 300;
    }

    draw() {
        stroke(this.colorval);
        noFill();
        ellipse(this.x, this.y, this.r * 2, this.r * 2);
    }

    update() {
        this.radius += 6;
        for (var i = 0; i < game.obj.length; i++) {
            var o = game.obj[i];
            if (this.isColliding(o) && this.clr != o.clr) {
                if (o instanceof EnemyShot) { o.destruct(); }
                else if (o instanceof Enemy) { o.currenthealth -= 20; }
            }
        }
    }
}

class Bullet extends GameObject {
    constructor(x, y, w, h, r, c, d, s, src) {
        super(x, y, w, h, r, c);
        this.direction = d;
        this.speed = s;
        this.xvel = this.speed * Math.cos(this.direction);
        this.yvel = this.speed * Math.sin(this.direction);
        this.sprite.setDefaultAngle(d);
        this.source = src;
    }

    get src() { return this.source; }

    outOfBounds() {
        return (this.x < this.sb_left || this.x > this.sb_right || this.y < this.sb_top || this.y > this.sb_bottom);
    }

    destruct() {
        game.ptc.push(new ParticlePop(this.x, this.y, this.colorvalue, 8, 16));
        super.destruct();
    }

    update() {
        this.addCoord(this.xvel, this.yvel);
    }
}

class EnemyShot extends Bullet {
    static get WIDTH() { return 2; }
    static get HEIGHT() { return 3; }
    static get RADIUS() { return 2; }
    constructor(x, y, w, h, r, c, d, s, src) {
        super(x, y, w, h, r, c, d, s, src);
        switch (c) {
            case "K":
                this.sprite = new SpriteShot(Colors.BLACK, true, EnemyShot.WIDTH, EnemyShot.HEIGHT);
                break;
            case "R":
                this.sprite = new SpriteShot(Colors.RED, true, EnemyShot.WIDTH, EnemyShot.HEIGHT);
                break;
            case "G":
                this.sprite = new SpriteShot(Colors.GREEN, true, EnemyShot.WIDTH, EnemyShot.HEIGHT);
                break;
            case "B":
                this.sprite = new SpriteShot(Colors.BLUE, true, EnemyShot.WIDTH, EnemyShot.HEIGHT);
                break;
        }
    }
}

class PlayerShot extends Bullet {
    static get WIDTH() { return 3; }
    static get HEIGHT() { return 5; }
    static get RADIUS() { return 4; }
    constructor(x, y, w, h, r, c, d, s, src) {
        super(x, y, w, h, r, c, d, s, src);
        switch (c) {
            case "K":
                this.sprite = new SpriteShot(Colors.BLACK, false, PlayerShot.WIDTH, PlayerShot.HEIGHT);
                break;
            case "R":
                this.sprite = new SpriteShot(Colors.RED, false, PlayerShot.WIDTH, PlayerShot.HEIGHT);
                break;
            case "G":
                this.sprite = new SpriteShot(Colors.GREEN, false, PlayerShot.WIDTH, PlayerShot.HEIGHT);
                break;
            case "B":
                this.sprite = new SpriteShot(Colors.BLUE, false, PlayerShot.WIDTH, PlayerShot.HEIGHT);
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
        this.distfromowner = distBetween(o.c, { "x": o.x + this.offsetx, "y": o.y + this.offsety });
        this.angle = a;
        this.rotateangle = 0;
        this.speed = sp;
        this.firerate = fr;
        this.soffsetx = sx;
        this.soffsety = sy;
        this.sangle = sa;
        switch (c) {
            case "K":
                this.sprite = new SpriteShotSource(Colors.BLACK);
                break;
            case "R":
                this.sprite = new SpriteShotSource(Colors.RED);
                break;
            case "G":
                this.sprite = new SpriteShotSource(Colors.GREEN);
                break;
            case "B":
                this.sprite = new SpriteShotSource(Colors.BLUE);
                break;
        }

        this.appliedangle = 0;
    }

    updatePosition() {
        if (this.owner instanceof Player && KeyDown.SHIFT) {
            this.setCoord(this.owner.x + this.soffsetx, this.owner.y + this.soffsety);
        } else if (this.owner instanceof Enemy && this.owner.currentrotation != 0) {
            this.rotateangle = this.owner.currentrotation;
            this.appliedangle = this.angle + this.rotateangle;
            this.setCoord(this.owner.x + this.distfromowner * cos(this.appliedangle - HALF_PI), this.owner.y + this.distfromowner * sin(this.appliedangle - HALF_PI));
        } else {
            this.setCoord(this.owner.x + this.offsetx, this.owner.y + this.offsety);
        }
    }

    shoot() { }

    drawSprite() {
        this.sprite.draw(this.x, this.y, this.appliedangle, 1);
    }
}

class EnemyShotSource extends ShotSource {
    constructor(o, c, x, y, a, sp, fr) {
        super(o, c, x, y, a, sp, fr, x, y, a);
    }

    shoot() {
        if (frameCount % this.firerate != 0) { return; }
        this.appliedangle = this.angle + this.rotateangle;
        game.obj.push(new EnemyShot(this.x, this.y, EnemyShot.WIDTH, EnemyShot.HEIGHT, EnemyShot.RADIUS, this.colortype, -HALF_PI + this.appliedangle, this.speed, this.owner));
    }
}

class PlayerShotSource extends ShotSource {
    constructor(o, c, x, y, a, sp, fr, sx, sy, sa) {
        super(o, c, x, y, a, sp, fr, sx, sy, sa);
    }

    shoot() {
        if (frameCount % this.firerate != 0) { return; }
        this.appliedangle = (KeyDown.SHIFT) ? this.sangle : this.angle;
        if (this.appliedangle === null) {
            this.appliedangle = (KeyDown.SHIFT) ? (Math.random() - 0.5) * Goggles.SLOW_SHOTSPREAD : (Math.random() - 0.5) * Goggles.SHOTSPREAD;
        }
        game.obj.push(new PlayerShot(this.x, this.y, PlayerShot.WIDTH, PlayerShot.HEIGHT, PlayerShot.RADIUS, this.colortype, -HALF_PI + this.appliedangle, this.speed, this.owner));
    }
}

class Enemy extends GameObject {
    constructor(x, y, s, r, c, points, rspeed, d, m, lfsp) {
        super(x, y, s, s, r, c);
        game.enemies += 1;

        this.spawnframe = frameCount;
        this.delay = d;
        this.lifespan = lfsp;

        this.movement = m;
        this.xvel = 0;
        this.yvel = 0;

        this.maxhealth = points * 4;
        this.currenthealth = this.maxhealth;

        this.rotatespeed = rspeed;
        this.currentrotation = 0;

        switch (c) {
            case "K":
                this.sprite = new SpriteEnemy(Colors.BLACK, points, s);
                break;
            case "R":
                this.sprite = new SpriteEnemy(Colors.RED, points, s);
                break;
            case "G":
                this.sprite = new SpriteEnemy(Colors.GREEN, points, s);
                break;
            case "B":
                this.sprite = new SpriteEnemy(Colors.BLUE, points, s);
                break;
        }

        this.ss = [];
    }

    addShotSource(a, sp, fr) {
        var xoff = this.w * Math.sin(a);
        var yoff = this.w * Math.cos(a) * -1;
        this.ss.push(new EnemyShotSource(this, this.colortype, xoff, yoff, a, sp, fr));
        this.ss[this.ss.length - 1].updatePosition();
    }

    shoot() {
        if (this.ss.length === 0) { return; }
        for (var i = 0; i < this.ss.length; i++) {
            this.ss[i].shoot();
        }
    }

    checkHit() {
        for (var i = 0; i < game.obj.length; i++) {
            var o = game.obj[i];
            if (o instanceof PlayerShot && this.isColliding(o)) {
                this.sprite.triggerBlink(2);
                o.destruct();
                if (this.colortype === o.colortype) {
                    this.currenthealth -= 0.5;
                } else {
                    this.currenthealth -= 1;
                }
            }
        }
        if (this.currenthealth <= 0) { this.destruct(); }
    }

    destruct() {
        game.ptc.push(new ParticlePop(this.x, this.y, this.colorvalue, 16, 60));
        game.ptc.push(new ParticleExplode(this.x, this.y, this.colorvalue, 12, 60));
        game.enemies -= 1;

        for (var i = 0; i < game.obj.length; i++) {
            var o = game.obj[i];
            if (o instanceof Bullet && o.src === this) {
                o.destruct();
            }
        }

        super.destruct();
    }

    draw() {
        for (var i = 0; i < this.ss.length; i++) {
            this.ss[i].drawSprite();
        }
        this.sprite.animate();
        this.drawSprite();
        if (game.debug === true) { this.drawHitbox(); }
    }

    updateRotation() {
        if (this.rotatespeed === 0) { return; }
        this.currentrotation += this.rotatespeed / 180 * PI;
        this.sprite.da = this.currentrotation;
    }
    updatePosition() {
        var xacc = 0;
        var yacc = 0;
        for (var i = 0; i < this.movement.length; i++) {
            if (game.current_scene.currentframe - this.delay > this.movement[i].frames) {
                xacc = this.movement[i].xacc;
                yacc = this.movement[i].yacc;
            }
        }
        this.xvel += xacc;
        this.yvel += yacc;
        this.addCoord(this.xvel, this.yvel);
    }

    update() {
        if (game.current_scene.currentframe < this.delay) { return; }
        this.updateRotation();
        this.updatePosition();
        for (var i = 0; i < this.ss.length; i++) {
            this.ss[i].updatePosition();
        }
        this.checkHit();
        this.shoot();
    }
}

class Player extends GameObject {
    static get w() { return 16; }
    static get h() { return 16; }
    static get sb_left() { return Player.w / 2 - 1; }
    static get sb_right() { return Game.GAMEWIDTH - Player.w / 2 - 1; }
    static get sb_top() { return Player.h / 2 - 1; }
    static get sb_bottom() { return Game.GAMEHEIGHT - Player.h / 2 - 1; }
    static get FADE_FRAMES() { return 30 }
    static get INVINCIBLE_FRAMES() { return 90; }
    static get BOMB_COOLDOWN() { return 45; }

    constructor(c, r) {
        super(Game.GAMEWIDTH / 2, Game.GAMEHEIGHT - Game.BOUNDSMARGIN, Player.w, Player.h, r, c);
        this.is_active = false;
        this.shotspeed = 4;
        this.sprite = game.spr.placeholder;

        this.linger = 0;

        this.ss = [];

        this.invincible = 0;
        this.bombcooldown = 0;
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
        game.current_colortype = game.obj[this.next_color].colortype;
        this.linger = Player.FADE_FRAMES;
        if (this.invincible > 0) {
            game.obj[this.next_color].sprite.triggerBlink(this.invincible);
            game.obj[this.next_color].invincible = this.invincible;
            this.invincible = 0;
        }
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
        if (this.x < Player.sb_left) { this.x = Player.sb_left; }
        if (this.x > Player.sb_right) { this.x = Player.sb_right; }
        if (this.y < Player.sb_top) { this.y = Player.sb_top; }
        if (this.y > Player.sb_bottom) { this.y = Player.sb_bottom; }
    }

    checkHit() {
        for (var i = 0; i < game.obj.length; i++) {
            var o = game.obj[i];
            if (o instanceof EnemyShot && this.isColliding(o)) {
                if (this.colortype != o.colortype) {
                    game.ptc.push(new ParticleExplode(this.x, this.y, this.colorvalue, 16, 72));
                    this.invincible = Player.INVINCIBLE_FRAMES;
                    this.sprite.triggerBlink(this.invincible);
                    game.lifecount -= 1;
                    if (game.lifecount <= 0) {
                        game.current_scene = game.scenes.gameover;
                    }
                    game.bombcount = Game.RESETBOMB;
                }
                o.destruct();
            }
            else if (o instanceof Enemy && this.isColliding(o)) {
                if (this.colortype != o.colortype) {
                    game.ptc.push(new ParticleExplode(this.x, this.y, this.colorvalue, 16, 72));
                    this.invincible = Player.INVINCIBLE_FRAMES;
                    this.sprite.triggerBlink(this.invincible);
                    game.lifecount -= 1;
                    if (game.lifecount <= 0) {
                        game.current_scene = game.scenes.gameover;
                    }
                    game.bombcount = Game.RESETBOMB;
                }
            }
        }
    }

    shoot() {
        for (var i = 0; i < this.ss.length; i++) {
            this.ss[i].shoot();
        }
    }

    useBomb() {
        if (this.bombcooldown > 0 || game.bombcount <= 0) { return; }
        else {
            game.bombcount -= 1;
            this.bombcooldown = Player.BOMB_COOLDOWN;
            game.obj.push(new Bomb(this.x, this.y, 0, 0, 4, this.colortype));
            this.invincible = Player.INVINCIBLE_FRAMES / 2;
            this.sprite.triggerBlink(this.invincible);
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
        }
        this.sprite.animate();
        this.drawSprite();
        if (this.active && game.swap_cooldown > 0) { this.drawSwapCooldown(); }
        if (this.active && game.debug === true && this.invincible === 0) { this.drawHitbox(); }
    }

    destruct() { return; }

    update() {
        if (!this.active) { return; }
        this.move();
        if (this.invincible === 0) {
            this.checkHit();
        } else {
            this.invincible -= 1;
        }
        if (this.bombcooldown > 0) {
            this.bombcooldown -= 1;
        }
        for (var i = 0; i < this.ss.length; i++) {
            this.ss[i].updatePosition();
        }
        if (KeyDown.Z) {
            this.shoot();
        }
        if (KeyDown.X) {
            this.useBomb();
        }
    }
}

class Ribbon extends Player {
    constructor() {
        super("R", 4);
        this.is_active = true;
        this.sprite = new SpriteRibbon();
        this.ss.push(new PlayerShotSource(this, "K", -16, -12, -0.04, 8, 7, -12, -16, -0.01));
        this.ss.push(new PlayerShotSource(this, "K", 16, -12, 0.04, 8, 7, 12, -16, 0.01));
        this.ss.push(new PlayerShotSource(this, "R", -6, -18, -0.03, 12, 5, -4, -20, 0.01));
        this.ss.push(new PlayerShotSource(this, "R", 6, -18, 0.03, 12, 5, 4, -20, -0.01));
    }
    get color() { return Colors.RED; }
    get next_color() { return 1; }
    get speed_default() { return 7; }
    get speed_slow() { return 4; }
}

class Goggles extends Player {
    static get SHOTSPREAD() { return 0.4; }
    static get SLOW_SHOTSPREAD() { return 0.12; }

    constructor() {
        super("G", 5);
        this.sprite = new SpriteGoggles();
        this.ss.push(new PlayerShotSource(this, "G", 0, -20, 0, 12, 6, 0, -22, 0));
        this.ss.push(new PlayerShotSource(this, "G", -10, -16, null, 10, 8, -8, -18, null));
        this.ss.push(new PlayerShotSource(this, "G", 10, -16, null, 10, 8, 8, -18, null));
        this.ss.push(new PlayerShotSource(this, "G", -18, -10, null, 8, 12, -12, -12, null));
        this.ss.push(new PlayerShotSource(this, "G", 18, -10, null, 8, 12, 12, -12, null));
    }
    get color() { return Colors.GREEN; }
    get next_color() { return 2; }
    get speed_default() { return 5; }
    get speed_slow() { return 3; }
}

class Bellbottoms extends Player {
    constructor() {
        super("B", 5);
        this.sprite = new SpriteBellbottoms();
        this.ss.push(new PlayerShotSource(this, "B", -10, -16, -0.08, 10, 4, -7, -20, -0.03));
        this.ss.push(new PlayerShotSource(this, "B", 10, -16, 0.08, 10, 4, 7, -20, 0.03));
        this.ss.push(new PlayerShotSource(this, "B", -18, -12, -0.18, 8, 6, -14, -16, -0.09));
        this.ss.push(new PlayerShotSource(this, "B", 18, -12, 0.18, 8, 6, 14, -16, 0.09));
    }
    get color() { return Colors.BLUE; }
    get next_color() { return 0; }
    get speed_default() { return 4; }
    get speed_slow() { return 2; }
}