class SceneManager {
    loadScenes() {
        this.gameover = new GSGameOver();
        this.gameclear = new GSGameClear();
        this.test2 = new GSBTest2(this.gameclear);
        this.test1 = new GSBTest1(this.test2);
    }
}

class GameScene {
    constructor(n) {
        this.nextscene = n;
        this.finished_ending = false;
        this.currentframe = 0;
    }
    get next() { return this.nextscene; }
    initialize() {
        this.startframe = frameCount;
    }
    end() { }
    update() {
        this.currentframe = frameCount - this.startframe;
    }
    sceneFinished() { }
    draw() {
        game.drawObjects();
        game.drawParticles();
        game.drawStatus();
        if (game.debug === true) {
            game.debugText(8, 16);
            game.drawBoundary();
        }
    }
}

class GameSceneDialogue extends GameScene {
    constructor(n) {
        super(n);
    }
    update() {
        super.update();
        game.updateParticles();
    }
}

class GameSceneBattle extends GameScene {
    constructor(n) {
        super(n);
        this.enemies = [];
    }
    initialize() {
        super.initialize();
        // var edata = enemydata[idx];
        // for (var i = 0; i < edata.length; i++) {
        //     var d = edata[i];
        //     this.spawnEnemy(d.id, d.x, d.y, d.displaysize, d.hitsize, d.color, d.points, d.rotatespeed, d.delay, d.movement, d.lifespan);
        //     var ss = d.shotsources;
        //     for (var j = 0; j < ss.length; j++) {
        //         var source = ss[j];
        //         this.enemies[d.id].addShotSource(PI + source.angle * TWO_PI / d.points, source.speed, source.firerate);
        //     }
        // }
    }
    end() {
        for (var i = 0; i < game.obj.length; i++) {
            game.obj[i].destruct();
        }
        this.enemies.splice(0, this.enemies.length);
        if (game.obj.length === 3) {
            this.finished_ending = true;
        }
    }
    spawnEnemy(id, x, y, ds, hs, c, p, rsp, d, m, lfsp) {
        this.enemies[id] = new Enemy(x, y, ds, hs, c, p, rsp, d, m, lfsp);
        game.obj.push(this.enemies[id]);
    }
    update() {
        if (this.sceneFinished()) { return; }
        super.update();
        game.checkDebugMode();
        game.checkColorSwap();
        game.updateObjects();
        game.updateParticles();
    }
}

class GSBTest1 extends GameSceneBattle {
    constructor(n) {
        super(n);
    }
    sceneFinished() {
        return (game.enemies <= 0);
    }
    initialize() {
        super.initialize();
        var mov1 = [
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
        var mov2 = [
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
        var mov3 = [
            {
                "frames": 0,
                "xacc": 0,
                "yacc": 0.2
            },
            {
                "frames": 16,
                "xacc": 0,
                "yacc": -0.1
            },
            {
                "frames": 48,
                "xacc": 0,
                "yacc": 0
            }
        ]
        var idx = 0;
        for (; idx < 10; idx++) {
            var id = "e" + String(idx + 1);
            this.spawnEnemy(id, 400, -50, 16, 12, "K", 5, 1, idx * 20, mov1, 500);
            this.spawnEnemy(id + 10, 0, -50, 16, 12, "R", 5, -1, idx * 20 + 80, mov2, 500);
            this.spawnEnemy(id + 20, 400, -50, 16, 12, "G", 5, -1, idx * 20 + 160, mov1, 500);
            this.spawnEnemy(id + 30, 0, -50, 16, 12, "B", 5, 1, idx * 20 + 240, mov2, 500);
            for (var j = 0; j < 5; j++) {
                this.enemies[id].addShotSource(PI + j * TWO_PI / 5, 6, 12);
                this.enemies[id + 10].addShotSource(PI + j * TWO_PI / 5, 6, 12);
                this.enemies[id + 20].addShotSource(PI + j * TWO_PI / 5, 6, 12);
                this.enemies[id + 30].addShotSource(PI + j * TWO_PI / 5, 6, 12);
            }
        }
        this.spawnEnemy("e" + String(idx + 1), Game.GAMEWIDTH / 2, -25, 20, 16, "K", 7, 1, 300, mov3, 1200);
        for (var j = 0; j < 7; j++) {
            this.enemies["e" + String(idx + 1)].addShotSource(PI + j * TWO_PI / 14, 8, 12);
            this.enemies["e" + String(idx + 1)].addShotSource(PI + j * TWO_PI / 14 + TWO_PI / 14, 8, 10);
        }
    }
}
class GSBTest2 extends GameSceneBattle {
    constructor(n) {
        super(n);
    }
    sceneFinished() {
        return (game.enemies <= 0);
    }
    initialize() {
        super.initialize();
    }
}

class GSGameOver extends GameScene {
    constructor() {
        super(null);
    }
    draw() {
        background(Colors.WHITE);
        noStroke();
        fill(Colors.BLACK);
        text("Game Over!\nRefresh page to restart.", 100, 100);
    }
}
class GSGameClear extends GameScene {
    constructor() {
        super(null);
    }
    draw() {
        background(Colors.WHITE);
        noStroke();
        fill(Colors.BLACK);
        text("Game Clear!\nRefresh page to restart.", 100, 100);
    }
}