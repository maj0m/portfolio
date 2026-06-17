class Particle {
    constructor(x, y, col) {
        this.pos = createVector(x, y);

        let angle = random(360);
        let speed = random(200, 600);
        this.vel = p5.Vector.fromAngle(angle).mult(speed);

        this.color = col;
        this.baseSize = random(6, 12);

        this.life = 1.0; // 1 = just born, 0 = dead
        this.decay = random(0.4, 0.8); // life lost per second
        this.drag = 0.05;
    }

    update(dt) {
        this.vel.mult(pow(this.drag, dt));
        this.pos.add(this.vel.copy().mult(dt));
        this.life -= this.decay * dt;
    }

    isDead() {
        return this.life <= 0;
    }

    draw() {
        let alpha = 255 * max(this.life, 0);
        let size = this.baseSize * max(this.life, 0.15);

        noStroke();
        fill(red(this.color), green(this.color), blue(this.color), alpha);
        circle(this.pos.x, this.pos.y, size);
    }
}