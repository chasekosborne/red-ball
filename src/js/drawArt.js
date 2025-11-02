const PARALLAX_X = 0.08;   // smaller = moves less with camera (x)
const PARALLAX_Y = 0.015;  // smaller = moves less with camera (y)
const CLOUD_MARGIN = 160;  // how far off-screen before wrapping

// Each cloud tracks: base x/y, scale s, drift speed vx, and accumulated drift dx
const CLOUDS = [
    { x: 110, y: 80, s: 0.7, vx: 0.15, dx: 0 },
    { x: 220, y: 110, s: 1.0, vx: 0.20, dx: 0 },
    { x: 320, y: 140, s: 1.3, vx: 0.10, dx: 0 },

    { x: 1090, y: 270, s: 0.7, vx: 0.15, dx: 0 },
    { x: 1200, y: 300, s: 1.0, vx: 0.20, dx: 0 },
    { x: 1310, y: 330, s: 1.3, vx: 0.10, dx: 0 },
];

// Background: gradient sky + clouds (screen-space)
function drawSkyGradient(top = color(0, 150, 255), bottom = color(135, 206, 235)) {
    noFill();
    for (let y = 0; y < height; y++) {
        const t = y / height;
        stroke(lerpColor(top, bottom, t));
        line(0, y, width, y);
    }
    noStroke();
}

function drawlevel1Tiles() {
if (bricksBuilt && bricksGroup) return; 
bricksGroup = new Group();
bricksGroup.physics = 'static';
bricksGroup.layer = 0;
bricksGroup.img = brickImage;
bricksGroup.tile = '=';

pinkfullGroup = new Group();
pinkfullGroup.physics = 'static';
pinkfullGroup.layer = 1;
pinkfullGroup.img = pinkfullImage;
pinkfullGroup.tile = 't';

pinkleftGroup = new Group();
pinkleftGroup.physics = 'static';
pinkleftGroup.layer = 1;
pinkleftGroup.img = pinkleftImage;
pinkleftGroup.tile = 'l';

pinkrightGroup = new Group();
pinkrightGroup.physics = 'static';
pinkrightGroup.layer = 1;
pinkrightGroup.img = pinkrightImage;
pinkrightGroup.tile = 'r';

texturedBrickGroup = new Group();
texturedBrickGroup.physics = 'static';
texturedBrickGroup.layer = 1;
texturedBrickGroup.img = texturedBrickImage;
texturedBrickGroup.tile = 'x';

leftCornerBrickGroup = new Group();
leftCornerBrickGroup.physics = 'static';
leftCornerBrickGroup.layer = 1;
leftCornerBrickGroup.img = leftCornerBrickImage;
leftCornerBrickGroup.tile = 'c';

rightCornerBrickGroup = new Group();
rightCornerBrickGroup.physics = 'static';
rightCornerBrickGroup.layer = 1;
rightCornerBrickGroup.img = rightCornerBrickImage;
rightCornerBrickGroup.tile = 'v';

leftCornerBrickGroupInvert = new Group();
leftCornerBrickGroupInvert.physics = 'static';
leftCornerBrickGroupInvert.layer = 1;
leftCornerBrickGroupInvert.img = leftCornerInvertBrickImage;
leftCornerBrickGroupInvert.tile = 'd';

leftCornerBrickGroupInvert2 = new Group();
leftCornerBrickGroupInvert2.physics = 'static';
leftCornerBrickGroupInvert2.layer = 1;
leftCornerBrickGroupInvert2.img = leftCornerInvertBrickImage2;
leftCornerBrickGroupInvert2.tile = 's';

rightCornerBrickGroupInvert = new Group();
rightCornerBrickGroupInvert.physics = 'static';
rightCornerBrickGroupInvert.layer = 1;
rightCornerBrickGroupInvert.img = rightCornerInvertBrickImage;
rightCornerBrickGroupInvert.tile = 'f';

rightCornerBrickGroupInvert2 = new Group();
rightCornerBrickGroupInvert2.physics = 'static';
rightCornerBrickGroupInvert2.layer = 1;
rightCornerBrickGroupInvert2.img = rightCornerInvertBrickImage2;
rightCornerBrickGroupInvert2.tile = 'g';

  tiles = new Tiles(
    [
     '...........................', 
      '...........................',
      '...........................',  
      '...........................',
      '...........................',
      '...........................',
      '...........................',
      '...........................ctttttttttttttttttv',
      '...........................l==xxx==xxxx==xxxxr',
      '...........................lx=====x=========xr',
      '...........................lx============xx==r............................................ctttttttttttttttttttttv.....cttttttttttttttttttt',
      '...........................l=====x===========r............................................l=================x===r.....l===xx==============',
      '...........................lx========xx======r............................................lx==================x=r.....l===================',
      '...........................l=================r............................................l============x========r.....l===========x=======',
      '...........................l=======xx========r............................................l===========xx========gf...ds===================',
      '...........................l=============xx==r............................................l======================gttts===xx========xx=====',
      '...........................lx================r............................................l===============================================',
      '...........................l=================r............................................l==xx============x==============================',
      'cttttttttttv...............lx======xx========gf...........................................l===============================xxx=============',
      'l==x===x=x=r...............lx=================gttttv.....................................ds===============================================',
      'l=x======x=r...............l=========xx============r............................ctttttttts=====x==========================================',
      'lx=========r...............l=x=====================r............................lx========================================================',
      'l==========r...............lx============xx========r............................l=========================================================',
      'lx=======x=r...............lxx=====================r............................l=======xxx===============================================',
      'l======xx==r...............l=====x=================r............................l===============================================xx========',
      'l==xx======gf.............ds==x====================r............................l=================================xx======================',
      'l===========gttttttttttttts==============x=========gf..........................ds=========================================================',
      'l=======x=============xx============================gtttttttttttttttttttttttttts=========xx===============x===============================',
      'l===x========x====================xxx===========x=================================================================================xx======',
      'l========x===================================================x===============x=====================================x=======xx=============',
      'l=====================xx============xx====================================================xx==============================================',
      'l=====x===========================================xxxx=================x=========================xx=======================================',
    ],
    30, 57,
    23, 23
  );

  bricksBuilt = true;
}


