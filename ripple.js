class Ripple {
    constructor(x, y) {
        this.pos = createVector(x, y);
        this.age = 0;
        this.baseRadius = 0;
        this.maxRadius = 50;
        this.radiusMultipliers = [0.1, 0.4, 0.7, 1.0];
        this.spreadSpeed = 50;
        this.minSpreadSpeed = 20;
    }

    update(dt) {
        this.baseRadius += this.spreadSpeed * dt;
        this.spreadSpeed = lerp(this.spreadSpeed, this.minSpreadSpeed, 2 * dt);
    }

    draw() {
        noFill();
        strokeWeight(1);
        
        for(let i = 0; i < this.radiusMultipliers.length; i++) {
            let radius = this.baseRadius * this.radiusMultipliers[i];
            let alpha = (1 - radius / this.maxRadius) * 255 * this.radiusMultipliers[i];
            stroke(135, 163, 154, alpha);
            circle(this.pos.x, this.pos.y, radius);
        }
    }
}