function setup() {
  createCanvas(400, 400);
}

// variables for the ball generation
let ball_x = 200, ball_y = 300, ball_z = 60;

function draw() {
  // loop through every horizontal line on the canvas
  for (let y = 0; y < height; y++) {
    // Variable t stores y / height in it (a number between 0 and 1).
    let t = y / height;

    // lerpColor is a built in function for blending
    // Blend between two colors using fraction t to decide how much
    let c = lerpColor(
      color(0, 150, 255),   // top color (darker blue)
      color(135, 206, 235), // bottom color (lighter blue)
      t
    );

    stroke(c);              // set line color
    line(0, y, width, y);   // draw a horizontal line across the canvas
  }
  
  function drawCloud(x, y, s) { // s = scale (1 = normal size).
  
  noStroke(); // clouds look softer without outlines

  // Back layer (largest, most transparent)
  fill(255, 255, 255, 80);              
  ellipse(x,       y,        140*s, 80*s);
  ellipse(x-40*s,  y+8*s,     90*s, 60*s);
  ellipse(x+45*s,  y+5*s,    100*s, 65*s);

  // Middle layer (a bit less transparent)
  fill(255, 255, 255, 140);             // still soft, more opaque
  ellipse(x-25*s,  y-10*s,    70*s, 55*s);
  ellipse(x+20*s,  y-14*s,    74*s, 58*s);
  ellipse(x+60*s,  y+2*s,     62*s, 48*s);

  // Front puffs (smallest, most opaque)
  fill(255, 255, 255, 210);             // mostly solid
  ellipse(x-5*s,   y-18*s,    56*s, 46*s);
  ellipse(x+28*s,  y-16*s,    52*s, 42*s);

  // Soft base shading (slightly bluish-gray, semi-transparent)
  // This makes the underside feel darker
  fill(220, 228, 240, 120);             // cool gray
  ellipse(x+5*s,   y+18*s,   120*s, 38*s);
    
  // Second shading pass: a bit darker & tighter
  fill(205, 214, 230, 110);          // slightly darker bluish-gray
  ellipse(x+10*s, y+20*s, 100*s, 28*s);

  fill(190, 200, 220, 80);           // narrower, even darker but more transparent
  ellipse(x+18*s, y+22*s, 78*s, 22*s);

  // Makes a red ball with variables as position input
  // If more is to be drawn after the red ball, the code for the ball needs
  // to be wrapped in a push(); then a pop(); from preventing other drawings
  // after this from being affected
  stroke(0);             // black outline
  strokeWeight(1);       // thin border
  fill(229, 57, 53);
  circle(ball_x, ball_y, ball_z);

}

  // Examples
drawCloud(220, 110, 1.0);  // the one you already had
drawCloud(110, 80,  0.6);  // smaller, higher (farther away look)
drawCloud(320, 140, 1.3);  // bigger, lower
drawCloud(80, 50, 0.3);    // higher, smaller
drawCloud(60, 20, 0.2);    // highest, smaller



}
