class Colors {
    static get BLACK() { return color(10, 6, 20); }
    static get BLACK_80() { return color(10, 6, 20, 80); }
    static get BLACK_200() { return color(10, 6, 20, 200); }
    static get WHITE() { return color(251, 250, 252); }
    static get WHITE_80() { return color(251, 250, 252, 80); }
    static get WHITE_200() { return color(251, 250, 252, 200); }
    static get RED() { return color(250, 22, 76); }
    static get GREEN() { return color(4, 192, 9); }
    static get BLUE() { return color(40, 59, 235); }
}

class KeyDown {
    static get SHIFT() { return keyIsDown(16); }
    static get Z() { return keyIsDown(90); }
    static get X() { return keyIsDown(88); }
    static get C() { return keyIsDown(67); }
    static get D() { return keyIsDown(68); }
    static get LEFT() { return keyIsDown(37); }
    static get RIGHT() { return keyIsDown(39); }
    static get UP() { return keyIsDown(38); }
    static get DOWN() { return keyIsDown(40); }
}

function distBetweenSquared(c1, c2) {
    var dx = Math.abs(c1.x - c2.x);
    var dy = Math.abs(c1.y - c2.y);
    return (dx * dx + dy * dy);
}

function distBetween(c1, c2) {
    return Math.sqrt(distBetweenSquared(c1, c2));
}

function circleCollide(c1, c2, r1, r2) {
    var rsum = r1 + r2;
    return (rsum * rsum >= distBetweenSquared(c1, c2));
}

function rotateWithAnchor(x, y, a) {
    translate(x, y);
    rotate(a);
    translate(-x, -y);
}

class Movement {
    static get RL_ARC_1() {
        return [
            {
                "frames": 0,
                "xacc": 0.1,
                "yacc": 0.08
            },
            {
                "frames": 16,
                "xacc": 0,
                "yacc": 0
            },
            {
                "frames": 20,
                "xacc": -0.1,
                "yacc": 0.05
            },
            {
                "frames": 32,
                "xacc": -0.05,
                "yacc": 0
            }
        ];
    }
    static get LR_ARC_1() {
        return [
            {
                "frames": 0,
                "xacc": -0.1,
                "yacc": 0.08
            },
            {
                "frames": 16,
                "xacc": 0,
                "yacc": 0
            },
            {
                "frames": 20,
                "xacc": 0.1,
                "yacc": 0.05
            },
            {
                "frames": 32,
                "xacc": 0.05,
                "yacc": 0
            }
        ];
    }
    static get D_1() {
        return [
            {
                "frames": 0,
                "xacc": 0,
                "yacc": 0.2
            },
            {
                "frames": 20,
                "xacc": 0,
                "yacc": -0.1
            },
            {
                "frames": 60,
                "xacc": 0,
                "yacc": 0
            }
        ];
    }
    static get D_2() {
        return [
            {
                "frames": 0,
                "xacc": 0,
                "yacc": 0.2
            },
            {
                "frames": 25,
                "xacc": 0,
                "yacc": -0.1
            },
            {
                "frames": 75,
                "xacc": 0,
                "yacc": 0
            }
        ];
    }
    static get D_3() {
        return [
            {
                "frames": 0,
                "xacc": 0,
                "yacc": 0.2
            },
            {
                "frames": 30,
                "xacc": 0,
                "yacc": -0.1
            },
            {
                "frames": 90,
                "xacc": 0,
                "yacc": 0
            }
        ];
    }
}