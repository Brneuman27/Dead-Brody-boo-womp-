//https://portal.codewithus.com/student/lectures/JavaScript/10    1-15

//Variables

//Main Functions
function setup() {
    createCanvas(500, 500);
}

function draw() {
    background(0);
    //Image(playerImages, 225, 450, 50, 50);
    Image(playerImage, 225, 450, 50, 50);
}

//Preloader
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

//Other Functions