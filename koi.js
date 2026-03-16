let shape = [
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

class Koi {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.pos = createVector(500, 500);
        this.dir = createVector(random(-1, 1), random(-1, 1)).normalize();
        this.desiredDir = this.dir.copy();
        this.framesToNextTurn = 500;
        this.speed = 1.2;
        this.scale = 2;
        
        this.segments = [];
        for(let i = 0; i < shape.length; i+=3) {
            let c = i % 2 == 1 ? color(240, 130, 30) : color(255, 190, 50);
            this.segments.push(new Segment(
                0,
                0,
                shape[i] * this.scale,
                shape[i + 1] * this.scale,
                shape[i + 2] * this.scale,
                c
            ));
        }
    }

    inBounds(pos) {
        return pos.x > 0 && pos.x < window.innerWidth && pos.y > 0 && pos.y < window.innerHeight;
    }

    avoidBounds(pos) {
        let bounced = false;
        let newDir = this.desiredDir.copy();

        if (pos.x < 0 && newDir.x < 0) {
            newDir.x *= -1;
            bounced = true;
        }
        else if (pos.x > width && newDir.x > 0) {
            newDir.x *= -1;
            bounced = true;
        }

        if (pos.y < 0 && newDir.y < 0) {
            newDir.y *= -1;
            bounced = true;
        }
        else if (pos.y > height && newDir.y > 0) {
            newDir.y *= -1;
            bounced = true;
        }

        if (bounced) {
            this.desiredDir = newDir.normalize();
        }
    }

    fulfillDesire() {
        let angle = this.dir.copy().angleBetween(this.desiredDir);
        print(angle);        
        if(angle > 2) this.dir.rotate(1);
        else if(angle < -2) this.dir.rotate(-1);
    }

    update() {
        let sensorPos = this.pos.copy().add(this.dir.copy().mult(120));

        // Wobble
        this.dir.rotate(sin(frameCount*5.0)*1.5);

        // Change direction
        this.framesToNextTurn -= 1;
        if(this.framesToNextTurn < 0) {
            let newAngle = random(-90, 90);
            let newDir = this.desiredDir.copy().rotate(newAngle);
            let newSensorPos = this.pos.copy().add(newDir.copy().mult(120));
            if(this.inBounds(newSensorPos)) {
                this.desiredDir.rotate(newAngle);
                this.framesToNextTurn = 200;//random(200, 800);
            }
        }

        this.avoidBounds(sensorPos);

           
        this.fulfillDesire();      
        //this.dir.lerp(this.desiredDir, 0.01); 

        // Add dir to pos
        this.pos.add(this.dir.copy().mult(this.speed));

        // Head follows pos, body follows head
        this.segments[0].follow(this.pos.x, this.pos.y);
        for(let i = 1; i < this.segments.length; i++) {
            this.segments[i].follow(this.segments[i - 1].B.x, this.segments[i - 1].B.y);
        }
    }

    draw() {
        this.segments[2].drawSideFins();
        this.segments[5].drawSideFins();

        for(let i = 0; i < this.segments.length; i++) {
            this.segments[i].draw();
        }

        stroke(0);
        

        for(let i = 2; i < 5; i++) {
            let dorsalA = this.segments[i].getCenter();
            let dorsalB = this.segments[i + 1].getCenter();

            line(dorsalA.x, dorsalA.y, dorsalB.x, dorsalB.y);
        }

        let sensorPos = this.pos.copy().add(this.dir.copy().mult(120));
        //line(this.pos.x, this.pos.y, sensorPos.x, sensorPos.y)

        stroke(255, 0, 0);
        let sensorPos1 = this.pos.copy().add(this.desiredDir.copy().mult(120));
        //line(this.pos.x, this.pos.y, sensorPos1.x, sensorPos1.y)
    }

}