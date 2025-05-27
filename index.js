//https://portal.codewithus.com/student/lectures/JavaScript/10    2-16

//Variables
let player;
let projectiles;

//Main Functions
function setup() {
    createCanvas(500, 500);
    player = new Player();
    projectiles = new Projectile(250, 450);
    projectiles2 = []
}

function draw() {
    background(0);
    player.update();
    projectiles2 = projectiles2.filter((p) => {
        return p.y > -p.h && p.x > -p.w && p.x < 500 && p.y < 500; 
    });
    projectiles.update();
    for(let p of projectiles2) {
        p.update();
    }
}

//Other Functions

//images.js
// let playerImages = []
let playerImage;

function preload() {
    // playerImages.push(loadImages("br.png"));
    // playerImages.push(loadImages("re.png"));
    // playerImages.push(loadImages("sp.png"));
    // playerImages.push(loadImages("ed.png"));
    // playerImages.push(loadImages("mi.png"));
    // playerImages.push(loadImages("ma.png"));

    playerImage = loadImage("br.png")
}

//player.js
class Player {
    constructor() {
        this.x = 225;
        this.y = 450;
        this.w = 50;
        this.h = 50;

        this.speed = 5;
    }
    draw() {
        image(playerImage, this.x, this.y, this.w, this.h);
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
        if(register[32]) {
            //player's x position plus half the player's width and then minus half the projectile's width (20 / 2 === 10)
            let x = 
            projectiles.push(new Projectile(x, this.y));
        }
    }

    update() {
        this.draw();
        this.move();
        this.shoot();
    }
}

//input.js
let register = {};

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