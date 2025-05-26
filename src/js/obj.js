class GameObject {
    constructor(x, y, w, h, r) {
        this.coordinates = { "x": x, "y": y }; // center of object
        this.dimensions = { "width": w, "height": h }; // for drawing
        this.radius = r; // hitbox
    }

    get c() { return this.coordinates; }
    get d() { return this.dimensions; }
    get x() { return this.c.x; }
    get y() { return this.c.y; }
    get w() { return this.d.width; }
    get h() { return this.d.height; }
    get r() { return this.radius; }

    isColliding(other) {
        return circleCollide(this.c, other.c, this.r, other.r);
    }

    drawSprite() {
        push();
        stroke(Colors.BLACK);
        noFill();
        rect(this.x, this.y, this.w, this.h);
        pop();
    }

    drawHitbox() {
        push();
        stroke(Colors.RED);
        noFill();
        ellipse(this.x, this.y, this.r, this.r);
        pop();
    }
}

class Player extends GameObject {
    constructor() {
        super(100, 100, 50, 50, 20);
    }
}