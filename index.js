//https://portal.codewithus.com/student/lectures/JavaScript/10    7-

//Variables
let player;
let projectiles;
let enemies;
let level;
let gameState = "start";
let selectedImage = null;
let allCharacters = [];
let score;
let highScore = 0;
let boss = null;
let bossFight = false;
let characterImages = [];
let enemyImages = [];
let adjustedHeight;
let adjustedWidth;
let playing = true;

//Main Functions
function windowResized() {
  resizeCanvas(windowWidth - 20, windowHeight - 150);
  adjustedHeight = windowHeight - 150;
  adjustedWidth = windowWidth - 20;
}

function setup() {
    createCanvas(windowWidth - 20, windowHeight - 150);
    adjustedHeight = windowHeight - 150;
    adjustedWidth = windowWidth - 20;

    player = new Player();
    projectiles = [];
    enemies = [];  
    
    level = 0;
    playing = true;
    score = 0;
}

function draw() {
    background(0);

    if (gameState === "start") {
        drawStartScreen();
        return;
    }

    if (gameState === "gameover") {
        fill(255);
        textSize(72);
        textAlign(CENTER, CENTER);
        text("GAME OVER", adjustedWidth / 2, adjustedHeight / 2);
        return;
    }

    fill(255);
    textSize(24);
    textAlign(LEFT, TOP);
    text("Score: " + score, 10, 10);

    textAlign(RIGHT, TOP);
    text("High Score: " + highScore, adjustedWidth - 10, 10);

    checkLevel();
    player.update();

    projectiles = projectiles.filter((p) => {
        return p.y > -p.h && p.x > -p.w && p.x < adjustedWidth && p.y < adjustedHeight && p.active; 
    });

    enemies = enemies.filter((e) => e.active);

    for (let p of projectiles) {
        p.update();
    }

    for (let e of enemies) {
        e.update();
    }

    checkCollision();

    if (bossFight && boss && boss.active) {
        boss.update();

        let barWidth = 300;
        let barHeight = 20;
        let barX = (adjustedWidth / 2) - (barWidth / 2);
        let barY = adjustedHeight - 30;

        // Draw boss name above health bar
        fill(255);
        textSize(20);
        textAlign(CENTER, BOTTOM);
        text(boss.name, adjustedWidth / 2, barY - 10);

        // Draw boss health bar
        fill(255, 0, 0);
        rect(barX, barY, map(boss.hp, 0, 20, 0, barWidth), barHeight);
        noFill();
        stroke(255);
        rect(barX, barY, barWidth, barHeight);
    }
}

//Other Functions
function checkCollision() {
    // Player projectiles hit enemies
    for (let p of projectiles) {
        if (p.type === "player") {
            for (let e of enemies) {
                if (e.active && collision(p, e)) {
                    p.active = false;
                    e.active = false;

                    score += 10;
                    if (score > highScore) {
                        highScore = score;
                    }
                }
            }
        }
    }

    // Enemy projectiles hit player
    for (let p of projectiles) {
        if (p.type !== "player" && collision(player, p)) {
            gameState = "gameover";
            playing = false;

            background(0);
            fill(255);
            textSize(72);
            textAlign(CENTER, CENTER);
            text("GAME OVER", adjustedWidth / 2, adjustedHeight  / 2);

            noLoop(); 
            return;
        }
    }

    // Enemies hit player
    for (let e of enemies) {
        if (collision(player, e)) {
            gameState = "gameover";
            playing = false;

            background(0);
            fill(255);
            textSize(72);
            textAlign(CENTER, CENTER);
            text("GAME OVER", adjustedWidth / 2, adjustedHeight  / 2);

            noLoop();
            return;
        }
    }

    // Boss fight collisions
    if (bossFight && boss && boss.active) {
        // Player projectiles hit boss
        for (let p of projectiles) {
            if (p.type === "player" && collision(p, boss)) {
                p.active = false;
                boss.hp--;
                if (boss.hp <= 0) {
                    boss.active = false;
                    bossFight = false;
                    level++;
                    score += 100; 
                }
            }
        }

        // Boss hits player
        if (collision(player, boss)) {
            gameState = "gameover";
            playing = false;
            noLoop();
            return;
        }
    }

    // NEW: Player projectiles collide with enemy projectiles
    for (let i = 0; i < projectiles.length; i++) {
        let p1 = projectiles[i];
        if (p1.type === "player" && p1.active) {
            for (let j = 0; j < projectiles.length; j++) {
                let p2 = projectiles[j];
                if (p2.type !== "player" && p2.active) {
                    if (collision(p1, p2)) {
                        p1.active = false;
                        p2.active = false;
                    }
                }
            }
        }
    }
}

