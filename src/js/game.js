class Game {
    constructor() {
        this.objects = [];
    }
    get obj() { return this.objects; }

    initialize() {
        var o1 = new GameObject(10, 10, 12, 12, 10);
        var o2 = new GameObject(15, 20, 16, 16, 10);
        this.obj.push(o1, o2);
        this.obj.push(new Player())
    }

    drawObjects() {
        for (var i = 0; i < this.obj.length; i++) {
            this.obj[i].drawSprite();
            this.obj[i].drawHitbox();
        }
    }
}