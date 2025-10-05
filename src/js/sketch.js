new Q5();
new Canvas();

world.gravity.y = 10;

// collection of images
let unclaimedFlagImage;
let claimedFlagImage;
let spikeImage;
let laserBlasterImage;
let colorButtonBounds = { x: 20, y: 100, w: 100, h: 30 };
let pauseButtonBounds = { x: 20, y: 140, w: 100, h: 30 };
let ball;
let respawnPosition = [500, 150];
let jumpSound;
let deathSound;
let teleportSound;
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
let gameState = "playing"; // start in menu
let teleporter;
let teleporterImage;
let teleporterActive = true;   
let beginTime = millis();
//let blackhole;
//let blackholeImage;

// === Background themes ===
const BG_SKY   = "sky";
const BG_SPACE = "space";

// Active theme (set this per level)
let currentBgTheme = BG_SKY;

// ==== Space assets =====
let bgStars = [];
let bgMeteors = [];
const STAR_COUNT = 280;
const METEOR_RATE = 0.0009;
let spaceSeed = 1337;
// ==== End Space assets =====

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
			theme: "space", 
            respawnPosition: [500, 150],
            ballColor: 'red',
            platforms: [
                { x: 600, y: 250, w: 120, h: 20, color: 'orange', moving: true, speed: 2, minX: 200, maxX: 1000 },
                { x: 850, y: 200, w: 120, h: 20, color: 'orange', fake: 'true'}
                
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
            enemies: [
                { startX: 450, startY: 100, endX: 475, endY: 100, speed: 1 }
            ],
            teleporter: [
                { x: 1080, y: 300, w: 50, h: 50 },
                { x: 420, y: 300, w: 50, h: 50 },
            ],
            lasers: [
                { x: 100, y: 100, range: 300, speedData: { speed: 3, bulletSpeed: 8 }, fwdDir: DOWN },
                { x: 600, y: 600, range: 300, speedData: { speed: 3, bulletSpeed: 8 }, fwdDir: UP },
            ],
            disappearingPlatforms: [
                { x: 1080, y: 100, w: 120, h: 20 },
            ],
            goalPosition: { x: 1200, y: 300 }, 
            instructions: "Use SPACE to jump and arrow keys to move!"
        },

       {
            name: "Level 1",
		   	theme: "space", 
            respawnPosition: [500, 150],
            ballColor: 'red',
            platforms: [
                // question for later but why are the y's below != to eachothers pair
                { x: 3150, y: -1000, w: 100, h: 20, color: 'orange', moving: true, speed: 2, minX: 3150, maxX: 3450 },
                { x: 3850, y: -996, w: 100, h: 20, color: 'orange', moving: true, speed: 2, minX: 3550, maxX: 3850 },

                { x: 3150, y: -1000 + 400, w: 100, h: 20, color: 'orange', moving: true, speed: 2, minX: 3150, maxX: 3450 },
                { x: 3850, y: -996 + 400, w: 100, h: 20, color: 'orange', moving: true, speed: 2, minX: 3550, maxX: 3850 },

                { x: 3150, y: -1000 + 800, w: 100, h: 20, color: 'orange', moving: true, speed: 2, minX: 3150, maxX: 3450 },
                { x: 3850, y: -996 + 800, w: 100, h: 20, color: 'orange', moving: true, speed: 2, minX: 3550, maxX: 3850 },

                { x: 3150, y: -1000 + 1200, w: 100, h: 20, color: 'orange', moving: true, speed: 2, minX: 3150, maxX: 3450 },
                { x: 3850, y: -996 + 1200, w: 100, h: 20, color: 'orange', moving: true, speed: 2, minX: 3550, maxX: 3850 },



                { x: 4200, y: -1000, w: 100, h: 20, color: 'orange', moving: true, speed: 2, minX: 4200, maxX: 4500 },
                { x: 4900, y: -996, w: 100, h: 20, color: 'orange', moving: true, speed: 2, minX: 4600, maxX: 4900 },

                { x: 4200, y: -1000 + 400, w: 100, h: 20, color: 'orange', moving: true, speed: 2, minX: 4200, maxX: 4500 },
                { x: 4900, y: -996 + 400, w: 100, h: 20, color: 'orange', moving: true, speed: 2, minX: 4600, maxX: 4900 },

                { x: 4200, y: -1000 + 800, w: 100, h: 20, color: 'orange', moving: true, speed: 2, minX: 4200, maxX: 4500 },
                { x: 4900, y: -996 + 800, w: 100, h: 20, color: 'orange', moving: true, speed: 2, minX: 4600, maxX: 4900 },

                { x: 4200, y: -1000 + 1200, w: 100, h: 20, color: 'orange', moving: true, speed: 2, minX: 4200, maxX: 4500 },
                { x: 4900, y: -996 + 1200, w: 100, h: 20, color: 'orange', moving: true, speed: 2, minX: 4600, maxX: 4900 },


                
            
                
            ],
            ground: [
                { x: 500, y: 350, w: 800, h: 40 },
                { x: 1700, y: -600, w: 200, h: 40 },
                { x: 2300, y: -600, w: 400, h: 40 },
                { x: 2480, y: -220, w: 40, h: 800 },
                { x: 2680, y: -220, w: 40, h: 800 },
                { x: 2680, y: -800, w: 40, h: 400 },
                { x: 2680, y: 400, w: 400, h: 40 },

                { x: 2880, y: -220, w: 40, h: 800 },
                { x: 2880, y: -800, w: 40, h: 400 },
                { x: 2880, y: 220, w: 40, h: 400 },

                { x: 2780, y: 50, w: 40, h: 20 },
                { x: 2780, y: -350, w: 40, h: 20 },
                { x: 2780, y: -750, w: 40, h: 20 },

                { x: 2960, y: -1000, w: 200, h: 40 },

                { x: 3980, y: -220, w: 40, h: 800 },
                { x: 3980, y: -800, w: 40, h: 400 },
                { x: 3980, y: -1200, w: 40, h: 400 },

                { x: 3980, y: 300, w: 100, h: 40 },

                { x: 4550, y: -800, w: 100, h: 20 },
                { x: 4550, y: -400, w: 100, h: 20 },
                { x: 4550, y: 0, w: 100, h: 20 },

                { x: 5400, y: -1000, w: 300, h: 20 },

            ],
            springs: [
                { x: 1100, y: 200, w: 200, h: 40 },
                { x: 1400, y: -200, w: 200, h: 40 },
                { x: 2780, y: 380, w: 100, h: 20 },
                { x: 2780, y: 30, w: 40, h: 20 },
                { x: 2780, y: -370, w: 40, h: 20 },
                { x: 2780, y: -770, w: 40, h: 20 },
                
            ],
            spikes: [

                { x: 1900, y: -620, orientation: "up" },
                { x: 1950, y: -620, orientation: "up" },
                { x: 2000, y: -620, orientation: "up" },

                { x: 2200, y: -645, orientation: "up" },
                { x: 2250, y: -645, orientation: "up" },
                { x: 2300, y: -645, orientation: "up" },

                { x: 2525, y: -590, orientation: "left" },
                { x: 2525, y: -540, orientation: "left" },
                { x: 2525, y: -490, orientation: "left" },

                { x: 2635, y: 0, orientation: "right" },
                { x: 2635, y: 50, orientation: "right" },
                { x: 2635, y: 100, orientation: "right" },

                { x: 2780, y: 80, orientation: "down" },
                { x: 2780, y: -320, orientation: "down" },
                { x: 2780, y: -720, orientation: "down" },

        
            ],

            checkpoints: [
                { x: 2960, y: -1045}
            ],

		   	teleporter: [],  

            goalPosition: { x: 5400, y: -1050 }, 

            instructions: ""
        },

        {
            name: "Level 2",
		   	theme: "space", 
            respawnPosition: [500, 150],
            ballColor: 'pink',
            platforms: [
                // question for later but why are the y's below != to eachothers pair
                //{ x: 3150, y: -1000, w: 100, h: 20, color: 'orange', moving: true, speed: 2, minX: 3150, maxX: 3450 },
                
            ],
            ground: [
                { x: 500, y: 350, w: 800, h: 40 },

            ],
            springs: [],
            spikes: [],

            checkpoints: [
                { x: 2960, y: -1045}
            ],

		   	teleporter: [],  

            goalPosition: { x: 5400, y: -1050 }, 

            instructions: ""
        },



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
	currentBgTheme = levels[currentLevel].theme || BG_SKY;
    
    // set the player reset spawn point based on the level on level-load
    respawnPosition[0] = level.respawnPosition[0];
    respawnPosition[1] = level.respawnPosition[1];
    
    // This is to reset the ball
    ball.x = respawnPosition[0];
    ball.y = respawnPosition[1];
    
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
        if(platformData.fake == 'true'){
            platform.physics = 'none';
            platform.color = platformData.color || 'orange'
            platform.stroke = 'black'
            platform.strokeWeight = 2;
        }
        else {
            platform.physics = KINEMATIC;
            platform.color = platformData.color || 'orange'
            platform.speed = platformData.speed || 0;
            platform.direction = 1;
            platform.minX = platformData.minX || platformData.x - 100;
            platform.maxX = platformData.maxX || platformData.x + 100;
            platform.moving = platformData.moving || false;
            
        }
        levelObjects.platforms.push(platform);
    }
    
    // Spring creator
    levelObjects.springs = [];
    for (let springData of level.springs) {
        let spring = new Sprite(springData.x, springData.y, springData.w, springData.h);
        spring.physics = STATIC;
        spring.color = 'cyan';
        levelObjects.springs.push(spring);
    }
       // Disappearing platforms creator
    levelObjects.disappearingPlatforms = [];
    for (let disappearData of (level.disappearingPlatforms || [])) {
        let disappearPlatform = new Sprite(disappearData.x, disappearData.y, disappearData.w, disappearData.h);
        disappearPlatform.physics = STATIC;
        disappearPlatform.baseColor = disappearData.color || color(128, 0, 128); // Purple color
        disappearPlatform.color = disappearPlatform.baseColor;
        disappearPlatform.isDisappearing = false;
        disappearPlatform.isReappearing = false;
        disappearPlatform.fadeTimer = 0;
        disappearPlatform.playerTouched = false;
        disappearPlatform.opacity = 255;
        levelObjects.disappearingPlatforms.push(disappearPlatform);
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

    levelObjects.teleporter = [];
    for (let teleporterData of level.teleporter) {
        let teleporter = new Sprite(teleporterData.x, teleporterData.y, teleporterData.w, teleporterData.h);
        teleporter.img = teleporterImage;
        teleporter.physics = STATIC;
        teleporter.collider = "none";
        levelObjects.teleporter.push(teleporter);
    }

    levelObjects.laserBlasters = [];
    for (let laser of level.lasers) {
        let laserBlaster = new Laserbeam(laser.x, laser.y,
                                        laser.range, laser.speedData,
                                        laser.fwdDir, laserBlasterImage, ball);
        levelObjects.laserBlasters.push(laserBlaster);
    }

   /*  levelObjects.blackhole = [];
    for (let blackholeData of level.blackhole) {
        let blackhole = new Sprite(blackholeData.x, blackholeData.y, blackholeData.w, blackholeData.h);
       blackhole.physics = STATIC;
        blackhole.collider = "none";
        levelObjects.blackhole.push(blackhole);
    }*/

    // Creation of checkpoints
    levelObjects.checkpoints = [];
    for (let checkpointData of level.checkpoints) {

        let checkpoint = new CheckPoint(checkpointData.x, checkpointData.y, ball);

        levelObjects.checkpoints.push(checkpoint);
    }

    //Creation of enemies
    levelObjects.enemies = [];
    for (let enemyData of level.enemies || []) {
        let enemy = new Sprite(enemyData.startX, enemyData.startY, 50);
        enemy.color = 'gray';
        enemy.collider = 'kinematic';
        enemy.posA = { x: enemyData.startX, y: enemyData.startY };
        enemy.posB = { x: enemyData.endX, y: enemyData.endY };
        enemy.goingToB = true;
        let dx = enemy.posB.x - enemy.posA.x;
        let dy = enemy.posB.y - enemy.posA.y;
        let distAB = sqrt(dx * dx + dy * dy);
        if (distAB > 0) {
            enemy.vel.x = (dx / distAB) * (enemyData.speed || 2);
            enemy.vel.y = (dy / distAB) * (enemyData.speed || 2);
        }
        else {
            enemy.vel.x = 0;
            enemy.vel.y = 0;
        }
        levelObjects.enemies.push(enemy);
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

    // reset rectMode from modifications from pauseMenu
    rectMode(CORNER);
    
    // Name of level
    fill(0);
    textAlign(LEFT, TOP);
    textSize(24);
    text(`Level: ${levels[currentLevel].name}`, 20, 20);

    
    if (!pauseKey) {
        fill(255, 100, 100);
        stroke(0);
        strokeWeight(2);
        rect(pauseButtonBounds.x, pauseButtonBounds.y, pauseButtonBounds.w, pauseButtonBounds.h);
        
        fill(255);
        textAlign(CENTER, CENTER);
        textSize(12);
        text('Pause (P)', pauseButtonBounds.x + pauseButtonBounds.w/2, pauseButtonBounds.y + pauseButtonBounds.h/2);
    }
  




    
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


function mousePressed() {
    if (pauseKey) {
        let btnX = width/2, btnY = height/2 + 100;
        let btnW = 120, btnH = 40;

        if (mouseX >= btnX - btnW/2 && mouseX <= btnX + btnW/2 &&
            mouseY >= btnY - btnH/2 && mouseY <= btnY + btnH/2) {
            randomColor();
            return false;
        }
    } else {
        if (mouseX >= pauseButtonBounds.x && mouseX <= pauseButtonBounds.x + pauseButtonBounds.w &&
            mouseY >= pauseButtonBounds.y && mouseY <= pauseButtonBounds.y + pauseButtonBounds.h) {
            pauseKey = true;
            return false;
        }
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

function teleportation() {
    levelObjects.teleporter?.forEach(teleporter => {   //for each teleporter 
        if (dist(ball.x, ball.y, teleporter.x, teleporter.y) < 45 && teleporterActive == true) {    //if ball is 45 pixes from teleporter and the teleporter is activated
                if (teleporter === levelObjects.teleporter[0]) {
                    ball.x = levelObjects.teleporter[1].x;  //changes ball position to other teleporter
                    ball.y = levelObjects.teleporter[1].y;
                    //if(teleportSound) teleportSound.play(); 
                    teleporterActive = false;     //deactivates teleporter temporarily
                    beginTime = millis();         //logs the milliseconds when teleportation occured
                } else if (teleporter === levelObjects.teleporter[1] && teleporterActive == true) {
                    ball.x = levelObjects.teleporter[0].x;        
                    ball.y = levelObjects.teleporter[0].y;
                    //if(teleportSound) teleportSound.play(); 
                    teleporterActive = false;
                    beginTime = millis();
                   
            } 
    }
        if(millis() - beginTime >=3000){  //after a 3 second delay, teleporter can be used again
            teleporterActive = true;     //activates teleporter
        }

    }); 
}

// ============ Space Background =================
// SPACE: build once (or when canvas size changes)
function ensureSpaceAssets() {
  if (!bgStars || bgStars.length === 0 ||
      ensureSpaceAssets._w !== width || ensureSpaceAssets._h !== height) {
    buildBgStarfield();     // (re)create stars for current canvas
    ensureSpaceAssets._w = width;
    ensureSpaceAssets._h = height;
  }
}

function buildBgStarfield(){
  bgStars = [];
  for (let i = 0; i < STAR_COUNT; i++){
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

function drawBgStars(){
  for (const s of bgStars){
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

function drawBgSparkle(x, y, len, a){
  push();
  stroke(255, a);
  strokeWeight(1);
  line(x - len, y, x + len, y);
  line(x, y - len, x, y + len);
  pop();
}

function spawnBgMeteor(){
  const y = random(-height*0.1, height*0.6);
  return { x: width + random(40,140), y, vx: -random(8,15), vy: random(2.5,5.5), life: random(40,70), len: random(80,160) };
}

function updateBgMeteors(){
  blendMode(ADD);
  for (let i = bgMeteors.length - 1; i >= 0; i--){
    const m = bgMeteors[i];
    m.x += m.vx;
    m.y += m.vy;
    m.life--;

    const t = constrain(m.life/70, 0, 1);
    const a = 180 * t;

    noFill();
    stroke(170,220,255,a);
    strokeWeight(2);
    line(m.x, m.y, m.x - m.vx*(m.len/15)*t, m.y - m.vy*(m.len/15)*t);

    noStroke();
    fill(255,255,255,a);
    circle(m.x, m.y, 3 + 2*(1-t));

    if (m.life <= 0 || m.x < -200 || m.y > height + 200) {
      bgMeteors.splice(i, 1);
    }
  }
  blendMode(BLEND);
}

function drawDeepSky(g){
  g.push(); g.noStroke();
  const cx=g.width*0.55, cy=g.height*0.45;
  const maxR = dist(0,0, Math.max(cx,g.width-cx), Math.max(cy,g.height-cy));
  for (let r=maxR; r>0; r--){
    const t=r/maxR, col=g.lerpColor(g.color(2,6,18), g.color(0,0,0), 1 - (1-(t))*(1-(t)));
    g.fill(col); g.circle(cx,cy,r*2);
  }
  g.fill(255,18);
  for (let i=0; i<(g.width*g.height)/40000; i++) g.circle(random(g.width), random(g.height), random(0.5,1.2));
  g.drawingContext.save();
  g.drawingContext.globalCompositeOperation='multiply';
  const grd=g.drawingContext.createRadialGradient(g.width/2,g.height/2,Math.min(g.width,g.height)*0.2,g.width/2,g.height/2,Math.max(g.width,g.height)*0.75);
  grd.addColorStop(0,'rgba(255,255,255,1)'); grd.addColorStop(1,'rgba(0,0,0,0.75)');
  g.drawingContext.fillStyle=grd; g.rect(0,0,g.width,g.height); g.drawingContext.restore(); g.pop();
}

function easeOutQuad(x){ return 1 - (1 - x) * (1 - x); }

function smoothstep(e0, e1, x){
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
    drawSkyBackgroundAndClouds();
  }

  pop();
  camera.on();
}

function preload() {
    jumpSound = loadSound('../audio/jump.mp3');
    springSound = loadSound('../audio/spring.mp3');
	deathSound = loadSound('../audio/dead.mp3');
    teleportSound = loadSound('../audio/whoosh.mp3')

    unclaimedFlagImage = loadImage("../art/unclaimed_checkpoint.png", img => {
        
        img.resize(100, 100);
    });

    claimedFlagImage = loadImage("../art/claimed_checkpoint.png", img => {
        img.resize(100, 100);
    });

    spikeImage = loadImage("../art/spike.png", img => {
        img.resize(100, 100);
    });

    teleporterImage = loadImage("../art/teleportgreener.png", img => {
        img.resize(150, 150);
    });

    laserBlasterImage = loadImage('../art/laserMount.png', img => {
        img.resize(50, 50);
    })
}

function setup() {
    // makes the pixels not blurry
    noSmooth();

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

	// Space background init
    randomSeed(spaceSeed);
    noiseSeed(spaceSeed);
    buildBgStarfield();
}

function pauseMenu() {
    camera.off();
    
    fill(173, 216, 230, 200);  
    rectMode(CENTER);  
    rect(width/2, height/2, width * 0.8, height * 0.6); 

    fill(255, 216, 230, 255);  
    textAlign(CENTER, CENTER);
    textSize(32);
    text('Game Paused', width/2, height/2 - 100);

    textSize(20);
    text('Press P to resume', width/2, height/2 - 50);
    text('Press R to restart level', width/2, height/2);

    push();
    rectMode(CENTER);
    fill(255);
    stroke(0);
    rect(width/2, height/2 + 100, 120, 40, 10);

    fill(0);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(16);
    text("Random Color", width/2, height/2 + 100);
    pop();

    camera.on();
}


function update() {
    if (kb.pressed('P')) {
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
            if (!platform.speed) {
                platform.speed = 2;
            }

        });
        ball.physics = DYNAMIC;
        //drawSkyGradient(color(0,150,255), color(135,206,235));
    }

    // Camera handeler
    camera.x += (ball.x - camera.x) * 0.1;
    camera.y += (ball.y - camera.y) * 0.1;

	drawBackgroundForLevel();

    // Ball fall off map respawner
    if (ball.y > 700) {
        respawn();
    }

    levelObjects.laserBlasters?.forEach(laser => {
        laser.update();
    });
   // Disappearing Platform handler
    levelObjects.disappearingPlatforms?.forEach(platform => {
        // Check if ball is touching platform
        if (ball.colliding(platform) && !platform.playerTouched && !platform.isDisappearing && !platform.isReappearing) {
            platform.playerTouched = true;
            platform.isDisappearing = true;
            platform.fadeTimer = 0;
        }
        
        // Handle disappearing animation
        if (platform.isDisappearing) {
            platform.fadeTimer++;
            // Fade out over 5 sec 
            platform.opacity = map(platform.fadeTimer, 0, 300, 255, 0);
            
            // Update platform visibility
            let r = red(platform.baseColor);
            let g = green(platform.baseColor);
            let b = blue(platform.baseColor);
            platform.color = color(r, g, b, platform.opacity);
            
            // When fully faded cant touch
            if (platform.fadeTimer >= 300) {
                platform.collider = 'none';
                platform.isDisappearing = false;
                platform.isReappearing = true;
                platform.fadeTimer = 0;
            }
        }
        
        // Handle reappearing animation
        if (platform.isReappearing) {
            platform.fadeTimer++;
            // Wait 3 seconds 
            if (platform.fadeTimer > 180) {
                platform.opacity = map(platform.fadeTimer, 180, 240, 0, 255);
                
                // Update platform visibility
                let r = red(platform.baseColor);
                let g = green(platform.baseColor);
                let b = blue(platform.baseColor);
                platform.color = color(r, g, b, platform.opacity);
            }
            
            // When fully reappeared, reset
            if (platform.fadeTimer >= 240) {
                platform.collider = 'static';
                platform.isReappearing = false;
                platform.playerTouched = false;
                platform.opacity = 255;
                platform.color = platform.baseColor;
            }
        }
    });
    // Moving Platform handler
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

    //Enemy Movement Handler
    levelObjects.enemies?.forEach(enemy => {
        let target = enemy.goingToB ? enemy.posB : enemy.posA;
        let dx = target.x - enemy.x;
        let dy = target.y - enemy.y;
        let dot = dx * enemy.vel.x + dy * enemy.vel.y;
        if (dot < 0) {
            enemy.vel.x = -enemy.vel.x;
            enemy.vel.y = -enemy.vel.y;
            enemy.goingToB = !enemy.goingToB;
        }
    });

    // Spring Handler
    levelObjects.springs?.forEach(spring => {
        if (ball.colliding(spring)) {
            ball.vel.y = -15;
            if (springSound) springSound.play();
        }
    });

    // Jump reset Handler
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
            // when grounded we can assume vel.y is 0
            // we can just increment the vel.y by the jump-strength
            ball.vel.y += -7;
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

    //Enemy Collision Handler
    levelObjects.enemies?.forEach(enemy => {
        if (ball.colliding(enemy)) {
            respawn();
        }
    });
    
    // Checkpoint update
    levelObjects.checkpoints?.forEach(checkpoint => {
        checkpoint.update();
    });

    teleportation (); //teleporter check

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
