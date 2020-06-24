//6dof input from txt
var strokeRec;
//x, y, orient, pitch, roll, apitude, bearing
var val = [];
var ptSum = 0;
var pt = [];

var timeline;
var colMode = {
  type: ['Default', 'Rainbow'],
  slider: {},
  val: 0
};
var sizeMode = {
  type: ['Brush Size', 'Z Only'],
  slider: {},
  val: 0
};
var c;

function preload() {
  if ('6dof.txt') {
    strokeRec = loadStrings('6dof.txt');
  }
}

function setup() {
  //setups
  colorMode(RGB, 255);
  angleMode(DEGREES);

  createCanvas(1200, 1000);

  c = [
    color(254, 254, 254),
    color(220, 220, 220),
    color(255, 102, 99),
    color(100, 100, 100),
    color(10, 10, 10),
    color(0, 225, 0),
    color(100, 100, 255),
    color(255, 255, 0),
    color(200, 100, 255),
    color(0, 225, 255),
    color(255, 180, 0)
  ];

  for (var row of strokeRec) {
    var thisVal = {};

    if (row[0] == 's') {
      row = row.split(/\s+/g);
      thisVal.type = 's';

      var xVal = float(row[1]);
      var yVal = float(row[3]);
      var zVal = float(row[2]);
      var dVal;

      var pressVal = float(row[7]);

      if (xVal > -6 && xVal < 6 && yVal > -6 && yVal < 6 && zVal < 0) {
        var oVal;

        if (val.length > 0) {
          if (val[val.length - 1].x && val[val.length - 1].y) {
            var xPrev = val[val.length - 1].x;
            var yPrev = val[val.length - 1].y;
            oVal = atan2(yVal - yPrev, xVal - xPrev);
            dVal = dist(xPrev, yPrev, xVal, yVal);
            //dVal = float(dVal.toFixed(5));
          } else {
            oVal = 0;
            dVal = 0;
          }
        } else {
          oVal = 0;
        }

        //oVal = float(oVal.toFixed(5));

        thisVal.x = xVal;
        thisVal.y = yVal;
        thisVal.d = dVal;
        thisVal.o = oVal;

        var pVal = float(row[4]);
        var rVal = float(row[5]);

        var bVal = (90 + atan2(sin(rVal), sin(pVal))) * -1;
        var aVal = abs(acos(cos(pVal) * cos(rVal)));

        //bVal = float(bVal.toFixed(5));
        //aVal = float(aVal.toFixed(5));

        thisVal.p = pVal;
        thisVal.r = rVal;
        thisVal.b = bVal;
        thisVal.a = aVal;
        thisVal.z = zVal;

        val.push(thisVal);
        ptSum++;
      }

    } else if (row[0] == 'B') {
      row = row.split(/\s+/g);
      thisVal.type = 'B';

      thisVal.val = float(row[1]);

      val.push(thisVal);
    }
  }


  var ptSize = 1;
  var brushSize = 1;
  for (row of val) {

    if (row.type == 'B') {
      ptSize = pow(row.val, 2) + 1;
      brushSize = row.val;
    }

    if (row.type == 's') {

      pt.push({
        x: row.x * 64 + 320,
        y: row.y * 64 + 320,
        d: row.d,
        o: row.o,
        b: row.b,
        a: row.a,
        hue: int(pt.length / ptSum * 360),
        brushSize: ptSize,
        z: pow(row.z * -1, 0.5) * 40,
        text: 'x: ' + row.x +
          '\ny: ' + row.y +
          '\nDist: ' + row.d.toFixed(5) +
          '\nOrient: ' + row.o.toFixed(5) +
          '\n\nPitch: ' + row.p +
          '\nRoll: ' + row.r +
          '\nBearing: ' + row.b.toFixed(5) +
          '\nAptitude: ' + row.a.toFixed(5) +
          '\n\nz: ' + row.z +
          '\n\nBrush Size: ' + brushSize
      })
    }
  }


  timeline = createSlider(1, ptSum);
  timeline.position(20, 640 + 20);
  timeline.style('width', '560px');

  colMode.slider = createSlider(0, colMode.type.length - 1, 0);
  colMode.slider.position(860, 20);
  colMode.slider.style('width', '40px');

  sizeMode.slider = createSlider(0, sizeMode.type.length - 1, 0);
  sizeMode.slider.position(860, 56);
  sizeMode.slider.style('width', '40px');

}