function checkLevel() {
    if (!bossFight && level === 3 && enemies.length === 0) {
        boss = new Boss(200, 50);
        bossFight = true;
        return;
    }

    if (!bossFight && enemies.length === 0) {
        level++;
        for (let i = 0; i < level; i++) {
            let coinFlip = round(random(0, 1));
            if (coinFlip === 0) {
                enemies.push(new Enemy(random(0, adjustedWidth), -100, "bomber"));
            } else {
                enemies.push(new Enemy(adjustedWidth + 100, random(0, adjustedHeight  - 150), "strafer"));
            }
        }
    }
}

function collision(obj1, obj2) { 
    if(obj1.x < obj2.x + obj2.w && 
       obj1.x + obj1.w > obj2.x &&
       obj1.y < obj2.y + obj2.h && 
       obj1.y + obj1.h > obj2.y) { 
        return true; 
    } else { 
        return false; 
    } 
} 

function drawStartScreen() {
    background(0);  

    fill(255);
    textSize(32);
    textAlign(CENTER, TOP);
    text("Choose Your Character", adjustedWidth / 2, adjustedHeight  / 2 - 120);  

    let imgSize = 100;
    let spacing = 120;
    let totalWidth = (allCharacters.length - 1) * spacing + imgSize;
    let startX = adjustedWidth / 2 - totalWidth / 2;
    let imgY = adjustedHeight  / 2 - imgSize / 2;

    textSize(18);
    for (let i = 0; i < allCharacters.length; i++) {
        let img = allCharacters[i];
        let imgX = startX + i * spacing;

        let isHovering = mouseX > imgX && mouseX < imgX + imgSize && mouseY > imgY && mouseY < imgY + imgSize;

        image(img.img, imgX, imgY, imgSize, imgSize);

        if (isHovering) {
            noFill();
            stroke(31, 133, 207);
            strokeWeight(3);
            rect(imgX, imgY, imgSize, imgSize);
        }

        fill(200);
        textAlign(CENTER, TOP);
        text(characterNames[i], imgX + imgSize / 2, imgY + imgSize + 10);
    }
}

function mousePressed() {
    if (gameState === "start") {
        let imgSize = 100;
        let spacing = 120;
        let totalWidth = (allCharacters.length - 1) * spacing + imgSize;
        let startX = adjustedWidth / 2 - totalWidth / 2;
        let imgY = adjustedHeight  / 2 - imgSize / 2;

        for (let i = 0; i < allCharacters.length; i++) {
            let imgX = startX + i * spacing;

            if (
                mouseX > imgX && mouseX < imgX + imgSize &&
                mouseY > imgY && mouseY < imgY + imgSize
            ) {
                selectedImage = allCharacters[i];
                enemyImages = allCharacters.filter(c => c.img !== selectedImage);

                player = new Player();
                gameState = "playing";
                playing = true;
                loop();
                break;
            }
        }
    } else if (gameState === "gameover") {
        setup();
        gameState = "start";
        playing = true;
        loop();
    }
}

//images.js
let br, mi, re, sp, ed, ma, brod, bro;

function preload() {
    br = loadImage("br.png")
    mi = loadImage("mi.png")
    re = loadImage("re.png")
    sp = loadImage("sp.png")
    ed = loadImage("ed.png")
    ma = loadImage("ma.png")
    brod = loadImage("brod.png")
    bro = loadImage("bro.png")

    allCharacters = [
        { img: br, name: "br" },
        { img: mi, name: "mi" },
        { img: re, name: "re" },
        { img: sp, name: "sp" },
        { img: ed, name: "ed" },
        { img: ma, name: "ma" }
    ];

    // You’ll also want enemy images (excluding selected player)
    characterNames = ["br", "mi", "re", "sp", "ed", "ma"];
} 

    function enemyUpdate() {
        enemies = enemies.filter((e) => {
            return e.active;
        });
        for(e of enemies) {
            e.update();
        }
    }

    function projectileUpdate() {
         projectiles = projectiles.filter((p) => {
        return p.y > -p.h && p.x > -p.w && p.x < 500 && p.y < 500 && p.active; 
    });
        for(let p of projectiles) {
            p.update();
        }
    }

//player.js
class Player {
    constructor() {
    this.w = 80;
    this.h = 80;
    this.x = (adjustedWidth / 2) - (this.w / 2);
    this.y = adjustedHeight  - this.h - 10;
    this.speed = 5;
    this.canShoot = true;
    this.shootTimer = 0;
    this.shootRate = 10;
}
    draw() {
    if (selectedImage) {
        image(selectedImage.img, this.x, this.y, this.w, this.h);
    } else {
        image(br, this.x, this.y, this.w, this.h);
    }
}

