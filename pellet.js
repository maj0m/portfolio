class Pellet {
    constructor(x, y) {
        this.pos = createVector(x, y);
        this.radius = 6;
        this.minRadius = this.radius;
        this.maxRadius = 12;
        this.height = 100;
        this.maxHeight = this.height;
        this.fallSpeed = 200;

        this.dropped = false;
        this.consumed = false;

        this.color = color(random(150, 200), random(100, 150), random(20, 80));
    }
    
    consume() {
        this.consumed = true;
        ripples.push(new Ripple(this.pos.x, this.pos.y));
    }

    update(ripples, dt) {
        //Falling
        if(!this.dropped) {
            this.height -= this.fallSpeed * dt;
            let scale = this.height / this.maxHeight;
            this.radius = lerp(this.minRadius, this.maxRadius, scale);

            if(this.height < 0) {
                ripples.push(new Ripple(this.pos.x, this.pos.y));
                this.dropped = true;
            }
        }
            
        // In water
        else {
        }
    }

    draw() {
        // Active
        if(!this.consumed) {
            noStroke();
            fill(this.color);
            circle(this.pos.x, this.pos.y, this.radius);
        }

        // Consumed
        else {
        }
    }

    drawShadow(color) {
        // Active
        if(!this.consumed) {
            let heightRatio = this.height / this.maxHeight;
            let offset = heightRatio * 60;
            let shadowRadius = lerp(this.radius, this.radius * 0.1, heightRatio);

            push();
            translate(offset + 15, offset + 15);

            noStroke();
            fill(color);
            circle(this.pos.x, this.pos.y, shadowRadius);

            pop();
        }

        // Consumed
        else {
        }
    }
}