function drawCloud(x, y, s = 1) {
    push();
    noStroke();

    // back layer
    fill(255, 255, 255, 80);
    ellipse(x, y, 140 * s, 80 * s);
    ellipse(x - 40 * s, y + 8 * s, 90 * s, 60 * s);
    ellipse(x + 45 * s, y + 5 * s, 100 * s, 65 * s);

    // middle layer
    fill(255, 255, 255, 140);
    ellipse(x - 25 * s, y - 10 * s, 70 * s, 55 * s);
    ellipse(x + 20 * s, y - 14 * s, 74 * s, 58 * s);
    ellipse(x + 60 * s, y + 2 * s, 62 * s, 48 * s);

    // front puffs
    fill(255, 255, 255, 210);
    ellipse(x - 5 * s, y - 18 * s, 56 * s, 46 * s);
    ellipse(x + 28 * s, y - 16 * s, 52 * s, 42 * s);

    // base shading + second pass (richer bottom)
    fill(220, 228, 240, 120);
    ellipse(x + 5 * s, y + 18 * s, 120 * s, 38 * s);

    fill(205, 214, 230, 110);
    ellipse(x + 10 * s, y + 20 * s, 100 * s, 28 * s);

    fill(190, 200, 220, 80);
    ellipse(x + 18 * s, y + 22 * s, 78 * s, 22 * s);

    pop();
}
// =========== END OF CLOUD PARALLAX =============

// ============ Space Background =================
// SPACE: build once (or when canvas size changes)
function ensureSpaceAssets() {
    if (!bgStars || bgStars.length === 0 ||
        ensureSpaceAssets._w !== width || ensureSpaceAssets._h !== height) {
        buildBgStarfield();     // (re)create stars for current canvas
        drawlevel1Tiles();
        ensureSpaceAssets._w = width;
        ensureSpaceAssets._h = height;
    }
}

