//https://portal.codewithus.com/student/lectures/JavaScript/10    1-15

//Variables
let player;

//Main Functions
function setup() {
    createCanvas(500, 500);
    player = new Player();
}

function draw() {
    background(0);
    player.draw;
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
    }
    draw() {
        image(playerImage, this.x, this.y, this.w, this.h);
        //images(playerImage, this.x, this.y, this.w, this.h);
    }
}