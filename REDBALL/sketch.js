new Q5();
new Canvas();

world.gravity.y = 10;

// collection of images
let unclaimedFlagImage;
let claimedFlagImage;
let spikeImage;

let ball;
let respawnPosition = [500, 150];
let jumpSound;
let deathSound;
let spikes;
let platform;
let button;
let ballColor;
let particles = [];
let respawnTimer = 0;
let jumpCount = 0;
let maxJumps = 1;
let spring;
let pauseKey = false;
let pausePosition = [0, 0];
let gameState = "playing";  // Always starts directly in game (since we use menu.html)

let currentLevel = 0; // 0 = dev room
let levels = [];
let levelObjects = {}; // Will store level platforms and stuff

// --- Cloud settings + state ---
const PARALLAX_X = 0.08;   // smaller = moves less with camera (x)
const PARALLAX_Y = 0.015;  // smaller = moves less with camera (y)
const CLOUD_MARGIN = 160;  // how far off-screen before wrapping

// Each cloud tracks: base x/y, scale s, drift speed vx, and accumulated drift dx
const CLOUDS = [
  { x: 110, y:  80, s: 0.7, vx: 0.15, dx: 0 },
  { x: 220, y: 110, s: 1.0, vx: 0.20, dx: 0 },
  { x: 320, y: 140, s: 1.3, vx: 0.10, dx: 0 },

  { x: 1090, y:  270, s: 0.7, vx: 0.15, dx: 0 },
  { x: 1200, y: 300, s: 1.0, vx: 0.20, dx: 0 },
  { x: 1310, y: 330, s: 1.3, vx: 0.10, dx: 0 },
];
function initializeLevels() {
    levels = [
        {
            name: "Tutorial",
            respawnPosition: [500, 150],
            ballColor: 'red',
            platforms: [
                { x: 600, y: 250, w: 120, h: 20, color: 'orange', moving: true, speed: 2, minX: 200, maxX: 1000 }
                
            ],
            ground: [
                { x: 500, y: 350, w: 800, h: 40 },
                

            ],
            springs: [
                { x: 1100, y: 350, w: 200, h: 40 }
            ],
            spikes: [
                { x: 800, y: 306, orientation: "up" }
            ],
            checkpoints: [
                { x: 200, y: 305 }
            ],
            goalPosition: { x: 1200, y: 300 }, 
            instructions: "Use SPACE to jump and arrow keys to move!"
        },

        {
          name: "Humble Beginnings.",
            respawnPosition: [500, 150],
            ballColor: 'red',
            platforms: [
                { x: 600, y: 250, w: 120, h: 20, color: 'blue', moving: true, speed: 2, minX: 200, maxX: 1000 }
                
            ],
            ground: [
                { x: 500, y: 350, w: 800, h: 40 },
                

            ],
            springs: [
                { x: 1100, y: 350, w: 200, h: 40 }
            ],
            spikes: [
                { x: 800, y: 300, orientation: "up" }
            ],
            checkpoints: [
                { x: 200, y: 305 }
            ],
            goalPosition: { x: 1200, y: 300 }, 
            instructions: "Use SPACE to jump and arrow keys to move!"

        }




        // Add more levels here  Be sure to use the template as seen above
      
    ];
}
// Background: gradient sky + clouds (screen-space)
function drawSkyGradient(top = color(0,150,255), bottom = color(135,206,235)) {
  noFill();
  for (let y = 0; y < height; y++) {
    const t = y / height;
    stroke(lerpColor(top, bottom, t));
    line(0, y, width, y);
  }
  noStroke();
}

