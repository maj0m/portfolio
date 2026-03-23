class Ripple {
    constructor(x, y, baseRadius = 0, maxSpread = 30) {
        this.pos = createVector(x, y);
        this.radius = baseRadius;
        this.baseRadius = baseRadius;
        this.maxSpread = maxSpread;

        this.ringCount = 5;
        this.ringSpacing = 6;

        this.spreadSpeed = 16;
        this.minSpreadSpeed = 10;

        this.color = color(135, 163, 154);
        this.maxAlpha = 128;
    }

    update(dt) {
        this.radius += this.spreadSpeed * dt;
        this.spreadSpeed = lerp(this.spreadSpeed, this.minSpreadSpeed, 2 * dt);
    }

    draw() {
        noFill();
        strokeWeight(2);

        for (let i = 0; i < this.ringCount; i++) {
            let ringRadius = this.radius - i * this.ringSpacing;

            if (ringRadius <= this.baseRadius || ringRadius >= this.baseRadius + this.maxSpread) continue;
            
            // Calculate alpha based on distance and index
            let t = (ringRadius - this.baseRadius) / this.maxSpread;
            let distanceFade = (1 - t) ** 2;
            let indexFade = (1 - i / this.ringCount) ** 3;
            let alpha = this.maxAlpha * distanceFade * indexFade;
            this.color.setAlpha(alpha);

            stroke(this.color);
            circle(this.pos.x, this.pos.y, ringRadius * 2);
        }
    }
}