function buildBgStarfield() {
    bgStars = [];
    for (let i = 0; i < STAR_COUNT; i++) {
        const depth = random(0.2, 1.0);
        bgStars.push({
            x: random(width),
            y: random(height),
            size: map(depth, 0.2, 1.0, 0.6, 2.2),
            baseAlpha: map(depth, 0.2, 1.0, 60, 200),
            twinkleAmp: map(depth, 0.2, 1.0, 30, 90),
            t: random(TAU),
            speedX: map(depth, 0.2, 1.0, 0.02, 0.35),
            depth
        });
    }
}

function drawBgStars() {
    for (const s of bgStars) {
        s.x -= s.speedX;
        if (s.x < -5) { s.x = width + 5; s.y = random(height); }

        s.t += 0.02 + s.speedX * 0.05;
        const a = s.baseAlpha + sin(s.t) * s.twinkleAmp * 0.5;

        noStroke();
        fill(255, a);
        circle(s.x, s.y, s.size);

        if (s.depth > 0.8 && random() < 0.002) {
            drawBgSparkle(s.x, s.y, s.size * 5, a * 0.7);
        }
    }
}

function drawBgSparkle(x, y, len, a) {
    push();
    stroke(255, a);
    strokeWeight(1);
    line(x - len, y, x + len, y);
    line(x, y - len, x, y + len);
    pop();
}

function spawnBgMeteor() {
    const y = random(-height * 0.1, height * 0.6);
    return { x: width + random(40, 140), y, vx: -random(8, 15), vy: random(2.5, 5.5), life: random(40, 70), len: random(80, 160) };
}

function updateBgMeteors() {
    blendMode(ADD);
    for (let i = bgMeteors.length - 1; i >= 0; i--) {
        const m = bgMeteors[i];
        m.x += m.vx;
        m.y += m.vy;
        m.life--;

        const t = constrain(m.life / 70, 0, 1);
        const a = 180 * t;

        noFill();
        stroke(170, 220, 255, a);
        strokeWeight(2);
        line(m.x, m.y, m.x - m.vx * (m.len / 15) * t, m.y - m.vy * (m.len / 15) * t);

        noStroke();
        fill(255, 255, 255, a);
        circle(m.x, m.y, 3 + 2 * (1 - t));

        if (m.life <= 0 || m.x < -200 || m.y > height + 200) {
            bgMeteors.splice(i, 1);
        }
    }
    blendMode(BLEND);
}

function drawDeepSky(g) {
    g.push(); g.noStroke();
    const cx = g.width * 0.55, cy = g.height * 0.45;
    const maxR = dist(0, 0, Math.max(cx, g.width - cx), Math.max(cy, g.height - cy));
    for (let r = maxR; r > 0; r--) {
        const t = r / maxR, col = g.lerpColor(g.color(2, 6, 18), g.color(0, 0, 0), 1 - (1 - (t)) * (1 - (t)));
        g.fill(col); g.circle(cx, cy, r * 2);
    }
    g.fill(255, 18);
    for (let i = 0; i < (g.width * g.height) / 40000; i++) g.circle(random(g.width), random(g.height), random(0.5, 1.2));
    g.drawingContext.save();
    g.drawingContext.globalCompositeOperation = 'multiply';
    const grd = g.drawingContext.createRadialGradient(g.width / 2, g.height / 2, Math.min(g.width, g.height) * 0.2, g.width / 2, g.height / 2, Math.max(g.width, g.height) * 0.75);
    grd.addColorStop(0, 'rgba(255,255,255,1)'); grd.addColorStop(1, 'rgba(0,0,0,0.75)');
    g.drawingContext.fillStyle = grd; g.rect(0, 0, g.width, g.height); g.drawingContext.restore(); g.pop();
}

function easeOutQuad(x) { return 1 - (1 - x) * (1 - x); }

