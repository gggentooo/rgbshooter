class SpriteManager {
    loadSprites() {
        this.placeholder = new SpritePlaceholder();
    }
}

class Sprite {
    constructor(s, c) {
        this.size = s;
        this.color = c;
        this.currentAnims = { "spin": false, "blink": false, "fade": false, "fadefast": false };
        this.pa = 0;
        this.ps = 0;

        this.da = 0;

        this.fill = false;

        this.anim_spin_a = 0;
        this.anim_blink_f = 0;
        this.anim_fade_f = 0;
        this.anim_fadefast_f = 0;

        this.seethrough = false;
    }
    get s() { return this.size; }
    get c() { return this.color; }

    setDefaultAngle(a) { this.da = a; }

    draw(x, y, a, s) {
        if (this.seethrough) {
            this.c.setAlpha(60);
            this.seethrough = false;
        }
        var appliedangle = a + this.pa + this.da;
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
        this.c.setAlpha(255);
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
    triggerFadeFast() {
        if (this.currentAnims.fadefast === true) { return; }
        this.currentAnims.fadefast = true;
        this.anim_fadefast_f = 0;
    }

    clearAnimations() {
        this.currentAnims.spin = false;
        this.currentAnims.blink = false;
        this.currentAnims.fade = false;
        this.anim_spin_a = 0;
        this.anim_fade_f = 0;
        this.anim_fadefast_f = 0;
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
        else if (this.currentAnims.fadefast === true) {
            if (this.anim_fadefast_f >= PI) {
                this.currentAnims.fadefast = false;
                this.c.setAlpha(255);
            } else {
                this.anim_fadefast_f += 1.2;
                this.c.setAlpha(Math.cos(this.anim_fadefast_f) * 128 + 128);
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

class SpriteTextBox extends Sprite {
    constructor(c) {
        super(Game.GAMEWIDTH, c);
        this.width = Game.GAMEWIDTH - 48;
        this.height = 200;
        this.m = 8;
    }

    sprite() {
        noStroke();
        fill(Colors.BLACK_200);
        rect(0, 0, this.width, this.height, 8);
        stroke(this.c);
        noFill();
        rect(0, 0, this.width - this.m * 2, this.height - this.m * 2, 8);
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

class SpriteEnemy extends Sprite {
    constructor(c, p, s) {
        super(s / 2, c);
        this.points = p;
        this.ca = TWO_PI / this.points;
        this.d = this.s * 0.1 * (this.points);
        this.p = [];
        for (var i = 0; i < this.points; i++) {
            var angle = this.ca * i + HALF_PI;
            var point1 = { "x": Math.cos(angle) * this.s, "y": Math.sin(angle) * this.s };
            angle += this.ca / 2;
            var point2 = { "x": Math.cos(angle) * this.d, "y": Math.sin(angle) * this.d };
            this.p.push(point1, point2);
        }
    }

    sprite() {
        for (var i = 0; i < this.points * 2; i++) {
            var next = this.p[(i + 1) % (this.points * 2)];
            line(this.p[i].x, this.p[i].y, next.x, next.y);
        }
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

class Particle extends Sprite {
    constructor(x, y, c, f, s) {
        super(4, c);
        this.maxframes = f;
        this.maxsize = s;
        this.x = x;
        this.y = y;
        this.frames = 0;

        this.tx = 0;
        this.ty = 0;
        this.ta = 0;
        this.ts = 1;
    }

    finished() {
        return this.frames >= this.maxframes;
    }

    update() {
        this.frames += 1;
    }
}

class ParticlePop extends Particle {
    constructor(x, y, c, f, s) {
        super(x, y, c, f, s);
    }

    sprite() {
        push();
        var currentsize = this.maxsize * this.frames / this.maxframes;
        var strokeweight = 1 - this.frames / this.maxframes;
        strokeWeight(strokeweight);
        ellipse(this.x, this.y, currentsize, currentsize);
        pop();
    }
}

class ParticleExplode extends Particle {
    constructor(x, y, c, f, s) {
        super(x, y, c, f, s);
        this.angle1 = Math.random() * TWO_PI;
        this.angle2 = Math.random() * TWO_PI;
        this.angle3 = Math.random() * TWO_PI;
        this.delay1 = this.maxframes / 2;
        this.delay2 = this.maxframes / 3;
    }

    sprite() {
        push();
        var width1 = this.maxsize * (this.frames - this.delay1) / (this.maxframes - this.delay1);
        var width2 = this.maxsize * (this.frames - this.delay2) / (this.maxframes - this.delay2);
        var width3 = this.maxsize * this.frames / this.maxframes;
        var height = this.maxsize / 8 * this.frames / this.maxframes;
        var strokeweight = 1 - this.frames / this.maxframes;
        strokeWeight(strokeweight);
        rotateWithAnchor(this.x, this.y, this.angle1);
        ellipse(this.x, this.y, width1, height);
        rotateWithAnchor(this.x, this.y, this.angle2);
        ellipse(this.x, this.y, width2, height);
        rotateWithAnchor(this.x, this.y, this.angle3);
        ellipse(this.x, this.y, width3, height);
        pop();
    }
}