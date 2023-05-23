let burrow;

function setup() {
  let cnv = createCanvas(1200, 700);
  cnv.center('horizontal');
  burrow = new Burrow(600, 350);
  // frameRate();
}

function draw() {
  background("#673300");
  burrow.run();
}
