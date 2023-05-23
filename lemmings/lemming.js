const spawnDist = 10;
const maxSpeed = 1;
const moveDist = maxSpeed/10;
const drawSize = 3;
const burrowWeight = 2000;

class Lemming{
    constructor(burrowPosition){
        this.position = burrowPosition.add(createVector(random(-spawnDist, spawnDist), random(-spawnDist, spawnDist)));
        this.momentum = createVector(random(-maxSpeed, maxSpeed), random(-maxSpeed, maxSpeed));
        this.migrate = false;
        this.burrowPosition = burrowPosition.copy();
    }

    move(){
        let burrowPull = p5.Vector.sub(this.burrowPosition, this.position).div(burrowWeight);
        let noise = createVector(random(-moveDist, moveDist), random(-moveDist, moveDist))
        this.momentum.add(burrowPull);
        this.momentum.add(noise);
        this.momentum.limit(maxSpeed);
        this.position.add(this.momentum);
    }

    wraparound(){
        this.position.x = (this.position.x + width) % width
        this.position.y = (this.position.y + height) % height
    }

    draw(){
        let theta = this.momentum.heading() + radians(90);
        fill("#FFA500");
        push();
        translate(this.position.x, this.position.y);
        rotate(theta);
        triangle(-drawSize, 0,
                drawSize, 0, 
                 0, -drawSize*3);
        pop();
    }

    run(){
        this.move();
        this.wraparound();
        this.draw();
    }
}
