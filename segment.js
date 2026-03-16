class Segment {
    constructor(x, y, l, wA, wB, color) {
        this.A = createVector(x, y);
        this.B = createVector(x + l, y);
        this.length = l;
        this.widthA = wA;
        this.widthB = wB;
        this.color = color;
    }

    follow(x, y) {
        let target = createVector(x, y);
        let dir = p5.Vector.sub(this.B, target);
        dir.setMag(this.length);
        this.A = target;
        this.B = p5.Vector.add(this.A, dir);
    }

    draw() {
        let dir = p5.Vector.sub(this.B, this.A).normalize();
        let normal = createVector(-dir.y, dir.x);
        
        let overlap = -2;
        let front = p5.Vector.add(this.A, p5.Vector.mult(dir, overlap));
        let back  = p5.Vector.sub(this.B, p5.Vector.mult(dir, overlap));

        let aOffset = p5.Vector.mult(normal, this.widthA / 2);
        let bOffset = p5.Vector.mult(normal, this.widthB / 2);

        let p1 = p5.Vector.add(front, aOffset);
        let p2 = p5.Vector.sub(front, aOffset);
        let p3 = p5.Vector.sub(back, bOffset);
        let p4 = p5.Vector.add(back, bOffset);

        noStroke();
        fill(this.color);

        quad(
            p1.x, p1.y,
            p2.x, p2.y,
            p3.x, p3.y,
            p4.x, p4.y
        );
    }

    drawSideFins() {
        let dir = p5.Vector.sub(this.B, this.A).normalize();
        let normal = createVector(-dir.y, dir.x);

        let center = p5.Vector.add(this.A, this.B).div(2);
        let bodyWidth = min(this.widthA, this.widthB);

        let baseOffset = p5.Vector.mult(dir, this.length/2);
        let leftBase = p5.Vector.add(center, p5.Vector.mult(normal, bodyWidth/2));
        let rightBase = p5.Vector.add(center, p5.Vector.mult(normal, -bodyWidth/2));
        
        let finAngle = -45 + 40 * sin(frameCount * 2.0); // Between -85 and -5 degrees
        let leftTipOffset = p5.Vector.mult(normal, bodyWidth).rotate(finAngle);
        let rightTipOffset = p5.Vector.mult(normal, -bodyWidth).rotate(-finAngle)
        let leftTip = p5.Vector.add(leftBase, leftTipOffset);
        let rightTip = p5.Vector.add(rightBase, rightTipOffset);

        fill(255, 190, 50);
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