function drawCloud(x, y, s = 1) {
  push();
  noStroke();

  // back layer
  fill(255, 255, 255, 80);
  ellipse(x,       y,        140*s, 80*s);
  ellipse(x-40*s,  y+8*s,     90*s, 60*s);
  ellipse(x+45*s,  y+5*s,    100*s, 65*s);

  // middle layer
  fill(255, 255, 255, 140);
  ellipse(x-25*s,  y-10*s,    70*s, 55*s);
  ellipse(x+20*s,  y-14*s,    74*s, 58*s);
  ellipse(x+60*s,  y+2*s,     62*s, 48*s);

  // front puffs
  fill(255, 255, 255, 210);
  ellipse(x-5*s,   y-18*s,    56*s, 46*s);
  ellipse(x+28*s,  y-16*s,    52*s, 42*s);

  // base shading + second pass (richer bottom)
  fill(220, 228, 240, 120);
  ellipse(x+5*s,   y+18*s,   120*s, 38*s);

  fill(205, 214, 230, 110);
  ellipse(x+10*s,  y+20*s,   100*s, 28*s);

  fill(190, 200, 220, 80);
  ellipse(x+18*s,  y+22*s,    78*s, 22*s);

  pop();
}

function explodeAndRespawn() {
  for (let i = 0; i < 12; i++) {
    particles.push({
      x: ball.x,
      y: ball.y,
      vx: random(-8, 8),
      vy: random(-12, -4),
      life: 40
    });
  }
  ball.visible = false;
  ball.collider = 'none';

  ball.vel.x = 0;
  ball.vel.y = 0;

  jumpCount = 0;

  ball.x = halfWidth - 200;
  ball.y = halfHeight - 200;
  respawnTimer = 40;
}
function updateParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.2;   
    p.life--;
  }
}
let checkpoints = [];

function spawnCheckpoints() {
    checkpoints.push(new CheckPoint(200, 305, ball));
}

function updateCheckpoints() {
    console.log(`current respawn: ${respawnPosition}`);

    for (let checkpoint of checkpoints) {
        checkpoint.update();
    }
}

function respawn() {
    if (respawnTimer === 0) {
        explodeAndRespawn();
		deathSound.play();
    }
}
function loadLevel(levelIndex) {
    clearLevel();
    
    currentLevel = levelIndex;
    const level = levels[currentLevel];
    
    // This is to reset the ball
    ball.x = level.respawnPosition[0];

    ball.y = level.respawnPosition[1];
    ball.color = level.ballColor;

    ball.vel.x = 0;
    ball.vel.y = 0;
    jumpCount = 0;
    
    // Handles ground creation
    levelObjects.ground = [];
    for (let groundData of level.ground) {
        let ground = new Sprite(groundData.x, groundData.y, groundData.w, groundData.h);
        ground.physics = STATIC;
        ground.color = 'green';

        levelObjects.ground.push(ground);

    }
    
    // Creation of platforms
    levelObjects.platforms = [];
    for (let platformData of level.platforms) {
        let platform = new Sprite(platformData.x, platformData.y, platformData.w, platformData.h);
        platform.color = platformData.color;
        platform.physics = KINEMATIC;
        platform.speed = platformData.speed || 0;
        platform.direction = 1;
        platform.minX = platformData.minX || platformData.x - 100;
        platform.maxX = platformData.maxX || platformData.x + 100;
        platform.moving = platformData.moving || false;
        levelObjects.platforms.push(platform);
    }
    
    // Spring creata
    levelObjects.springs = [];
    for (let springData of level.springs) {
        let spring = new Sprite(springData.x, springData.y, springData.w, springData.h);
        spring.physics = STATIC;
        spring.color = 'cyan';
        levelObjects.springs.push(spring);
    }
    
    // Spike creator
    levelObjects.spikes = [];
    for (let spikeData of level.spikes) {
        let spike = new Sprite(spikeData.x, spikeData.y, 50, 50);
        spike.img = spikeImage;
        spike.collider = 'static';
        spike.physics = STATIC;
        spike.rotationLock = true;

        switch (spikeData.orientation || 'up') {
            case 'up': spike.rotation = 0; break;
            case 'down': spike.rotation = 180; break;
            case 'left': spike.rotation = 90; break;
            case 'right': spike.rotation = -90; break;
        }
        levelObjects.spikes.push(spike);
    }
    
    // Creation of checkpoints
    levelObjects.checkpoints = [];
    for (let checkpointData of level.checkpoints) {

        let checkpoint = new CheckPoint(checkpointData.x, checkpointData.y, ball);

        levelObjects.checkpoints.push(checkpoint);
    }
}

