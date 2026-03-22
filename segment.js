class Segment {
    constructor(x, y, l, wA, wB, color) {
        this.A = createVector(x, y);
        this.B = createVector(x + 1, y);
        this.dir = p5.Vector.sub(this.B, this.A).normalize();
        this.length = l;
        this.widthA = wA;
        this.widthB = wB;
        this.color = color;
    }

    follow(x, y) {
        let target = createVector(x, y);
        this.dir = p5.Vector.sub(this.B, target).normalize();
        let dir = this.dir.copy();
        dir.setMag(this.length);
        this.A = target;
        this.B = p5.Vector.add(this.A, dir);
    }

    setRotation(angle) {
        let newDir = this.dir.copy();
        newDir.rotate(angle);
        newDir.setMag(this.length);
        this.B = p5.Vector.add(this.A, newDir);
    }

    draw(color = this.color) {
        let normal = createVector(-this.dir.y, this.dir.x);
        
        let overlap = -2;
        let front = p5.Vector.add(this.A, p5.Vector.mult(this.dir, overlap));
        let back  = p5.Vector.sub(this.B, p5.Vector.mult(this.dir, overlap));

        let aOffset = p5.Vector.mult(normal, this.widthA / 2);
        let bOffset = p5.Vector.mult(normal, this.widthB / 2);

        let p1 = p5.Vector.add(front, aOffset);
        let p2 = p5.Vector.sub(front, aOffset);
        let p3 = p5.Vector.sub(back, bOffset);
        let p4 = p5.Vector.add(back, bOffset);

        noStroke();
        fill(color);

        quad(
            p1.x, p1.y,
            p2.x, p2.y,
            p3.x, p3.y,
            p4.x, p4.y
        );
    }

    drawSideFins(color = this.color) {
        let normal = createVector(-this.dir.y, this.dir.x);

        let center = p5.Vector.add(this.A, this.B).div(2);
        let bodyWidth = min(this.widthA, this.widthB);

        let baseOffset = p5.Vector.mult(this.dir, this.length/2);
        let leftBase = p5.Vector.add(center, p5.Vector.mult(normal, bodyWidth/2));
        let rightBase = p5.Vector.add(center, p5.Vector.mult(normal, -bodyWidth/2));
        
        let finAngle = 60 + 20 * sin(frameCount * 2.0); // between 40 and 80 degrees
        let leftTipOffset = p5.Vector.mult(normal, bodyWidth).rotate(-finAngle);
        let rightTipOffset = p5.Vector.mult(normal, -bodyWidth).rotate(finAngle)
        let leftTip = p5.Vector.add(leftBase, leftTipOffset);
        let rightTip = p5.Vector.add(rightBase, rightTipOffset);

        fill(color);
        noStroke();

        triangle(
            p5.Vector.sub(leftBase, baseOffset).x, p5.Vector.sub(leftBase, baseOffset).y,
            p5.Vector.add(leftBase, baseOffset).x, p5.Vector.add(leftBase, baseOffset).y,
            leftTip.x, leftTip.y
        );

        triangle(
            p5.Vector.sub(rightBase, baseOffset).x, p5.Vector.sub(rightBase, baseOffset).y,
            p5.Vector.add(rightBase, baseOffset).x, p5.Vector.add(rightBase, baseOffset).y,
            rightTip.x, rightTip.y
        );
    }

    getCenter() {
        return p5.Vector.add(this.A, this.B).div(2);
    }
}