    move() {
        if(register[RIGHT_ARROW] && this.x < adjustedWidth - this.w) {
            this.x += this.speed;
        }
        if(register[LEFT_ARROW] && this.x > 0) {
            this.x -= this.speed;
        }
        if(register[UP_ARROW] && this.y > 0) {
            this.y -= this.speed;
        }
        if(register[DOWN_ARROW] && this.y < adjustedHeight - this.h) {
            this.y += this.speed;
        }
    }

    shoot() {
        if(this.canShoot == true){
        if(register[32]) {
            let x = this.x + this.w/2 - 10;
            projectiles.push(new Projectile(x, this.y, "player"));
            this.canShoot = false;
        }
    }
    else {
        if(this.shootTimer == this.shootRate){
            this.canShoot = true;
            this.shootTimer = 0;
        } else {
            this.shootTimer ++;
        }
    }
}
    update() {
        this.draw();
        this.move();
        this.shoot();
    }
}

//input.js
const register = {};

function keyPressed() {
    register[keyCode] = true;
}

function keyReleased() {
    register[keyCode] = false;
}

window.addEventListener("keydown", function(e) {
    if ([37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);

//projectile.js
class Projectile {
    constructor(x, y, type, dx = 0, dy = -1) {
        this.active = true;
        this.x = x;
        this.y = y;
        this.type = type;
        this.w = 40;
        this.h = 40;
        this.speed = 7;

        this.dx = dx;
        this.dy = dy;
    }

    draw() {
        if(this.type == "player") {
            image(bro, this.x, this.y, this.w, this.h);
        } else {
            image(brod, this.x, this.y, this.w, this.h);
        }
    }

    move() {
        this.x += this.dx * this.speed;
        this.y += this.dy * this.speed;
    }

    update() {
        this.draw();
        this.drawColliders();
        this.move();
    }

    drawColliders() {
        noFill();
        stroke(255);
        rect(this.x, this.y, this.w, this.h);
    }
}

//enemy.js
class Enemy {
    constructor(x, y, type) {
        this.active = true;
        this.x = x;
        this.y = y;

        this.type = type;

        this.w = 40;
        this.h = 40;

        this.speed = 7;

        this.canMove = true;
        this.shootTimer = 0;
        this.shootRate = 45;

        if (this.type === "bomber" || this.type === "strafer") {
            this.img = random(enemyImages).img;
        }
    }

    draw() {
        image(this.img, this.x, this.y, this.w, this.h);
    }

    move() {
        if(this.type == "bomber") {
            this.y += this.speed;
            if(this.y > adjustedHeight) {
                this.y = -100;
                this.x = random(0, adjustedWidth - this.w);
            }
        }
        if(this.type == "strafer") {
            this.x += this.speed;
            if(this.x >= adjustedWidth) {
                this.speed = -7;
            }
            if(this.x <= 0) {
                this.speed = 7;
            }
        }
    }

    checkShoot() {
        this.shootTimer ++;

        if(this.shootTimer == this.shootRate) {
            this.shootTimer = 0;
            if(this.canMove) {
                this.canMove = false;
                this.shoot();
            } else {
                this.canMove = true;
            }
        }
    }

    shoot() {
    if (this.type === "strafer") {
        let x = this.x + (this.w / 2) - 10;
        let y = this.y + this.h;
        projectiles.push(new Projectile(x, y, "strafer", 0, 1));
    }

    if (this.type === "bomber") {
        let y1 = this.y + (this.h / 2) - 10;

        let x1 = this.x - 20;
        projectiles.push(new Projectile(x1, y1, "bomber", -1, 0));

        let x2 = this.x + this.w;
        projectiles.push(new Projectile(x2, y1, "bomber", 1, 0));
    }
}


    update() {
        this.draw();
        this.move();
        this.checkShoot();
    }
}

//Boss.js
class Boss {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.w = 160;
        this.h = 160;
        this.hp = 20;
        this.active = true;
        this.speed = 2;
        this.shootTimer = 0;
        this.shootRate = 30;

        // Select from enemyImages which now contains objects with both img and name
        let character = random(enemyImages);
        this.img = character.img;
        this.name = character.name;
    }

    draw() {
        image(this.img, this.x, this.y, this.w, this.h);
    }

    move() {
        this.x += this.speed;
        if (this.x <= 0 || this.x + this.w >= adjustedWidth) {
            this.speed *= -1;
        }
    }

    shoot() {
        let p1 = new Projectile(this.x + 20, this.y + this.h, "bomber", 0, 1);
        let p2 = new Projectile(this.x + this.w - 40, this.y + this.h, "bomber", 0, 1);
        projectiles.push(p1, p2);
    }

    update() {
        this.draw();
        this.move();
        this.shootTimer++;
        if (this.shootTimer >= this.shootRate) {
            this.shoot();
            this.shootTimer = 0;
        }
    }
}