function clearLevel() {
    Object.values(levelObjects).forEach(objectArray => {

        if (Array.isArray(objectArray)) {

            objectArray.forEach(obj => {
                if (obj.sprite) obj.sprite.remove();


                else if (obj.remove) obj.remove();
            });
        }
    });
    levelObjects = {};
}



function nextLevel() {

    if (currentLevel < levels.length - 1) {

        loadLevel(currentLevel + 1);
    } else {
       
        console.log("YOU WINNN!!!!!!!!!!!! WOWW!!!!!");
    }
}

function checkLevelCompletion() {
    const level = levels[currentLevel];
    if (level.goalPosition) {
        let distance = dist(ball.x, ball.y, level.goalPosition.x, level.goalPosition.y);
        if (distance < 60) {
            nextLevel();
        }
    }
}
function drawUI() {
    camera.off();
    
    // Name of level
    fill(0);
    textAlign(LEFT, TOP);
    textSize(24);
    text(`Level: ${levels[currentLevel].name}`, 20, 20);
    
    // Instructions (if needed)
    // Can be used to make fun little quips 
    // Not sure if I wanna use this yet
    
   /* textSize(16);
    text(levels[currentLevel].instructions, 20, 60); */
    
    // What level am I on?
    // I kinda dont like this but Im not gonna remove it yet.

     /* text(`Level ${currentLevel + 1} of ${levels.length}`, 20, height - 40); */
    
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

function explodeAndRespawn() {
    for (let i = 0; i < 20; i++) {
        particles.push({
            x: ball.x,
            y: ball.y,
            vx: random(-8, 8),
            vy: random(-12, -4),
            life: 40
        });
    }
    ball.visible = false;
    ball.collider = 'none';
    ball.vel.x = 0;
    ball.vel.y = 0;
    jumpCount = 0;
    ball.x = respawnPosition[0];
    ball.y = respawnPosition[1];
    respawnTimer = 40;
}

function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        let p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.2;
        p.life--;

        fill(ball.color);
        rect(p.x, p.y, 6, 6);

        if (p.life <= 0) particles.splice(i, 1);
    }
}

function preload() {
    jumpSound = loadSound('soundeffects/jump.mp3');
    springSound = loadSound('soundeffects/spring.mp3');
	deathSound = loadSound('soundeffects/dead.mp3');

    unclaimedFlagImage = loadImage("art/unclaimed_checkpoint.png", img => {
        
        img.resize(100, 100);
    });

    claimedFlagImage = loadImage("art/claimed_checkpoint.png", img => {
        img.resize(100, 100);
    });

    spikeImage = loadImage("art/spike.png", img => {
        img.resize(100, 100);
    });
}

function setup() {
    // Initialization pretty cool stuff
    initializeLevels();
    
    // Creation of out fun little ball
    ball = new Sprite();
    ball.drag = 0.4;
    ball.textSize = 40;
    ball.text = ":)";
    ball.diameter = 50;
    
    // Load da dev room 
    loadLevel(0);
    
    
    let button = createButton('Random Color');
    button.position(20, 100);
    button.mousePressed(randomColor);
}

function pauseMenu() {
    fill(173, 216, 230, 50);  
    rectMode(CENTER);  
    rect(850, 450, 1500, 700); 

    fill(0); 
    textAlign(CENTER, CENTER);
    textSize(25);
    text('Press ESC to resume',850, 350); 
    text('Press R to restart level', 850, 400);
}


