class Corner {
  constructor(x, y, boundary) {
      this.x = x;
      this.y = y;
      this.boundary = boundary ? boundary : false;
      this.r = this.boundary ? 10 : 0;
      this.locked = false;
      this.connectors = [];
  }
  
  draw(debug){
    stroke(0);
    strokeWeight(1);
    fill(255);
    ellipse(this.x, this.y, this.r*2);
    if (debug){
      text(this.toString(), this.x, this.y);
    }
  }
  
  toString() {
    return `(${this.x},${this.y})`;
  };
}
  
class Line {
  constructor(c1, c2, boundary, bCorners) {
    this.c1 = c1;
    this.c2 = c2;
    this.boundary = boundary ? boundary : false;
    this.bCorners = bCorners ? bCorners: [];
  }

  draw(debug){
    stroke(255);
    strokeWeight(this.boundary ? 2 : 1);
    line(this.c1.x, this.c1.y, this.c2.x, this.c2.y);
    if (debug){
      text(this.dist(), (this.c1.x + this.c2.x) / 2, (this.c1.y + this.c2.y) / 2);
    }
  }

  toString() {
    return `[${this.c1} - ${this.c2}]`;
  };

  getCorners(){
    return [this.c1, this.c2]
  }

  dist() {
    return dist(this.c1.x, this.c1.y, this.c2.x, this.c2.y);
  }

  getMidPoint() {
    return new Corner((this.c1.x + this.c2.x)/2, (this.c1.y + this.c2.y)/2)
  }

  commonPoint(l) {
    if(l.c1 == this.c1) {
      return l.c1
    }
    if(l.c1 == this.c2) {
      return l.c1
    }
    if(l.c2 == this.c1) {
      return l.c1
    }
    if(l.c2 == this.c2) {
      return l.c1
    }
  }
}

class Triangle {
  constructor(l1, l2, l3) {
      this.l1 = l1
      this.l2 = l2
      this.l3 = l3
      this.lines = [l1, l2, l3]
      this.color = color(random(255), random(255), random(255), 100);
  }

  draw(){
    const cs = this.getCorners()
    noStroke();
    fill(this.color);
    triangle(cs[0].x, cs[0].y, cs[1].x, cs[1].y, cs[2].x, cs[2].y);
  }

  toString() {
    return `{${this.l1}, ${this.l2}, ${this.l3}}`;
  };


  getCorners(){
    const corners = this.l1.getCorners().concat(this.l2.getCorners(), this.l3.getCorners());
    const uniq = [... new Set(corners)];
    return uniq
  }

  getLineByCorners(c1, c2) {
    for (let l of this.lines) {
      if ((l.c1 == c1 && l.c2 == c2) || (l.c1 == c2 && l.c2 == c1)) {
        return l;
      }
    }
    console.error(`Unable to match ${c1} + ${c2} to a line in triangle ${this}`)
  }

  hasLine(line) {
    return this.lines.includes(line)
  }

  getOppositeLineCorner(line) {
    return this.getCorners().filter(x => !line.getCorners().includes(x))[0];
  }
}
