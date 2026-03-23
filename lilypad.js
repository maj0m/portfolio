class Lilypad {
    constructor(x, y) {
        this.pos = createVector(x, y);
        this.radius = random(20, 40);
        this.segments = 5;
        this.arcAngle = 340;
        this.petalCount = 7;
        this.stamenCount = 8;
        this.baseColor = color(130, 180, 110);
        this.segmentColor = color(150, 200, 130);
        this.outerPetalColor = color(246, 126, 150);
        this.innerPetalColor = color(244, 98, 132);
        this.stamenColor = color(249, 168, 37);
        this.rotation = random(0, 360);

        this.bobbed = false;
        this.bobTimer = 0;
        this.bobDuration = 1.4;
        this.bobScale = 1.0;
        this.bobStrength = 0.2;

        this.hasFlower = random(0, 1) < 0.3 ? true : false;
        this.segAngle = this.arcAngle / this.segments;
        this.outerPetalDist = 0.32 * this.radius;
        this.outerPetalWidth = 0.24 * this.radius;
        this.outerPetalHeight = 0.4 * this.radius;
        this.innerPetalDist = 0.24 * this.radius;
        this.innerPetalWidth = 0.2 * this.radius;
        this.innerPetalHeight = 0.36 * this.radius;
        this.stamenRadius = 0.06 * this.radius;
        this.outerStamenDist = 0.1 * this.radius;
        this.innerStamenDist = 0.04 * this.radius;
    }

    bob() {
        this.bobTimer = this.bobDuration;
        this.bobbed = true;
    }

    update(ripples, dt) {
        if (this.bobTimer <= 0) return;

        this.bobTimer -= dt;
        
        // Emit ripples when bobbed
        if(this.bobbed) {
            ripples.push(new Ripple(this.pos.x, this.pos.y, this.radius, this.radius));
            this.bobbed = false;
        }

        // Bob scale
        let t = this.bobTimer / this.bobDuration;
        let decay = t * t;
        let wave  = sin(t * 720) * decay;
        this.bobScale = 1.0 + this.bobStrength * wave;
    }

    draw() {
        push();

        translate(this.pos.x, this.pos.y);
        scale(this.bobScale);
        noStroke();

        // Base
        fill(this.baseColor);
        arc(0, 0, this.radius * 2, this.radius * 2, this.rotation, this.arcAngle + this.rotation);

        // Inside segments
        fill(this.segmentColor);
        let segDiameter = 0.95 * this.radius * 2;
        for(let i = 0; i < this.segments; i++) {
            let segStartAngle = i * this.segAngle + 2;
            let segEndAngle = (i + 1) * this.segAngle - 2;

            arc(0, 0, segDiameter, segDiameter, segStartAngle + this.rotation, segEndAngle + this.rotation);
        }

        // Flower
        if(this.hasFlower) {
            // Outer petals
            fill(this.outerPetalColor);
            for(let i = 0; i < this.petalCount; i++) {
                ellipse(0, this.outerPetalDist, this.outerPetalWidth, this.outerPetalHeight);            
                rotate(360 / this.petalCount);
            }

            // Inner petals
            fill(this.innerPetalColor);
            rotate(180 / this.petalCount);
            for(let i = 0; i < this.petalCount; i++) {          
                ellipse(0, this.innerPetalDist, this.innerPetalWidth, this.innerPetalHeight);            
                rotate(360 / this.petalCount);
            }

            // Stamen
            fill(this.stamenColor);
            for (let i = 0; i < this.stamenCount; i++) {
                let angle = 360 / this.stamenCount * i;
                circle(cos(angle) * this.outerStamenDist, sin(angle) * this.outerStamenDist, this.stamenRadius);
                circle(cos(angle) * this.innerStamenDist, sin(angle) * this.innerStamenDist, this.stamenRadius);
            }
        }

        pop();
    }

    drawShadow(shadowColor) {
        push();

        translate(this.pos.x + 10, this.pos.y + 10);
        let shadowScale = lerp(1.0, 1.0 / this.bobScale, 0.15);
        scale(shadowScale);
        noStroke();
 
        // Base
        fill(shadowColor);
        arc(0, 0, this.radius * 2, this.radius * 2, this.rotation, this.arcAngle + this.rotation);
 
        // Outer petals
        if(this.hasFlower) {
            for(let i = 0; i < this.petalCount; i++) {
                ellipse(0, this.outerPetalDist, this.outerPetalWidth, this.outerPetalHeight);
                rotate(360 / this.petalCount);
            }
        }
 
        pop();
    }
}