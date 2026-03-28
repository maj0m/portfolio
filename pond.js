let fish = [];
let pellets = [];
let ripples = [];
let lilypads = [];

function setup() {
    angleMode(DEGREES);
    createCanvas(window.innerWidth, window.innerHeight);

    for(let i = 0; i < 12; i++) {
        fish.push(new Koi());
    }

    for(let i = 0; i < 8; i++) {
        lilypads.push(new Lilypad(lilypads));
    }
}

function draw() {
    background(180, 210, 200);

    const shadowColor = color(167, 192, 184);

    const dt = min(deltaTime / 1000, 0.1); // Capped so switching windows doesnt break movement

    // Shadows
    for(let koi of fish) {
        koi.drawShadow(shadowColor);
    }

    for(let pellet of pellets) {
        pellet.drawShadow(shadowColor);
    }

    for(let lilypad of lilypads) {
        lilypad.drawShadow(shadowColor)
    }

    // Objects
    for(let koi of fish) {
        koi.update(pellets, dt);
        koi.draw();
    }

    for(let ripple of ripples) {
        ripple.update(dt);
        ripple.draw();
    }

    for(let lilypad of lilypads) {
        lilypad.update(ripples, dt);
        lilypad.draw();
    }

    for(let pellet of pellets) {
        pellet.update(ripples, dt);
        pellet.draw();
    }
}

function mouseClicked() {
    if(event.target.closest("a, section, button")) return;
    
    let clickPos = createVector(mouseX, mouseY);
    for(let lilypad of lilypads) {
        if(clickPos.dist(lilypad.pos) < lilypad.radius) {
            lilypad.bob();
            return;
        }
    }
    
    pellets.push(new Pellet(clickPos.x, clickPos.y));
}

function windowResized() {
    resizeCanvas(window.innerWidth, window.innerHeight);
}