//https://portal.codewithus.com/student/lectures/JavaScript/10    3-8(enemy randomiser)&4-9(random bullet), 4-17(current step)

//Variables
let player;
let projectiles;
let enemies;
let level = 0;

//Main Functions
function setup() {
    createCanvas(500, 500);
    player = new Player();
    projectiles = [];
    enemies = [];   
    let test = new Projectile(250, 0, "strafer");
    test.speed = 0.1;
    projectiles.push(text);
}

function draw() {
    background(0);
    checkLevel();
    player.update();
    projectiles = projectiles.filter((p) => {
        return p.y > -p.h && p.x > -p.w && p.x < 500 && p.y < 500; 
    });
    for(let p of projectiles) {
        p.update();
    }
    for(e of enemies) {
        e.update();
    }
    checkCollision();
}

//Other Functions
function checkCollision() {
    for(let p of projectiles) {
        if(collision(player, p)) {
            fill(255);
            noStroke();
            textSize(72);
            textAlign(CENTER, CENTER);
            text("GAME OVER", 250, 250);
        }
    }
}

function checkLevel() {
    if(enemies.length === 0) {
        level += 1;
        for(let i = 0; i < level; i++) {
            let coinFlip = round(random(0, 1));
            if(coinFlip === 0) {
            enemies.push(new Enemy(random(0, 450), -100, "bomber"));
            } else {
                enemies.push(new Enemy(600, random(0, 350), "strafer"));
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

//images.js
// let playerImages = []
let br, mi, re, sp, ed, ma, brod;

function preload() {
    // playerImages.push(loadImages("br.png"));
    // playerImages.push(loadImages("re.png"));
    // playerImages.push(loadImages("sp.png"));
    // playerImages.push(loadImages("ed.png"));
    // playerImages.push(loadImages("mi.png"));
    // playerImages.push(loadImages("ma.png"));

    br = loadImage("br.png")
    mi = loadImage("mi.png")
    re = loadImage("re.png")
    sp = loadImage("sp.png")
    ed = loadImage("ed.png")
    ma = loadImage("ma.png")
    brod = loadImage("brod.png")
}

//player.js
class Player {
    constructor() {
        this.x = 225;
        this.y = 450;
        this.w = 50;
        this.h = 50;

        this.speed = 5;

        this.canShoot = true;
        this.shootTimer = 0;
        this.shootRate = 10;
    }
    draw() {
        image(br, this.x, this.y, this.w, this.h);
        //images(playerImage, this.x, this.y, this.w, this.h);
    }

    move() {
        if(register[RIGHT_ARROW] && this.x < 500 - this.w) {
            this.x += this.speed;
        }
        if(register[LEFT_ARROW] && this.x > 0) {
            this.x -= this.speed;
        }
        if(register[UP_ARROW] && this.y > 0) {
            this.y -= this.speed;
        }
        if(register[DOWN_ARROW] && this.y < 500 - this.h) {
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
    if([37, 38, 29, 40].indexOf(e.keycode) > -1) {
        e.preventDefault();
    }
}, false);

//projectile.js
class Projectile {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;

        this.type = type;

        this.w = 20;
        this.h = 20;

        this.speed = 7;
    }

    draw() {
        if(this.type == "player") {
            fill(255, 0, 0);
            stroke(255, 0, 0);
            textSize(18);
            textAlign(CENTER, CENTER);
            text("|", this.x, this.y, this.w, this.h);
        }
        if(this.type == "strafer" || this.type == "bomber") {
            image(brod, this.x, this.y, this.w, this.h);
        }
    }

    move() {
        if(this.type == "player") {
            this.y -= this.speed;
        }
        if(this.type == "strafer") {
            this.y += this.speed
        }
        if(this.type == "bomber") {
            this.x += this.speed
        }
    }

    drawColliders() {
        noFill();
        stroke(255);
        rect(this.x, this.y, this.w, this.h);
    }

    update() {
        this.draw();
        this.drawColliders();
        this.move();
    }
}

//enemies.js
class Enemy {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;

        this.type = type;

        this.w = 20;
        this.h = 20;

        this.speed = 7;
    }

    draw() {
        image(re, this.x, this.y, this.w, this.h);
    }

    move() {
        if(this.type == "bomber") {
            this.y += this.speed
            if(this.y > 500) {
                this.y = -100;
                this.x = random(0, 450);
            }
                
        }
        if(this.type == "strafer") {
            this.x += this.speed;
            if(this.x >= 500) {
                this.speed = -7
            }
            if(this.x <= 0) {
                this.speed = 7
            }
        }
    }

    shoot() {
        if(this.type = "strafer") {
            let x = this.x + (this.w/2) - 10;
            let y = this.y + this.h;
            projectiles.push(new Projectile(x, y, "strafer"));
        }
        if(this.type == "bomber") {
            let x1 = this.x - 20;
            let y = this.y + (this.h/2) - 10
            let p = new Projectile(x1, y, "bomber");
            p.speed = abs(p.speed) * -1;
            projectiles.push(p);

            let x2 = this.x + 20;
            projectiles.push(new Projectiles(x2, y, "bomber"));
        }
    }

    update() {
        this.draw();
        this.move();
        this.shoot();
    }
}