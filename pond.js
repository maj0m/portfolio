let fish = [];

function setup() {
  angleMode(DEGREES);
    createCanvas(window.innerWidth, window.innerHeight);
    
    for(let i = 0; i < 3; i++) {
        fish.push(new Koi());
    }
}

function draw() {
    background(150, 190, 200);

    for (let i = 0; i < fish.length; i++) {
        fish[i].update();
        fish[i].draw();
    }
}

function windowResized() {
    resizeCanvas(window.innerWidth, window.innerHeight);
}