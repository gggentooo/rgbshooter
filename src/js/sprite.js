class SpriteManager {
    loadSprites() {
        this.placeholder = new SpritePlaceholder();
        this.ribbon = new SpriteRibbon();
        this.goggles = new SpriteGoggles();
        this.bellbottoms = new SpriteBellbottoms();
        this.ss_k = new SpriteShotSource(Colors.BLACK);
        this.ss_r = new SpriteShotSource(Colors.RED);
        this.ss_g = new SpriteShotSource(Colors.GREEN);
        this.ss_b = new SpriteShotSource(Colors.BLUE);
        this.shot_black = new SpriteShot(Colors.BLACK, true, 3, 4);
        this.shot_red = new SpriteShot(Colors.RED, true, 3, 6);
        this.shot_green = new SpriteShot(Colors.GREEN, true, 3, 6);
        this.shot_blue = new SpriteShot(Colors.BLUE, true, 3, 6);
    }
}

class Sprite {
    constructor(s, c) {
        this.size = s;
        this.color = c;
        this.currentAnims = { "spin": false, "blink": false, "fade": false };
        this.pa = 0;
        this.ps = 0;

        this.fill = false;

        this.anim_spin_a = 0;
        this.anim_blink_f = 0;
        this.anim_fade_f = 0;
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
        if (this.fill) { fill(this.c); }
        this.sprite();
        scale(1 / appliedscale);
        rotate(-appliedangle);
        translate(-x, -y);
    }

    triggerSpin() {
        if (this.currentAnims.spin === true) { return; }
        this.currentAnims.spin = true;
        this.anim_spin_a = 0;
    }
    triggerBlink(duration) {
        if (this.currentAnims.blink === true) { return; }
        this.currentAnims.blink = true;
        this.anim_blink_f = duration;
        this.c.setAlpha(0);
    }
    triggerFade() {
        if (this.currentAnims.fade === true) { return; }
        this.currentAnims.fade = true;
        this.anim_fade_f = 0;
    }

    clearAnimations() {
        this.currentAnims.spin = false;
        this.currentAnims.blink = false;
        this.currentAnims.fade = false;
        this.anim_spin_a = 0;
        this.anim_fade_f = 0;
        this.c.setAlpha(255);
        this.pa = 0;
        this.ps = 0;
    }

    animate() {
        if (this.currentAnims.spin === true) {
            if (this.anim_spin_a >= PI) {
                this.currentAnims.spin = false;
            } else {
                this.anim_spin_a += PI / 64;
                this.pa = Math.cos(this.anim_spin_a) * PI * 2;
            }
        }
        if (this.currentAnims.blink === true) {
            if (this.anim_blink_f <= 0) {
                this.currentAnims.blink = false;
                this.c.setAlpha(255);
            } else {
                this.anim_blink_f -= 1;
                if (this.anim_blink_f % 4 === 0) { this.c.setAlpha(255); }
                else { this.c.setAlpha(0); }
            }
        }
        if (this.currentAnims.fade === true) {
            if (this.anim_fade_f >= PI) {
                this.currentAnims.fade = false;
                this.c.setAlpha(255);
            } else {
                this.anim_fade_f += 0.1;
                this.c.setAlpha(Math.cos(this.anim_fade_f) * 128 + 128);
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
    constructor(c, f, w, h) {
        super(6, c);
        this.fill = f;
        this.w = w;
        this.h = h;
    }

    sprite() {
        ellipse(0, 0, this.w, this.h);
    }
}

class SpriteShotSource extends Sprite {
    constructor(c) {
        super(3, c);
        this.origin = { "x": 0, "y": 0 };
        this.xoff = this.s - 1;
        this.c1 = { "x": -this.xoff, "y": this.s };
        this.c2 = { "x": this.xoff, "y": this.s };
    }

    sprite() {
        line(this.origin.x, this.origin.y, this.c1.x, this.c1.y);
        line(this.origin.x, this.origin.y, this.c2.x, this.c2.y);
    }
}

class SpriteRibbon extends Sprite {
    constructor() {
        super(9, Colors.RED);
        this.cosq = Math.cos(QUARTER_PI);
        this.sinq = Math.sin(QUARTER_PI);
        this.coshq = Math.cos(HALF_PI + QUARTER_PI); // Not the hyperbolic cosine of q, this is the cosine of h plus q, I make the rules
        this.sinhq = Math.sin(HALF_PI + QUARTER_PI);
        this.cosq_s = this.cosq * this.s;
        this.sinq_s = this.sinq * this.s;
        this.coshq_s = this.coshq * this.s;
        this.sinhq_s = this.sinhq * this.s;
        this.m = 1;

        this.l1c1 = { "x": -1 * this.cosq_s - this.m, "y": -1 * this.sinq_s + this.m };
        this.l1c2 = { "x": this.cosq_s - this.m, "y": this.sinq_s + this.m };
        this.l2c1 = { "x": -1 * this.cosq_s + this.m, "y": -1 * this.sinq_s - this.m };
        this.l2c2 = { "x": this.cosq_s + this.m, "y": this.sinq_s - this.m };
        this.l3c1 = { "x": -1 * this.coshq_s - this.m, "y": -1 * this.sinhq_s - this.m };
        this.l3c2 = { "x": this.coshq_s - this.m, "y": this.sinhq_s - this.m };
        this.l4c1 = { "x": -1 * this.coshq_s + this.m, "y": -1 * this.sinhq_s + this.m };
        this.l4c2 = { "x": this.coshq_s + this.m, "y": this.sinhq_s + this.m };
    }

    sprite() {
        line(this.l1c1.x, this.l1c1.y, this.l1c2.x, this.l1c2.y);
        line(this.l2c1.x, this.l2c1.y, this.l2c2.x, this.l2c2.y);
        line(this.l3c1.x, this.l3c1.y, this.l3c2.x, this.l3c2.y);
        line(this.l4c1.x, this.l4c1.y, this.l4c2.x, this.l4c2.y);
    }
}

class SpriteGoggles extends Sprite {
    constructor() {
        super(16, Colors.GREEN);
        this.m = 6;
        this.s2 = this.s - this.m;
        this.l1c1 = { "x": 0, "y": -this.s / 2 };
        this.l1c2 = { "x": 0, "y": -this.s / 2 + this.m };
    }

    sprite() {
        ellipse(0, 0, this.s, this.s);
        ellipse(0, 0, this.s2, this.s2);
        line(this.l1c1.x, this.l1c1.y, this.l1c2.x, this.l1c2.y);
    }
}

class SpriteBellbottoms extends Sprite {
    constructor() {
        super(14, Colors.BLUE);
        this.m = 3;
        this.sqrt3 = Math.sqrt(3);
        this.sqrt3s2 = this.sqrt3 * this.s / 2;
        this.tc1 = { "x": 0, "y": -1 * this.sqrt3s2 / 2 - this.m };
        this.tc2 = { "x": -this.s / 2, "y": this.sqrt3s2 / 2 - this.m };
        this.tc3 = { "x": this.s / 2, "y": this.sqrt3s2 / 2 - this.m };
        this.l1c1 = { "x": -this.s / 2, "y": this.sqrt3s2 / 2 };
        this.l1c2 = { "x": this.s / 2, "y": this.sqrt3s2 / 2 };
    }

    sprite() {
        triangle(this.tc1.x, this.tc1.y, this.tc2.x, this.tc2.y, this.tc3.x, this.tc3.y);
        line(this.l1c1.x, this.l1c1.y, this.l1c2.x, this.l1c2.y);
    }
}