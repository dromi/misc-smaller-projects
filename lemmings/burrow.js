const breedTime = 1000;
const maxPopulation = 100;

const drawWidth = 20;

let timer = 0;


class Burrow{
    constructor(x, y){
        this.position = createVector(x, y);
        this.population = [];
    }

    breed(){
        if (millis() >= breedTime+timer && this.population.length < maxPopulation) {
            this.population.push(new Lemming(this.position.copy()));
            timer = millis();
        }
    }

    draw(){
        fill(50);
        ellipse(this.position.x, this.position.y, drawWidth);
    }

    run(){
        this.draw();
        this.breed()
        this.population.map(l => l.run());
    }
}