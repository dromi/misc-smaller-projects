class Wobbler {
  constructor(xRange, yRange, debug) {
    this.debug = debug

    this.cs = [
      new Corner(xRange[0], yRange[0], true),
      new Corner(xRange[1], yRange[0], true),
      new Corner(xRange[1], yRange[1], true),
      new Corner(xRange[0], yRange[1], true)
    ]
  
    // Create initial mesh
    this.ls = [
      new Line(this.cs[0], this.cs[1], true, [this.cs[0], this.cs[1]]),
      new Line(this.cs[1], this.cs[2], true, [this.cs[1], this.cs[2]]),
      new Line(this.cs[2], this.cs[3], true, [this.cs[2], this.cs[3]]),
      new Line(this.cs[3], this.cs[0], true, [this.cs[3], this.cs[0]]),
      new Line(this.cs[0], this.cs[2], false, [])
    ]

    this.ts = [
      new Triangle(this.ls[0], this.ls[1], this.ls[4]),
      new Triangle(this.ls[2], this.ls[3], this.ls[4])
    ]

    this.cs[0].connectors = [[this.cs[1]], [this.cs[3]]];
    this.cs[1].connectors = [[this.cs[0]], [this.cs[2]]];   
    this.cs[2].connectors = [[this.cs[1]], [this.cs[3]]];
    this.cs[3].connectors = [[this.cs[0]], [this.cs[2]]];
  }

  splitLine(lid) {
  /* 
    Algorithm for  line split:

     - find the two triangles sharing the line to be split
     - find the line midpoint, create as corner
     - add two new lines, splitting the input line
     - for each neighbor triangle:
        - find opposite corner to line in triangle
        - create line from midpoint to opposite corner
        - create two new triangles by splitting the existing one
        - remove old triangle
     - remove original line
   */

    let l = this.ls[lid];

    const neighbors = this.ts.filter(t => t.hasLine(l));
    const midPoint = l.getMidPoint();
    this.cs.push(midPoint);

    const nl1 = new Line(midPoint, l.c1, l.boundary, l.bCorners);
    const nl2 = new Line(midPoint, l.c2, l.boundary, l.bCorners);

    this.ls.push(nl1);
    this.ls.push(nl2);


    if (l.bCorners.length > 0) {
      if (l.bCorners[0].connectors[0][0] == l.bCorners[1]){
        l.bCorners[0].connectors[0].push(midPoint);
      }
      if (l.bCorners[0].connectors[1][0] == l.bCorners[1]){
        l.bCorners[0].connectors[1].push(midPoint);
      }
      if (l.bCorners[1].connectors[0][0] == l.bCorners[0]){
        l.bCorners[1].connectors[0].push(midPoint);
      }
      if (l.bCorners[1].connectors[1][0] == l.bCorners[0]){
        l.bCorners[1].connectors[1].push(midPoint);
      }
    }

    for (let n of neighbors) {
      const oc = n.getOppositeLineCorner(l);

      const nlt = new Line(midPoint, oc, false);
      this.ls.push(nlt);

      const t1 = new Triangle(nlt, nl1, n.getLineByCorners(l.c1, oc));
      const t2 = new Triangle(nlt, nl2, n.getLineByCorners(l.c2, oc));
      this.ts.push(t1);
      this.ts.push(t2);

      this.ts.splice(this.ts.indexOf(n), 1);
    }
    this.ls.splice(lid, 1);
  }

  prune(){
    for (let l of this.ls) {
      if (!l.new && l.dist() > 200){
        // console.log('pruning ' + l + ' ' + l.dist() + ' ' + l.boundary)
        this.splitLine(this.ls.indexOf(l))
      }
    }
  }

  draw(){
    this.ts.map(t => t.draw(this.debug));
    this.ls.map(l => l.draw(this.debug));
    this.cs.map(c => c.draw(this.debug));
  }
}
