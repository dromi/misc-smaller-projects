const delta = 50;
const vertexRadius = 10;

let xRange;
let yRange;
let wobbler;

function setup() {
  let cnv = createCanvas(600, 600);
  cnv.center('horizontal');
  xRange = [width/2 - delta, width/2 + delta];
  yRange = [height/2 - delta, height/2 + delta];

  wobbler = new Wobbler(xRange, yRange, false);
}

function draw() {
  background("#333333");
  wobbler.prune();
  wobbler.draw();
}

function mousePressed() {
  for(let c of wobbler.cs){
    if (c.boundary && dist(mouseX, mouseY, c.x, c.y) < c.r) {
      c.locked = true;
      const x_trans = mouseX - c.x;
      const y_trans = mouseY - c.y;
      c.x = mouseX;
      c.y = mouseY;
      for (let cc of c.connectors[0].slice(1)){
        const pct_x = (cc.x - c.connectors[0][0].x) / (c.x - c.connectors[0][0].x)
        const pct_y = (cc.y - c.connectors[0][0].y) / (c.y - c.connectors[0][0].y)
        cc.x += lerp(0, x_trans, pct_x);
        cc.y += lerp(0, y_trans, pct_y);
      }
      for (let cc of c.connectors[1].slice(1)){
        const pct_x = (cc.x - c.connectors[0][0].x) / (c.x - c.connectors[0][0].x)
        const pct_y = (cc.y - c.connectors[0][0].y) / (c.y - c.connectors[0][0].y)
        cc.x += lerp(0, x_trans, pct_x);
        cc.y += lerp(0, y_trans, pct_y);
      }
      break;
    }
  }
}

function mouseDragged() {
  for(let c of wobbler.cs){
    if (c.locked) {
      const x_trans = mouseX - c.x;
      const y_trans = mouseY - c.y;
      // console.log(x_trans, y_trans)
      c.x = mouseX;
      c.y = mouseY;
      for (let cc of c.connectors[0].slice(1)){
        const pct_x = abs((cc.x - c.connectors[0][0].x) / (c.x - c.connectors[0][0].x))
        const pct_y = abs((cc.y - c.connectors[0][0].y) / (c.y - c.connectors[0][0].y))
        cc.x += lerp(0, x_trans, pct_x);
        cc.y += lerp(0, y_trans, pct_y);
      }
      for (let cc of c.connectors[1].slice(1)){
        const pct_x = abs((cc.x - c.connectors[1][0].x) / (c.x - c.connectors[1][0].x))
        const pct_y = abs((cc.y - c.connectors[1][0].y) / (c.y - c.connectors[1][0].y))
        cc.x += lerp(0, x_trans, pct_x);
        cc.y += lerp(0, y_trans, pct_y);
      }
    }
  }
}

function mouseReleased() {
  for(let c of wobbler.cs){
    c.locked = false;
  }
}