function smoothstep(e0, e1, x) {
    const t = constrain((x - e0) / (e1 - e0), 0, 1);
    return t * t * (3 - 2 * t);
}
// ============ End Space Background =================

function drawBackgroundForLevel() {
    camera.off();
    push();

    if (currentBgTheme === BG_SPACE) {
        ensureSpaceAssets();
        background(0);

        drawBgStars();

        if (random() < METEOR_RATE) bgMeteors.push(spawnBgMeteor());
        updateBgMeteors();

    } else {
        drawSkyGradient();

        // parallax based on current camera each frame
        const px = -camera.x * PARALLAX_X;
        const py = -camera.y * PARALLAX_Y;

        // optional gentle drift + horizontal wrap so clouds keep coming
        const span = width + CLOUD_MARGIN * 2;

        for (const c of CLOUDS) {
            c.dx += c.vx;                    // slow drift to the right
            let sx = c.x + px + c.dx;
            let sy = c.y + py;

            while (sx < -CLOUD_MARGIN) sx += span;
            while (sx > width + CLOUD_MARGIN) sx -= span;

            drawCloud(sx, sy, c.s);
        }
    }

    pop();
    camera.on();
}

function drawUI() {
    camera.off();
    push();

    rectMode(CORNER);
    
    let textColor;
    if (levels[currentLevel].theme == 'space') {
      textColor = 'white';
    } else {
      textColor = 'black';
    }
    
    // Name of level
    fill(textColor);
    textAlign(LEFT, TOP);
    textSize(24);
    text(`Level: ${levels[currentLevel].name}`, 20, 20);

    
    if (!gameHandler.isPaused()) {
        fill(255, 100, 100);
        stroke(0);
        strokeWeight(2);
        rect(pauseButtonBounds.x, pauseButtonBounds.y, pauseButtonBounds.w, pauseButtonBounds.h);
        
        fill(255);
        textAlign(CENTER, CENTER);
        textSize(12);
        text('Pause (P)', pauseButtonBounds.x + pauseButtonBounds.w/2, pauseButtonBounds.y + pauseButtonBounds.h/2);
    }

    if(difficulty == 'hard') {
        fill(textColor);
        textSize(24);
        noStroke();
        text(`Lives: ${lives}`, 61, 60)
    }

    //Drawing the time
    push();
    camera.off();
    if (currentBgTheme == BG_SPACE) {
        fill(255);
    } else {
        fill(0);
    }
    noStroke();
    textSize(24);
    textAlign(LEFT);
    text("Time: " + formatTime(levelElapsedTime / 1000), 80, 90);
    pop();
    
    // Instructions (if needed)
    // Can be used to make fun little quips 
    // Not sure if I wanna use this yet
    
   /* textSize(16);
    text(levels[currentLevel].instructions, 20, 60); */
    
    // What level am I on?
    // I kinda dont like this but Im not gonna remove it yet.

     /* text(`Level ${currentLevel + 1} of ${levels.length}`, 20, height - 40); */
    
    pop();
    camera.on();
    const level = levels[currentLevel];

    // this makes the goal indicator someone pls make this not look garbage
    if (level.goalPosition) {
        push();
        fill(255, 215, 0, 150); 
        stroke(255, 165, 0); 
        strokeWeight(3);
        ellipse(level.goalPosition.x, level.goalPosition.y, 120, 120);
        
        // Add "GOAL" text
        fill(255, 255, 255);
        textAlign(CENTER, CENTER);
        textSize(16);
        text("GOAL", level.goalPosition.x, level.goalPosition.y);
        pop();

        
    }
}

function drawSigns() {
    const level = levels[currentLevel];
    if (!level.signs || level.signs.length === 0) return;

    push();
    textAlign(CENTER, CENTER);
    noStroke();

    for (let sign of level.signs) {
        textSize(sign.size || 24);
        fill(sign.color || 'white');
        text(sign.text, sign.x, sign.y);
    }

    pop();
}