function draw() {
  background(220, 220, 220);

  // Canvas frame
  push();
  noFill();
  strokeWeight(2);
  stroke(c[0]);
  rect(0, 0, 640, 640);
  pop();

  // Palette samples
  push();
  noStroke();
  for (var col of c) {
    fill(col);
    rect(0, 0, 10, 10);
    translate(10, 0);
  }
  pop();

  // timeline 
  push();
  noStroke();
  fill(c[3]);
  textAlign(LEFT, CENTER);
  textSize(16);
  var time = timeline.value();
  text(time + '/' + ptSum, 600, 670);
  pop();

  // view mode
  push();
  noStroke();
  fill(c[3]);
  textAlign(LEFT, CENTER);
  textSize(16);
  colMode.val = colMode.slider.value();
  text(colMode.val + ': ' + colMode.type[colMode.val], 910, 30);
  sizeMode.val = sizeMode.slider.value();
  text(sizeMode.val + ': ' + sizeMode.type[sizeMode.val], 910, 66);
  pop();



  // stroke 1st layer
  push();
  noStroke();

  textAlign(LEFT, TOP);
  textSize(16);

  var counter = 0;
  var ellipseSize;
  var ellipseCol;
  for (var idx of pt) {
    counter++;
    if (counter == time) {
      push();
      fill(c[3]);
      textLeading(20);
      text(idx.text, 660, 20);
      fill(c[2]);
      rect(820, 20, 10, 10);
      fill(c[5]);
      rect(820, 40, 10, 10);
      fill(c[7]);
      rect(820, 60, 10, 10);
      fill(c[8]);
      rect(820, 80, 10, 10);
      fill(c[9]);
      rect(820, 160, 10, 10);
      fill(c[10]);
      rect(820, 180, 10, 10);
      fill(c[6]);
      rect(820, 220, 10, 10);
      pop();
    }

    //graphs
    push();
    translate(0, 700);
    noFill();
    strokeWeight(2);
    stroke(c[2]);
    point(20 + counter / ptSum * 820, 200 - idx.x / 840 * 200);
    stroke(c[5]);
    point(20 + counter / ptSum * 820, 200 - idx.y / 840 * 200);
    stroke(c[6]);
    point(20 + counter / ptSum * 820, 200 - idx.z / 28.28 * 200);
    stroke(c[7]);
    point(20 + counter / ptSum * 820, 200 - idx.d * 5 * 200);
    //stroke(c[8]);
    //point(20 + counter / ptSum * 820, 200 - (idx.o + 180) / 360 * 200);

    //stroke(c[10]);
    //point(20 + counter / ptSum * 820, 200 - (idx.a + 180) / 360 * 200);

    stroke(c[0]);
    line(20 + time / ptSum * 820, 0, 20 + time / ptSum * 820, 200);
    stroke(c[3]);

    line(20, 0, 20, 200);
    line(20, 200, 840, 200);
    pop();

    //radio graph
    push();
    translate(860, 500);
    strokeWeight(1);
    noFill();
    stroke(c[3]);
    line(0, -200, 0, 200);
    line(-200, 0, 200, 0);

    strokeWeight(2);
            push();
    rotate(idx.o);
    stroke(c[8]);
    point(counter / ptSum * 200, 0);
    pop();
    
    push();
    rotate(idx.b);
    stroke(c[9]);
    point(counter / ptSum * 200, 0);
    pop();
    
    push();
    rotate(idx.a + 270);
    stroke(c[10]);
    point(counter / ptSum * 200, 0);
    pop();


    stroke(c[0]);
    circle(0, 0, time / ptSum * 400);
    stroke(c[3]);

    circle(0, 0, 400);
    pop();

    if (colMode.val == 0) {
      if (counter <= time) {
        ellipseCol = c[2];
      } else if (counter > time) {
        ellipseCol = c[3];
      }
    } else if (colMode.val == 1) {
      ellipseCol = color('hsb(' + idx.hue + ', 100%, 100%)');
    }

    if (sizeMode.val == 0) {
      ellipseSize = idx.brushSize;
    } else if (sizeMode.val == 1) {
      ellipseSize = idx.z;
    }

    ellipseCol.setAlpha(25);
    fill(ellipseCol);
    ellipse(idx.x, idx.y, ellipseSize, ellipseSize);
    ellipseCol.setAlpha(255);
  }
  pop();

  // stroke 2nd layer
  push();
  noFill();
  stroke(c[0]);
  strokeWeight(1);
  counter = 0;
  for (idx of pt) {
    counter++;
    if (sizeMode.val == 0) {
      ellipseSize = idx.brushSize;
    } else if (sizeMode.val == 1) {
      ellipseSize = idx.z;
    }

    if (counter == time) {
      ellipse(idx.x, idx.y, ellipseSize, ellipseSize);
    }
  }
  pop();



}