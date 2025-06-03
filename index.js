//https://portal.codewithus.com/student/lectures/JavaScript/10    3-8(enemy randomiser), 3-11(current step)

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
}

function draw() {
    background(0);
    checkLevel;
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
}

//Other Functions
function checkLevel() {
    if(enemies.length === 0) {
        level += 1;
        for(let i = 0; i < level; i++) {
            enemies.push(new Enemy(random(0, 450), -100));
        }
    }
}

//images.js
// let playerImages = []
let br, mi, re, sp, ed, ma;

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
            projectiles.push(new Projectile(x, this.y));
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
    constructor(x, y) {
        this.x = x;
        this.y = y;

        this.w = 20;
        this.h = 20;

        this.speed = 7;
    }

    draw() {
        fill(255, 0, 0);
        stroke(255, 0, 0);
        textSize(18);
        textAlign(CENTER, CENTER);
        text("|", this.x, this.y, this.w, this.h);
    }

    move() {
            this.y -= this.speed;
    }

    update() {
        this.draw();
        this.move();
    }
}

//enemies.js
class Enemy {
    constructor(x, y) {
        this.x = x;
        this.y = y;

        this.w = 20;
        this.h = 20;

        this.speed = 7;
    }

    draw() {
        image(re, this.x, this.y, this.w, this.h);
    }

    move() {
        this.y += this.speed
    }

    update() {
        this.draw();
        this.move();
        this.shoot();
    }
}