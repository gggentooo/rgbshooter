class Colors {
    static get BLACK() { return color(0, 0, 0); }
    static get RED() { return color(255, 0, 0); }
}

function distBetweenSquared(c1, c2) {
    var dx = Math.abs(c1.x - c2.x);
    var dy = Math.abs(c1.y - c2.y);
    return (dx * dx + dy * dy);
}

function circleCollide(c1, c2, r1, r2) {
    var rsum = r1 + r2;
    return (rsum * rsum >= distBetweenSquared(c1, c2));
}