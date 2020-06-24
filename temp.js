 var ex = val[f0 - stepsTot][0] * 64 + 320;
      var ey = val[f0 - stepsTot][2] * 64 + 320;
      stroke(c4);
      strokeWeight(1);
      line(ex, ey,
        (ex + cos(bs[f0]) * as[f0]),
        (ey + sin(bs[f0]) * as[f0]));
      noStroke();
      fill(c5);
      ellipse(ex, ey, zs[f0] * -50, zs[f0] * -50);