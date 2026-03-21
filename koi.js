const shape = [
            8, 3, 8,    //1
            6, 7, 9,    //2
            6, 9, 9,    //3
            6, 9, 8,    //4
            6, 8, 6,    //5
            6, 6, 4,    //6
            5, 4, 3,    //7
            5, 3, 2,    //8
            5, 2, 1,    //9
            6, 1, 1.5,  //10
];

const palettes = [
    [   
        [35, 32, 30],
        [232, 120, 42],
        [244, 232, 216],
        [236, 222, 204],
        [250, 242, 232],
    ],
    [
        [222, 78, 68],
        [245, 233, 218],
        [236, 224, 208],
        [250, 240, 230],
        [228, 212, 196],
    ],
    [
        [230, 88, 70],
        [210, 72, 58],
        [238, 112, 76],
        [38, 34, 32],
        [245, 233, 218],
        [236, 224, 208],
        [250, 240, 230],
    ],
    [   
        [34, 31, 29],
        [232, 180, 72],
        [245, 200, 98],
    ],
    [
        [244, 232, 216],
        [36, 33, 31],
    ]
];

const DEBUG_MODE = false;

class Koi {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.pos = createVector(random(width), random(height));
        this.dir = createVector(random(-1, 1), random(-1, 1)).normalize();
        this.desiredDir = this.dir.copy();
        this.framesToNextTurn = 500;
        this.swimSpeed = 70.0;
        this.minSwimSpeed = 70.0;
        this.maxSwimSpeed = 120.0;
        this.tailSpeed = 0.15;
        this.minTailSpeed = 0.15;
        this.maxTailSpeed = 0.6;
        this.tailStrength = 0.04;
        this.minTailStrength = 0.04;
        this.maxTailStrength = 0.4;
        this.tailPhase = 0;
        this.scale = 2;

        let paletteData = random(palettes);
        this.colors = paletteData.map(c => color(c[0], c[1], c[2]));
        this.finColor = this.colors[0];

        this.segments = [];
        for(let i = 0; i < shape.length; i+=3) {
            let segmentColor = random(this.colors);

            this.segments.push(new Segment(
                0,
                0,
                shape[i] * this.scale,
                shape[i + 1] * this.scale,
                shape[i + 2] * this.scale,
                segmentColor
            ));
        }
    }

    inBounds(pos) {
        return pos.x > 0 && pos.x < window.innerWidth && pos.y > 0 && pos.y < window.innerHeight;
    }

    avoidBounds(pos) {
        let newDir = this.desiredDir.copy();

        if ((pos.x < 0 && newDir.x < 0) || (pos.x > width && newDir.x > 0)) newDir.x *= -1;
        if ((pos.y < 0 && newDir.y < 0) || (pos.y > height && newDir.y > 0)) newDir.y *= -1;

        this.desiredDir = newDir.normalize();
    }

    fulfillDesire() {
        // Rotate towards desired direction
        let angleThreshold = 2;
        let turnSpeed = 120 * (deltaTime / 1000);
        let angle = this.dir.angleBetween(this.desiredDir);    
        if(angle > angleThreshold) this.dir.rotate(turnSpeed);
        else if(angle < -angleThreshold) this.dir.rotate(-turnSpeed);
    }

    update() {
        let sensorPos = this.pos.copy().add(this.dir.copy().mult(120));

        // Change direction
        this.framesToNextTurn -= 1;
        if(this.framesToNextTurn < 0) {
            let newAngle = random(-90, 90);
            let newDir = this.desiredDir.copy().rotate(newAngle);
            let newSensorPos = this.pos.copy().add(newDir.copy().mult(120));
            if(this.inBounds(newSensorPos)) {
                this.desiredDir.rotate(newAngle);
                this.framesToNextTurn = random(200, 500);
            }
        }

        this.avoidBounds(sensorPos);

        this.fulfillDesire();      

        // Turning behaviour
        let desiredAngle = this.dir.angleBetween(this.desiredDir);
        let turnFactor = abs(desiredAngle) / 180;

        if(turnFactor > 0.02) {
            // Turning
            this.dir.rotate(sin(frameCount*20.0)*5); // Head wobble
            this.tailStrength = lerp(this.tailStrength, this.maxTailStrength, 0.1 * turnFactor);
            this.tailSpeed = lerp(this.tailSpeed, this.maxTailSpeed, 0.2 * turnFactor);
            this.swimSpeed = lerp(this.swimSpeed, this.maxSwimSpeed, 0.2 * turnFactor);
        } 
        else {
            // Straight
            this.tailStrength = lerp(this.tailStrength, this.minTailStrength, 0.05 * (1 - turnFactor));
            this.tailSpeed = lerp(this.tailSpeed, this.minTailSpeed, 0.1 * (1 - turnFactor));
            this.swimSpeed = lerp(this.swimSpeed, this.minSwimSpeed, 0.05 * (1 - turnFactor));
        }

        this.tailPhase += this.tailSpeed * deltaTime;
        let phaseOffset = 12;
        for(let i = 1; i < this.segments.length; i++) {
            let a = sin(this.tailPhase - i * phaseOffset) * i * i * this.tailStrength;
            this.segments[i].setRotation(a);
        }

        // Add velocity to fish pos
        let velocity = this.dir.copy().mult(this.swimSpeed * (deltaTime / 1000))
        this.pos.add(velocity);

        // Update segment positions
        this.segments[0].follow(this.pos.x, this.pos.y);
        for(let i = 1; i < this.segments.length; i++) {
            this.segments[i].follow(this.segments[i - 1].B.x, this.segments[i - 1].B.y);
        }
    }

    draw() {
        // Side fins
        this.segments[2].drawSideFins(this.finColor);
        this.segments[5].drawSideFins(this.finColor);

        // Body segments
        for(let i = 0; i < this.segments.length; i++) {
            this.segments[i].draw();
        }

        // Dorsal Fin
        stroke(this.finColor);
        strokeWeight(2);
        for(let i = 2; i < 5; i++) {
            let dorsalA = this.segments[i].getCenter();
            let dorsalB = this.segments[i + 1].getCenter();
            line(dorsalA.x, dorsalA.y, dorsalB.x, dorsalB.y);
        }

        // Debug
        if(DEBUG_MODE) {
            stroke(0);
            let sensorPos = this.pos.copy().add(this.dir.copy().mult(120));
            line(this.pos.x, this.pos.y, sensorPos.x, sensorPos.y);
            stroke(255, 0, 0);
            let sensorPos1 = this.pos.copy().add(this.desiredDir.copy().mult(120));
            line(this.pos.x, this.pos.y, sensorPos1.x, sensorPos1.y);
        }
    }
}