function update() {
    if (kb.pressed('escape')) {
        pauseKey = !pauseKey;
    }
    
    if (kb.pressed('r')) {
      //level restart
        loadLevel(currentLevel); 

    }

    if (pauseKey) {
        pauseMenu();
        pausePosition = [ball.x, ball.y];
        // Physics when paused handler
        levelObjects.platforms?.forEach(platform => {
            platform.physics = STATIC;
        });
        ball.physics = NONE;
        ball.vel.x = 0;
        ball.vel.y = 0;
		
		ball.rotationSpeed = 0;
    	ball.angularVelocity = 0;
    	ball.rotation = ball.rotation;

        ball.x = pausePosition[0];
        ball.y = pausePosition[1];
        return;
    }

    // Unpause physiscs
    if (!pauseKey) {
        levelObjects.platforms?.forEach(platform => {
            platform.physics = KINEMATIC;
        });
        ball.physics = DYNAMIC;
    }

    // Camera handeler
    camera.x += (ball.x - camera.x) * 0.1;
    camera.y += (ball.y - camera.y) * 0.1;

    // Background creation
    camera.off();
    push();
    drawSkyGradient(color(0,150,255), color(135,206,235));

    const px = -camera.x * PARALLAX_X;
    const py = -camera.y * PARALLAX_Y;
    const dt = (typeof deltaTime === 'number' ? deltaTime : 16.666) / 16.666;

    for (const c of CLOUDS) {
        c.dx += c.vx * dt;
        let sx = c.x + px + c.dx;
        let sy = c.y + py;

        if (sx > width + CLOUD_MARGIN) {
            c.dx -= (width + 2 * CLOUD_MARGIN);
            sx -= (width + 2 * CLOUD_MARGIN);
        } else if (sx < -CLOUD_MARGIN) {
            c.dx += (width + 2 * CLOUD_MARGIN);
            sx += (width + 2 * CLOUD_MARGIN);
        }

        drawCloud(sx, sy, c.s);
    }
    pop();
    camera.on();

    // Ball fall off map respawner
    if (ball.y > 700) {
        respawn();
    }

    // Moving Platform handeller
    levelObjects.platforms?.forEach(platform => {
        if (platform.moving) {
            if (platform.x > platform.maxX) {
                platform.vel.x = -platform.speed;
                platform.vel.y = 0;
            } else if (platform.x < platform.minX) {
                platform.vel.x = platform.speed;
                platform.vel.y = 0;
            }
            
            // Ball + Platform interaction
            if (ball.colliding(platform) && ball.vel.y >= 0) {
                ball.x += platform.vel.x;
            }
        }
    });

    // Spring Handeler
    levelObjects.springs?.forEach(spring => {
        if (ball.colliding(spring)) {
            ball.vel.y = -15;
            if (springSound) springSound.play();
        }
    });

    // Jump reset Handeler
    let onGround = false;
    levelObjects.ground?.forEach(ground => {
        if (ball.colliding(ground)) onGround = true;
    });
    levelObjects.platforms?.forEach(platform => {
        if (ball.colliding(platform)) onGround = true;
    });
    if (onGround) jumpCount = 0;

    // Controls
    if (kb.presses('space')) {
        if (jumpCount < maxJumps) {
            ball.vel.y = -7;
            if (jumpSound) jumpSound.play();
            jumpCount++;
        }
    }

    if (kb.pressing('left')) {
        if (ball.vel.x > 0) ball.applyForce(-30);
        else ball.applyForce(-15);
    }

    if (kb.pressing('right')) {
        if (ball.vel.x < 0) ball.applyForce(30);
        else ball.applyForce(15);
    }

    // Spike collision handeler
    levelObjects.spikes?.forEach(spike => {
        if (ball.colliding(spike)) {
            respawn();
        }
    });

    // Checkpoint update
    levelObjects.checkpoints?.forEach(checkpoint => {
        checkpoint.update();
    });

    
    updateParticles();

    // Respawn Timer handler
    if (respawnTimer > 0) {
        respawnTimer--;
        if (respawnTimer === 0) {
            ball.vel.x = 0;
            ball.vel.y = 0;
            ball.visible = true;
            ball.collider = 'dynamic';
        }
    }

    // Checking if the level is done
    checkLevelCompletion();
    
    
    drawUI();
}
   



// When called the function assigns ballColor to a random color
function randomColor() {
    levels[currentLevel].ballColor = random(['red', 'black', 'purple', 'pink', 'yellow', 'green', 'blue']);
    ball.color = levels[currentLevel].ballColor;
}
