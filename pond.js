let fish = [];

function setup() {
    angleMode(DEGREES);
    createCanvas(window.innerWidth, window.innerHeight);

    for(let i = 0; i < 16; i++) {
        fish.push(new Koi());
    }
}

function draw() {
    background(180, 210, 200);
    
    for (let koi of fish) {
        koi.drawShadow();
    }
    
    for (let koi of fish) {
        koi.update();
        koi.draw();
    }
}

function windowResized() {
    resizeCanvas(window.innerWidth, window.innerHeight);
}