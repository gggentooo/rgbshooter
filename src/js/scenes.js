class SceneManager {
    loadScenes() {
        this.gameover = new GSGameOver();
        this.gameclear = new GSGameClear();

        this.test2 = new GSBTest2(this.gameclear);
        this.test1 = new GSBTest1(this.test2);
        this.d_prologue = new GameSceneDialogue(this.test1, "prologue");

        this.title = new GSTitle(this.d_prologue);
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
    end() { this.finished_ending = true; }
    update() {
        this.currentframe = frameCount - this.startframe;
    }
    sceneFinished() { }
    draw() {
        game.drawObjects();
        game.drawStatus();
        game.drawParticles();
        if (game.debug === true) {
            game.debugText(8, 16);
            game.drawBoundary();
        }
    }
}

class GameSceneDialogue extends GameScene {
    constructor(n, what) {
        super(n);
        this.what = what;
        this.content = null;
        this.content_idx = 0;
        this.char_idx = 0;
        this.currentstr = "";
        this.printstr = "";
        this.finished = false;
    }
    sceneFinished() { return this.finished; }
    initialize() {
        super.initialize();
        this.content = dialoguedata[this.what];
        this.currentstr = this.content[this.content_idx]["content"].split('');
        this.namestr = this.content[this.content_idx]["name"];
        this.clrstr = this.content[this.content_idx]["color"];
        this.sprstr = this.content[this.content_idx]["sprite"];
    }
    chooseTextbox(str) {
        switch (str) {
            case "K":
                return game.spr.textbox_black;
            case "R":
                return game.spr.textbox_red;
            case "G":
                return game.spr.textbox_green;
            case "B":
                return game.spr.textbox_blue;
        }
    }
    choosePortrait(str) {
        switch (str) {
            default:
                return game.spr.portrait_placeholder;
        }
    }
    update() {
        super.update();
        game.updateParticles();
        if (this.char_idx >= this.currentstr.length) {
            if (KeyDown.Z) {
                if (this.content_idx >= this.content.length - 1) {
                    this.finished = true;
                } else {
                    this.char_idx = 0;
                    this.content_idx += 1;
                    this.printstr = "";
                    this.currentstr = this.content[this.content_idx]["content"].split('');
                    this.namestr = this.content[this.content_idx]["name"];
                    this.clrstr = this.content[this.content_idx]["color"];
                }
            }
        } else {
            this.printstr += this.currentstr[this.char_idx];
            this.char_idx += 1;
        }
    }
    draw() {
        super.draw();
        this.chooseTextbox(this.clrstr).draw(Game.GAMEWIDTH / 2, 500, 0, 1);
        this.choosePortrait(this.sprstr).draw(390, 420, 0, 1);
        push();
        noStroke();
        fill(Colors.WHITE);
        textFont(textbox_font, 18);
        text(this.namestr, Game.GAMEWIDTH / 2, 440, 400);
        textFont(textbox_font, 16);
        text(this.printstr, Game.GAMEWIDTH / 2, 475, 400);
        if (this.char_idx >= this.currentstr.length) {
            fill(Colors.WHITE_200);
            textFont(textbox_font, 14);
            text("Z ➤", Game.GAMEWIDTH - 80, 560);
        }
        pop();
    }
}

class GameSceneBattle extends GameScene {
    constructor(n) {
        super(n);
        this.enemies = [];
    }
    sceneFinished() {
        return (game.enemies <= 0);
    }
    initialize() {
        super.initialize();
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
    initialize() {
        super.initialize();
        this.spawnEnemy("e1", Game.GAMEWIDTH / 2, -25, 16, 12, "K", 5, 0, 20, Movement.D_2, 1200);
        this.spawnEnemy("e2", Game.GAMEWIDTH / 2 - 150, -25, 16, 12, "G", 4, 0, 300, Movement.D_3, 1200);
        this.spawnEnemy("e3", Game.GAMEWIDTH / 2 + 150, -25, 16, 12, "B", 4, 0, 320, Movement.D_3, 1200);
        this.spawnEnemy("e4", Game.GAMEWIDTH / 2, -25, 16, 12, "R", 5, 0, 500, Movement.D_3, 1200);
        this.enemies["e1"].addShotSource(PI, 4, 48);
        this.enemies["e2"].addShotSource(PI, 4, 42);
        this.enemies["e3"].addShotSource(PI, 4, 42);
        this.enemies["e4"].addShotSource(PI, 4, 42);
    }
}
class GSBTest2 extends GameSceneBattle {
    constructor(n) {
        super(n);
    }
    initialize() {
        super.initialize();
        var idx = 0;
        for (; idx < 10; idx++) {
            var id = "e" + String(idx + 1);
            this.spawnEnemy(id, 400, -50, 16, 12, "K", 5, 1, idx * 20, Movement.RL_ARC_1, 500);
            this.spawnEnemy(id + 10, 0, -50, 16, 12, "R", 5, -1, idx * 20 + 80, Movement.LR_ARC_1, 500);
            this.spawnEnemy(id + 20, 400, -50, 16, 12, "G", 5, -1, idx * 20 + 160, Movement.RL_ARC_1, 500);
            this.spawnEnemy(id + 30, 0, -50, 16, 12, "B", 5, 1, idx * 20 + 240, Movement.LR_ARC_1, 500);
            for (var j = 0; j < 5; j++) {
                this.enemies[id].addShotSource(PI + j * TWO_PI / 5, 6, 12);
                this.enemies[id + 10].addShotSource(PI + j * TWO_PI / 5, 6, 12);
                this.enemies[id + 20].addShotSource(PI + j * TWO_PI / 5, 6, 12);
                this.enemies[id + 30].addShotSource(PI + j * TWO_PI / 5, 6, 12);
            }
        }
        this.spawnEnemy("e" + String(idx + 1), Game.GAMEWIDTH / 2, -25, 20, 16, "K", 7, 1, 300, Movement.D_1, 1200);
        for (var j = 0; j < 14; j++) {
            this.enemies["e" + String(idx + 1)].addShotSource(PI + j * TWO_PI / 14, 8, 12);
            this.enemies["e" + String(idx + 1)].addShotSource(PI + j * TWO_PI / 14 + TWO_PI / 14, 8, 10);
        }
    }
}

class GSTitle extends GameScene {
    constructor(n) {
        super(n);
        this.gamestart = false;

        this.c_gs = { "x": 190, "y": 230 };
        this.c_lang = { "x": 190, "y": 260 };
        this.c_tutorial = { "x": 190, "y": 290 };
        this.c_en = { "x": 380, "y": 260 };
        this.c_ko = { "x": 480, "y": 260 };
        this.t_yes = { "x": 380, "y": 290 };
        this.t_no = { "x": 480, "y": 290 };
        this.cursorpositions = [this.c_gs, this.c_lang, this.c_tutorial];
        this.cursor_idx = 0;
        this.cursor = this.cursorpositions[this.cursor_idx];
        this.langpositions = [this.c_en, this.c_ko];
        this.langstrings = ["en", "ko"];
        this.lang_idx = 0;
        this.lang = this.langpositions[this.lang_idx];
        this.tpositions = [this.t_yes, this.t_no];
        this.t_idx = 1;
        this.tutorial = this.tpositions[this.t_idx];
        this.cursortimer = 0;
    }
    sceneFinished() {
        return this.gamestart;
    }
    end() {
        dialoguedata = dialoguedata[lang_global];
        this.finished_ending = true;
    }
    draw() {
        background(Colors.WHITE);
        game.obj[0].sprite.draw(200, 190, -0.2, 1);
        game.obj[1].sprite.draw(220, 180, 0.1, 1);
        game.obj[2].sprite.draw(240, 200, 0.2, 1);
        push();
        stroke(Colors.WHITE);
        strokeWeight(2);
        fill(Colors.BLACK);
        textFont("Quicksand", 24);
        text("RGBshooter", 200, 200);
        textFont("Quicksand", 18);
        text("Start Game", 200, 240);
        text("Language", 200, 270);
        text("Play Tutorial?", 200, 300);
        textFont("IBM Plex Sans KR", 16);
        text("English", 390, 270);
        text("한국어", 490, 270);
        text("Yes", 390, 300);
        text("No", 490, 300);
        fill(Colors.BLACK_200);
        textFont("IBM Plex Sans KR", 14);
        text("Z: Select\nArrow keys: Move cursor", 60, 560);
        pop();
        game.spr.cursor.draw(this.cursor.x, this.cursor.y, -HALF_PI, 1);
        game.spr.cursor.draw(this.lang.x, this.lang.y, -HALF_PI, 1);
        game.spr.cursor.draw(this.tutorial.x, this.tutorial.y, -HALF_PI, 1);
        game.drawParticles();
    }
    update() {
        if (this.cursortimer > 0) {
            this.cursortimer -= 1;
            return;
        }
        if (KeyDown.DOWN) {
            this.cursor_idx += 1;
            this.cursortimer = 12;
        }
        if (KeyDown.UP) {
            this.cursor_idx -= 1;
            this.cursortimer = 12;
        }
        if (KeyDown.LEFT && this.cursor_idx === 1) {
            this.lang_idx -= 1;
            this.cursortimer = 12;
        }
        if (KeyDown.RIGHT && this.cursor_idx === 1) {
            this.lang_idx += 1;
            this.cursortimer = 12;
        }
        if (KeyDown.LEFT && this.cursor_idx === 2) {
            this.t_idx -= 1;
            this.cursortimer = 12;
        }
        if (KeyDown.RIGHT && this.cursor_idx === 2) {
            this.t_idx += 1;
            this.cursortimer = 12;
        }
        if (KeyDown.Z && this.cursor_idx === 0) {
            this.gamestart = true;
        }
        this.cursor_idx = (this.cursorpositions.length + this.cursor_idx) % this.cursorpositions.length;
        this.cursor = this.cursorpositions[this.cursor_idx];
        this.lang_idx = (this.langpositions.length + this.lang_idx) % this.langpositions.length;
        this.lang = this.langpositions[this.lang_idx];
        lang_global = this.langstrings[this.lang_idx];
        this.t_idx = (this.tpositions.length + this.t_idx) % this.tpositions.length;
        this.tutorial = this.tpositions[this.t_idx];
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
        text("Game Over!\nToo bad...\n\nRefresh page to restart.", 200, 200);
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
        text("Game Clear!\nRefresh page to restart.", 200, 200);
    }
}