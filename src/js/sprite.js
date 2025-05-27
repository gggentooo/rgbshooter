class SpriteManager {
    constructor() {
        this.sprites = {};
    }

    get placeholder() { return this.sprites.placeholder; }
    get ribbon() { return this.sprites.ribbon; }
    get goggles() { return this.sprites.goggles; }
    get bellbottoms() { return this.sprites.bellbottoms; }
    get shot_black() { return this.sprites.shot_black; }

    loadSprites() {
        this.sprites.placeholder = new SpritePlaceholder();
        this.sprites.ribbon = new SpriteRibbon();
        this.sprites.goggles = new SpriteGoggles();
        this.sprites.bellbottoms = new SpriteBellbottoms();
        this.sprites.shot_black = new SpriteShot(Colors.BLACK);
    }
}

class Sprite {
    static get ROTATEAMOUNT() { return 40; }
    constructor(s, c) {
        this.size = s;
        this.color = c;
        this.currentAnims = { "rotate": true };
        this.pa = 0;
        this.ps = 0;
    }
    get s() { return this.size; }
    get c() { return this.color; }

    draw(x, y, a, s) {
        var appliedangle = a + this.pa;
        var appliedscale = s + this.ps;
        translate(x, y);
        rotate(appliedangle);
        scale(appliedscale);
        stroke(this.c);
        noFill();
        this.sprite();
        scale(1 / appliedscale);
        rotate(-appliedangle);
        translate(-x, -y);
    }

    triggerRotate() {
        if (this.currentAnims.rotate === true) { return; }
        this.currentAnims.rotate = true;
        this.pa = Sprite.ROTATEAMOUNT;
    }

    animate() {
        if (this.currentAnims.rotate === true) {
            if (this.pa === 0) {
                this.currentAnims.rotate = false;
            } else {
                this.pa = Math.floor(this.pa * 0.95);
            }
        }
    }

    sprite() { }
}

class SpritePlaceholder extends Sprite {
    constructor() {
        super(16, Colors.BLACK);
    }

    sprite() {
        fill(this.c);
        rect(0, 0, this.s, this.s);
    }
}

class SpriteShot extends Sprite {
    constructor(c) {
        super(6, c);
    }

    sprite() {
        ellipse(0, 0, this.s, this.s);
    }
}

class SpriteRibbon extends Sprite {
    constructor() {
        super(12, Colors.RED);
        this.cosq = Math.cos(QUARTER_PI);
        this.sinq = Math.sin(QUARTER_PI);
        this.coshq = Math.cos(HALF_PI + QUARTER_PI); // Not the hyperbolic cosine of q, this is the cosine of h plus q, I make the rules
        this.sinhq = Math.sin(HALF_PI + QUARTER_PI);
        this.cosq_s = this.cosq * this.s;
        this.sinq_s = this.sinq * this.s;
        this.coshq_s = this.coshq * this.s;
        this.sinhq_s = this.sinhq * this.s;
        this.m = 1;
    }

    sprite() {
        line(-1 * this.cosq_s - this.m, -1 * this.sinq_s + this.m, this.cosq_s - this.m, this.sinq_s + this.m);
        line(-1 * this.cosq_s + this.m, -1 * this.sinq_s - this.m, this.cosq_s + this.m, this.sinq_s - this.m);
        line(-1 * this.coshq_s - this.m, -1 * this.sinhq_s - this.m, this.coshq_s - this.m, this.sinhq_s - this.m);
        line(-1 * this.coshq_s + this.m, -1 * this.sinhq_s + this.m, this.coshq_s + this.m, this.sinhq_s + this.m);
    }
}

class SpriteGoggles extends Sprite {
    constructor() {
        super(20, Colors.GREEN);
        this.m = 6;
    }

    sprite() {
        ellipse(0, 0, this.s, this.s);
        ellipse(0, 0, this.s - this.m, this.s - this.m);
        line(0, -this.s / 2, 0, -this.s / 2 + this.m);
    }
}

class SpriteBellbottoms extends Sprite {
    constructor() {
        super(18, Colors.BLUE);
        this.m = 3;
        this.sqrt3 = Math.sqrt(3);
        this.sqrt3s2 = this.sqrt3 * this.s / 2;
    }

    sprite() {
        triangle(0, -1 * this.sqrt3s2 / 2 - this.m, -this.s / 2, this.sqrt3s2 / 2 - this.m, this.s / 2, this.sqrt3s2 / 2 - this.m);
        line(-this.s / 2, this.sqrt3s2 / 2, this.s / 2, this.sqrt3s2 / 2);
    }
}