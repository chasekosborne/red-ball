new Q5();
new Canvas();

world.gravity.y = 10;

// collection of images
let unclaimedFlagImage;
let claimedFlagImage;
let spikeImage;
let laserBlasterImage;
let hammerImage;
let asteriod_sprites;

let colorButtonBounds = { x: 20, y: 100, w: 100, h: 30 };
let pauseButtonBounds = { x: 20, y: 140, w: 100, h: 30 };
let ball;
let respawnPosition = [500, 150];
let jumpSound;
let deathSound;
let ballSkinImage;
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
let presspause = false;
let teleporter;
let teleporterImage;
let teleporterActive = true;   
let beginTime = millis();
let pauseOverlayEl;
let blackhole;
let blackholeImage;
let difficulty = 'normal';
let lives = Infinity;
let globalVolume = 0.5;

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

// ================ Level Editor Tools ======================
let editor = {
  enabled: false,
  tool: 'ground',          // 'ground' | 'platform' | 'spring' | 'spike' | 'checkpoint' | 'goal'
  grid: 20,
  dragStart: null,         // {x,y} while drawing rectangles
  spikeDir: 'up'           // 'up' | 'down' | 'left' | 'right'
};

// List of editor tools (cycle with 1/2)
const TOOL_LIST = [
  'ground',
  'platform',
  'spring',
  'spike',
  'checkpoint',
  'goal',
  'enemy',
  'teleporter',
  'laser',
  'disappearingPlatform',
  'swingingHammer'
];

// editor defaults for multi-step tools / orientation
editor.toolIndex = TOOL_LIST.indexOf(editor.tool);
editor.spikeDir = editor.spikeDir || 'up';          // 'up'|'right'|'down'|'left'
editor.laserDir = editor.laserDir || 'down';        // 'up'|'right'|'down'|'left'
editor.dragStart = null;                            // for rectangle tools
editor.staging = null;                              // for 2-click tools (enemy)

//================================ End Level Editor Tools =====================================

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
            name: "Dev Room",
			      theme: "space", 
            respawnPosition: [500, 150],
            ballColor: 'red',

            goalPosition: { x: 5000, y: 50 },

            platforms: [
                { x: 600, y: 250, w: 120, h: 20, color: 'orange', moving: true, speed: 2, minX: 200, maxX: 1000 },
                { x: 850, y: 200, w: 120, h: 20, color: 'orange', moving: false, fake: 'true'} // acting oddly
            ],
            disappearingPlatforms: [
                { x: 1080, y: 0, w: 120, h: 20 },
            ],

            ground: [
                { x: 500, y: 350, w: 800, h: 40 },
                { x: 2000, y: 100, w: 1000, h: 40 },
                { x: 1800, y: 250, w: 400, h: 40 },
                { x: 3200, y: 100, w: 1000, h: 40 },
                { x: 4400, y: 100, w: 1000, h: 40 },
            ],
            springs: [
                { x: 1200, y: 350, w: 200, h: 40 }
            ],
            spikes: [
                { x: 800, y: 306, orientation: "up" }
            ],
            checkpoints: [
                { x: 1800, y: 50 }
            ],

            enemies: [
                { startX: 2100, startY: 50, endX: 2200, endY: 50, speed: 1 }
            ],
            
            lasers: [
                { x: 200, y: 100, range: 300, speedData: { speed: 3, bulletSpeed: 8 }, fwdDir: DOWN },
                { x: 1500, y: 600, range: 300, speedData: { speed: 3, bulletSpeed: 8 }, fwdDir: UP },
            ],

            asteriodFields: [
                { x: 4000, y: -600, range: 400, fallSpeed: 4, burstCount: 4, timeInterval: 3 }
            ],

            swingingHammers: [
                {
                    pivotX: 2800,
                    pivotY: -400,
                    length: 200,
                    amplitude: 50,
                    speed: 2,
                    phase: 0,
                    width: 780,
                    height: 800,
                    spikeHeight: 200,
                    scale: 0.3
                }
            ],
            teleporter: [
                { x: 150, y: 300, w: 60, h: 60 },
                { x: 1800, y: 200, w: 60, h: 60 },
            ],
              
            blackhole: [
              { x: 2200, y: 250, w: 120, h: 120 },
              { x: 2600, y: 250, w: 120, h: 120 },
            ],
 
            instructions: "Use SPACE to jump and arrow keys to move!",
            signs: [],
        },

        {
            name: "Tutorial",
            theme: "sky",
            respawnPosition: [125, 150],
            ballColor: "red",
           platforms: [
                { "x": 2250, "y": 0, "w": 120, "h": 20, "color": "orange", "moving": true, "speed": 2, "minX": 2231, "maxX": 2683 }
            ],
           ground: [
                { "x": 550, "y": 350, "w": 1000, "h": 40 },
                { "x": 1800, "y": 0, "w": 700, "h": 40 },
                { "x": 3100, "y": 0, "w": 700, "h": 40 },
                { "x": 3125, "y": -420, "w": 20, "h": 800 },
                { "x": 4701, "y": 0, "w": 500, "h": 40 },
                { "x": 550, "y": 120, "w": 1000, "h": 40 },
                { "x": 60, "y": 235, "w": 20, "h": 190}
            ],
            springs: [
                { "x": 1250, "y": 425, "w": 200, "h": 40 }
            ],
            spikes: [
                { "x": 780, "y": 307, "orientation": "up" },
                { "x": 420, "y": 307, "orientation": "up" },
                { "x": 480, "y": 307, "orientation": "up" },
                { "x": 540, "y": 307, "orientation": "up" },
                { "x": 600, "y": 307, "orientation": "up" },
                { "x": 660, "y": 307, "orientation": "up" },
                { "x": 720, "y": 307, "orientation": "up" }
            ],
            checkpoints: [
                { "x": 1600, "y": -45 }
            ],
            enemies: [
                { "startX": 2080, "startY": -60, "endX": 2080, "endY": -200, "speed": 30 }
            ],
            lasers: [],
            disappearingPlatforms: [
                { "x": 3950, "y": 0, "w": 1000, "h": 40 }
            ],
            swingingHammers: [],
            teleporter: [
                { "x": 3030, "y": -49, "w": 60, "h": 40 },
                { "x": 3230, "y": -49, "w": 100, "h": 100 }
            ],
            blackhole: [],
            goalPosition: { "x": 4790, "y": -82 },
            instructions: "",
            signs: [
              { x: 225, y: 220, text: "Welcome to Epsilon's Greatest Ball! Use the arrow keys to move left/right", size: 8, color: 'black' },
              { x: 600, y: 200, text: "Press space to jump. Double jump by pressing space twice in order to avoid these!", size: 10, color: 'black' },
              { x: 1250, y: 300, text: "Jump onto the spring to launch yourself in the air!", size: 10, color: 'black' },
              { x: 1600, y: -90, text: "This checkpoint allows you to respawn here after you die.", size: 10, color: 'black' },
              { x: 1875, y: -140, text: "Double jump over this hazard and land on the moving platform!", size: 10, color: 'black' },
              { x: 2900, y: -130, text: "Use the teleporter to bypass this wall.", size: 10, color: 'black' },
              { x: 3900, y: -140, text: "Go quickly across this platform! It starts disappearing after you touch it!", size: 12, color: 'black' },
              { x: 4700, y: -170, text: "Congratulations! You will encounter more obstacles as you go along, and check the How To Play menu if you ever forget anything!", size: 12, color: 'black' },
            ]
        },

        {
            name: "Level 1",
            theme: "sky", 
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
                { x: 2960, y: -1045 }
            ],
            
		   	enemies: [],

            lasers: [],

            disappearingPlatforms: [],

            swingingHammers: [],

            teleporter: [],

            blackhole: [], 

            goalPosition: { x: 5400, y: -1050 }, 

            instructions: "",

            signs: [],
        },

        {
          name: "Level 2",
          theme: "space",
          respawnPosition: [500,150],
          ballColor: 'red',
          platforms: [],

          disappearingPlatforms: [
            {x: 950,y: 390,w: 100,h: 20},
            {x: 1260,y: 390,w: 80,h: 20},
          ],

          ground: [
            {x: 450,  y: 390, w: 580,   h: 20},
            {x: 1650, y: 390, w: 220,   h: 20},
            {x: 2260, y: 70,  w: 680,   h: 20},
            {x: 2600, y: 360, w:  20,   h: 600},
            {x: 2790, y: 260, w:  20,   h: 400},
            {x: 3260, y: 650, w:  1300, h: 20},
            {x: 3190, y: 620, w:  20,   h: 40},
            {x: 3550, y: 620, w:  20,   h: 40},
            {x: 4100, y: 260, w:  180,  h: 20},
            {x: 4560, y: 260, w:  800,  h:20,},
            {x: 5090, y: 260, w:  260,  h: 20},
          ],
        
          springs: [
            {x: 1800,y: 390,w: 80,h: 20},
            {x: 3720,y: 630,w: 80,h: 20}
          ],
        
          spikes: [
            {x: 2640,y: 615,orientation:"up"},
            {x: 2880,y: 615,orientation:"up"},
            {x: 3120,y: 615,orientation:"up"}
          ],
        
          checkpoints: [
            {x: 1660,y: 360},
            {x: 2730,y: 610},
          ],
        
          enemies: [
            {startX: 3240,startY: 615,endX: 3520,endY: 615,speed: 1},
          ],
          
          lasers: [
            {x: 820,  y: 140, range: 300, speedData:  {speed: 3,bulletSpeed: 8},fwdDir:DOWN},
            {x: 1100, y: 140, range: 320, speedData: {speed: 3,bulletSpeed: 8},fwdDir: DOWN},
            {x: 1400, y: 140, range: 320, speedData: {speed: 3,bulletSpeed: 8},fwdDir: DOWN},
            {x: 1680, y: -60, range: 300, speedData: {speed: 3,bulletSpeed: 8},fwdDir: RIGHT},
            {x: 2900, y: -60, range: 300, speedData: {speed: 3,bulletSpeed: 8},fwdDir: LEFT},
            {x: 3020, y: 340, range: 360, speedData: {speed: 3,bulletSpeed: 8},fwdDir: DOWN},
            {x: 3360, y: 340, range: 360, speedData: {speed: 3,bulletSpeed: 8},fwdDir: DOWN},
          ],

          asteriodFields: [
                { x: 4580, y: -300, range: 600, fallSpeed: 4, burstCount: 4, timeInterval: 3 }
          ],

          swingingHammers: [],
          teleporter: [],
          blackhole: [
            { x: 1950,y: 250,  w: 20,  h: 20 },
            { x: 3685,y: 250,  w: 80,  h: 20 },
          ],
          goalPosition:  { x: 5180, y: 180 },
          instructions: ""
        },

        {
            name: "Level 3",
			      theme: "sky", 
            respawnPosition: [500, 150],
            ballColor: 'red',
            platforms: [],
            disappearingPlatforms: [],
            ground: [{"x": 450,"y": 390,"w": 580,"h": 20}],
            springs: [],
            spikes: [],
            checkpoints: [{"x": 260, "y": 340 }],
            enemies: [],
            lasers: [],
            asteriodFields: [],
            swingingHammers: [],
            teleporter: [],
            blackhole: [],
            goalPosition: { x: 1900, y: 300 }, 
            instructions: "",
            signs: [],
        },
        
        /* Add more levels here  Be sure to use the template as seen above
          {
            name: "Level 3",
			      theme: "sky", 
            respawnPosition: [500, 150],
            ballColor: 'red',
            platforms: [],
            disappearingPlatforms: [],
            ground: [{"x": 450,"y": 390,"w": 580,"h": 20}],
            springs: [],
            spikes: [],
            checkpoints: [{"x": 260, "y": 340 }],
            enemies: [],
            lasers: [],
            asteriodFields: [],
            swingingHammers: [],
            teleporter: [],
            blackhole: [],
            goalPosition: { x: 1900, y: 300 }, 
            instructions: "",
            signs: [],
          },
        */

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
  if (!ball) return;

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
      if (difficulty === 'hard') {
        lives--;
        if (lives <= 0) {
          loadLevel(currentLevel);
          return;
        }
      }
      explodeAndRespawn();

      if(deathSound.isLoaded()) {
        deathSound.setVolume(globalVolume);
        deathSound.play();
      }
      
    }
}

async function loadLevel(levelIndex) {
  await clearLevel();
  
  currentLevel = levelIndex;
  const level = levels[currentLevel];

  console.log(`Current Level = ${currentLevel} | levels.length -> ${levels.length}`);

  if (level) {
      currentBgTheme = level.theme || BG_SKY;
      
      // set the player reset spawn point based on the level on level-load
      respawnPosition[0] = level.respawnPosition[0];
      respawnPosition[1] = level.respawnPosition[1];
      
      // This is to reset the ball
      if (!ball) {
          // Creation of out fun little ball
          ball = new Sprite();
          ball.drag = 0.4;
          ball.textSize = 40;
          //ball.text = ":)";
          ball.diameter = 50;
          ball.img = ballSkinImage;
      }

    ball.x = respawnPosition[0];
    ball.y = respawnPosition[1];

    ball.color = level.ballColor;
    ball.vel.x = 0;
    ball.vel.y = 0;
      jumpCount = 0;
      
      // Handles ground creation
      levelObjects.ground = [];
      for (let groundData of level.ground || []) {
        let ground = new Sprite(groundData.x, groundData.y, groundData.w, groundData.h);
        ground.physics = STATIC;
        ground.color = 'green';
        levelObjects.ground.push(ground);
      }
      
      // Creation of platforms
      levelObjects.platforms = [];
      for (let platformData of level.platforms || []) {
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
      for (let springData of level.springs || []) {
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
      for (let spikeData of level.spikes || []) {
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
      for (let teleporterData of level.teleporter || []) {
        let teleporter = new Sprite(teleporterData.x, teleporterData.y, teleporterData.w, teleporterData.h);
        teleporter.img = teleporterImage;
        teleporter.physics = STATIC;
        teleporter.collider = "none";
        levelObjects.teleporter.push(teleporter);
      }
    
      levelObjects.laserBlasters = [];
      for (let laser of level.lasers || []) {
        let laserBlaster = new Laserbeam(laser.x, laser.y,
                                        laser.range, laser.speedData,
                                        laser.fwdDir, laserBlasterImage, ball);
        levelObjects.laserBlasters.push(laserBlaster);
      }
    
      levelObjects.asteriodFields = [];
      for (let field of level.asteriodFields || []) {
        let asteriodField = new AsteriodField(field.x, field.y, field.range,
                                            field.fallSpeed, field.burstCount,
                                            field.timeInterval, ball);
        levelObjects.asteriodFields.push(asteriodField);
      }
    
      levelObjects.blackhole = [];
      for (let blackholeData of level.blackhole || []) {
        let blackhole = new Sprite(blackholeData.x, blackholeData.y, blackholeData.w, blackholeData.h);
        blackhole.physics = STATIC;
        blackhole.collider = "none";
        blackhole.img = blackholeImage; 
        levelObjects.blackhole.push(blackhole);
      }
    
      // Creation of checkpoints
      levelObjects.checkpoints = [];
      for (let checkpointData of level.checkpoints || []) {
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
    
      //Creation of swinging hammer
      levelObjects.swingingHammers = [];
      for (let hammerData of level.swingingHammers || []) {
        let hammer = new Sprite(hammerData.pivotX, hammerData.pivotY + hammerData.length, hammerData.width * hammerData.scale, hammerData.height * hammerData.scale);
        hammer.img = hammerImage;
        hammer.collider = 'none';
        hammer.rotationLock = false;
        let spikeHeight = typeof hammerData.spikeHeight == 'number' ? hammerData.spikeHeight * hammerData.scale : hammerData.height * hammerData.scale * (hammerData.spikeHeight || 0.33);
        let spikeHitbox = new Sprite (hammerData.pivotX, hammerData.pivotY + hammerData.length + spikeHeight / 2, hammerData.width * hammerData.scale, spikeHeight);
        spikeHitbox.collider = 'kinematic'
        spikeHitbox.rotationLock = false;
        spikeHitbox.visible = false;
        levelObjects.spikes.push(spikeHitbox);
        levelObjects.swingingHammers.push({
            pivotX: hammerData.pivotX,
            pivotY: hammerData.pivotY,
            length: hammerData.length,
            amplitude: hammerData.amplitude,
            speed: hammerData.speed,
            currentAngle: hammerData.phase,
            direction: 1,
            sprite: hammer,
            spikeHitbox: spikeHitbox,
            width: hammerData.width,
            height: hammerData.height,
            spikeHeight: spikeHeight,
            scale: hammerData.scale
        });
      }
  }
}

async function clearLevel() {
    Object.values(levelObjects).forEach(objectArray => {
        if (Array.isArray(objectArray)) {
            objectArray.forEach(obj => {

                // Check for non-sprite objects and run their
                // cleanup method
                if (obj instanceof CheckPoint) {
                    obj.dtor();
                } else if (obj instanceof Laserbeam) {
                    obj.dtor();
                } else if (obj instanceof AsteriodField) {
                    obj.dtor();
                } else {
                    // normal sprite cleanup handling
                    if (obj.sprite) {
                        obj.sprite.remove();
                    } else if (obj.remove) {
                        obj.remove();
                    }
                }

            });
        }
    });

    levelObjects = {};
    await new Promise(resolve => setTimeout(resolve, 1));
}

function nextLevel() {
    if (currentLevel < levels.length - 1) {
        console.log("Moving to next Level");
        loadLevel(currentLevel + 1);
    } else {
        console.log("YOU WINNN!!!!!!!!!!!! WOWW!!!!!");
    }
}

function checkLevelCompletion() {
    const level = levels[currentLevel];
    if (ball && level.goalPosition) {
        let distance = dist(ball.x, ball.y, level.goalPosition.x, level.goalPosition.y);
        if (distance < 60) {
            nextLevel();
        }
    }
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

    if(difficulty == 'hard') {
      fill(textColor);
      textSize(24);
      noStroke();
      text(`Lives: ${lives}`, 61, 60)
    }



    
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

function explodeAndRespawn() {
    if (!ball) return;

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

        if (ball) fill(ball.color); else fill(color(255, 255, 255));
        rect(p.x, p.y, 6, 6);

        if (p.life <= 0) particles.splice(i, 1);
    }
}

function teleportation() {
    if (!ball) return;

    levelObjects.teleporter?.forEach(teleporter => {   //for each teleporter 
        if (dist(ball.x, ball.y, teleporter.x, teleporter.y) < 45 && teleporterActive == true) {    //if ball is 45 pixes from teleporter and the teleporter is activated
                if (teleporter === levelObjects.teleporter[0]) {
                    ball.x = levelObjects.teleporter[1].x;  //changes ball position to other teleporter
                    ball.y = levelObjects.teleporter[1].y;
                    if(teleportSound && teleportSound.isLoaded()) {
                      teleportSound.setVolume(globalVolume);
                      teleportSound.play(); 
                    } 

                    teleporterActive = false;     //deactivates teleporter temporarily
                    beginTime = millis();         //logs the milliseconds when teleportation occured
                } else if (teleporter === levelObjects.teleporter[1] && teleporterActive == true) {
                    ball.x = levelObjects.teleporter[0].x;        
                    ball.y = levelObjects.teleporter[0].y;
                    if(teleportSound) teleportSound.play(); 
                    teleporterActive = false;
                    beginTime = millis();
                   
            } 
    }
        if(millis() - beginTime >=3000){  //after a 3 second delay, teleporter can be used again
            teleporterActive = true;     //activates teleporter
        }

    }); 
}

function blackholeAttraction() {
    if (!ball) return;

    levelObjects.blackhole?.forEach(blackhole => {   //for each blackhole 
        let distanceBlackhole = dist(ball.x, ball.y, blackhole.x, blackhole.y);
        let attractionField = 150;
        if (distanceBlackhole < attractionField) {   
            let distanceBetweenX = blackhole.x - ball.x;   //calculates distance between redball and blackhole
            let distanceBetweenY = blackhole.y - ball.y;   
            forceOnY = (1.2 * distanceBetweenY)/100; //calculates force on ball based on distance between redball and blackhole. Uses a constant and divisor to adjust force strength
            forceOnX = (1.2 * distanceBetweenX)/100;   
            ball.vel.x += forceOnX; //applies force to ball velocity
            ball.vel.y += forceOnY
          if (distanceBlackhole < 60) {  
            respawn();  //if ball is too close to blackhole, it explodes
            deathSound.play();
          }
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

// ============= Level Editor =======================

function drawEditorBanner() {
  camera.off();
  push();

  // preserve scale/shear
  const t = drawingContext.getTransform();  // DOMMatrix
  drawingContext.save();
  drawingContext.setTransform(t.a, t.b, t.c, t.d, 0, 0);

  rectMode(CORNER);
  noStroke();

  // clear strip
  fill(0);
  rect(0, 0, width, 28);

  // optional tint
  fill(0, 160);
  rect(0, 0, width, 28);

  // fresh text
  fill(255);
  textAlign(LEFT, CENTER);
  textSize(12);
  text(
    `EDITOR – tool: ${editor.tool} | 1:prev  2:next | R:rotate spike/laser | E:toggle | S:save`,
    8, 14
  );

  drawingContext.restore();
  pop();
  camera.on();
}

function worldMouseRaw() {
  // screen -> world, no grid snap (best for precise picking)
  return { x: mouseX + camera.x - halfWidth, y: mouseY + camera.y - halfHeight };
}

// pick radius in pixels (bump if needed)
const PICK_RADIUS = 70; // was 50; a bit more forgiving

function mousePressed() {
  // If the editor is enabled, priority goes to editor placement
  if (editor.enabled) {
    const p = worldMouse(); // snapped

    // Rectangle-by-drag tools
    if (['ground','platform','spring','teleporter','disappearingPlatform'].includes(editor.tool)) {
      editor.dragStart = p;
      return false;
    }

    // Single-click tools
    if (editor.tool === 'spike') {
      (levels[currentLevel].spikes ||= []).push({
        x: p.x, y: p.y, orientation: editor.spikeDir
      });
      
      loadLevel(currentLevel);
      return false;
    }

    if (editor.tool === 'checkpoint') {
      (levels[currentLevel].checkpoints ||= []).push({ x: p.x, y: p.y });
      
      loadLevel(currentLevel);
      return false;
    }

    if (editor.tool === 'goal') {
      levels[currentLevel].goalPosition = { x: p.x, y: p.y };
      
      loadLevel(currentLevel);
      return false;
    }

    // Two-click tool: enemy (click A = start, click B = end)
    if (editor.tool === 'enemy') {
      if (!editor.staging) {
        editor.staging = { startX: p.x, startY: p.y };
      } 
      else {
        const a = editor.staging;
        (levels[currentLevel].enemies ||= []).push({
          startX: a.startX, startY: a.startY,
          endX: p.x, endY: p.y,
          speed: 1
        });
        editor.staging = null;
        
        loadLevel(currentLevel);
      }
      return false;
    }

    // Single-click with defaults: laser, swingingHammer
    if (editor.tool === 'laser') {
      (levels[currentLevel].lasers ||= []).push({
        x: p.x, y: p.y,
        range: 300,
        speedData: { speed: 3, bulletSpeed: 8 },
        fwdDir: editor.laserDir.toUpperCase()   // UP/DOWN/LEFT/RIGHT
      });
      
      loadLevel(currentLevel);
      return false;
    }

    if (editor.tool === 'swingingHammer') {
      (levels[currentLevel].swingingHammers ||= []).push({
        pivotX: p.x,
        pivotY: p.y,
        length: 200,
        amplitude: 50,
        speed: 2,
        phase: 0,
        width: 780,
        height: 800,
        spikeHeight: 200,
        scale: 0.3
      });
      
      loadLevel(currentLevel);
      return false;
    }

    return false; // consume clicks while editing
  }

  // --- normal (non-editor) clicks: pause button & pause-menu button ---
  if (pauseKey) {
    // Example "Random Color" button in pause menu
    const btnX = width/2, btnY = height/2 + 100, btnW = 120, btnH = 40;
    if (mouseX >= btnX - btnW/2 && mouseX <= btnX + btnW/2 &&
        mouseY >= btnY - btnH/2 && mouseY <= btnY + btnH/2) {
      randomColor();
      return false;
    }
  } else {
    // On-screen Pause button
    if (mouseX >= pauseButtonBounds.x && mouseX <= pauseButtonBounds.x + pauseButtonBounds.w &&
        mouseY >= pauseButtonBounds.y && mouseY <= pauseButtonBounds.y + pauseButtonBounds.h) {
      presspause = true;
      return false;
    }
  }
}


function mouseReleased() {
  // Only finish a drag if the editor is on and a drag started
  if (!editor.enabled || !editor.dragStart) return;

  const a = editor.dragStart;
  const b = worldMouse();

  // Convert two corners -> center + size
  const x = (a.x + b.x) / 2;
  const y = (a.y + b.y) / 2;
  const w = Math.abs(b.x - a.x);
  const h = Math.abs(b.y - a.y);

  // ignore tiny drags (prevents accidental clicks)
  const MIN = 2;
  if (w < MIN || h < MIN) {
    editor.dragStart = null;
    return;
  }

  let placed = false;

  // Ground
  if (editor.tool === 'ground') {
    (levels[currentLevel].ground ||= []).push({ x, y, w, h });
    placed = true;
  }

  // Platform
  else if (editor.tool === 'platform') {
    (levels[currentLevel].platforms ||= []).push({
      x, y, w, h,
      color: 'orange',
      moving: false
    });
    placed = true;
  }

  // Spring
  else if (editor.tool === 'spring') {
    (levels[currentLevel].springs ||= []).push({ x, y, w, h });
    placed = true;
  }

  // Teleporter
  else if (editor.tool === 'teleporter') {
    (levels[currentLevel].teleporter ||= []).push({ x, y, w, h });
    placed = true;
  }

  // Disappearing Platform
  else if (editor.tool === 'disappearingPlatform') {
    (levels[currentLevel].disappearingPlatforms ||= []).push({ x, y, w, h });
    placed = true;
  }

  // For non-rectangle tools (spike, checkpoint, goal, laser, enemy, swingingHammer),
  // placement happens on mousePressed()

  editor.dragStart = null;

  // Rebuild sprites
  if (placed) {
    loadLevel(currentLevel);
  }
}

// Mouse for Level
function worldMouse() {
  const wx = mouseX + camera.x - halfWidth;
  const wy = mouseY + camera.y - halfHeight;
  // snap to grid
  const g = editor.grid;
  return { x: Math.round(wx/g)*g, y: Math.round(wy/g)*g };
}

//============================ End Level Editor ======================================

function preload() {
    jumpSound = loadSound('../audio/jump.mp3');
    springSound = loadSound('../audio/spring.mp3');
	deathSound = loadSound('../audio/dead.mp3');
    teleportSound = loadSound('../audio/whoosh.mp3');

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

    // multiple asteriod sprites
    asteriod_sprites = [];
    asteriod_sprites.push(
        loadImage("../art/pixel_asteriod_sprite.png", img => {
            img.resize(100, 100);
        })
    );
    asteriod_sprites.push(
        loadImage("../art/pixel_asteriod_sprite_2.png", img => {
            img.resize(100, 100);
        })
    );

    hammerImage = loadImage("../art/hammer.png", img => {
        console.log("hammer loaded");
    });

    blackholeImage = loadImage("../art/blackhole.png", img => {
        img.resize(300, 200);
    });
   
    
    ballSkinImage = loadImage("../art/8ball.png", img => {
        img.resize(125, 125);
    });
}




function buildPauseOverlay() {
  // === Outer overlay ===
  pauseOverlayEl = document.createElement('div');
  pauseOverlayEl.id = 'pauseOverlay';
  pauseOverlayEl.style.cssText = `
    position: fixed;
    inset: 0;
    display: none;
    z-index: 9999;
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(8px);
    justify-content: center;
    align-items: center;
    font-family: 'Arial', sans-serif;
  `;

  // === Inner glass panel ===
  const panel = document.createElement('div');
  panel.style.cssText = `
    width: min(90vw, 900px);
    padding: 50px 60px;
    border-radius: 24px;
    background: rgba(255, 255, 255, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 8px 32px rgba(0,0,0,0.3);
    color: white;
    text-align: center;
  `;
  pauseOverlayEl.appendChild(panel);

  // === Title ===
  const h1 = document.createElement('h1');
  h1.textContent = 'Game Paused';
  h1.style.cssText = `
    font-size: 60px;
    margin: 0 0 25px;
    color: white;
    text-shadow: 0 0 15px rgba(255,255,255,0.8);
  `;
  panel.appendChild(h1);

  // === Instructions ===
  const tip1 = document.createElement('div');
  tip1.textContent = 'Press P to Resume';
  tip1.style.cssText = `
    font-size: 22px;
    margin: 10px 0;
    color: rgba(255,255,255,0.9);
  `;
  panel.appendChild(tip1);

  const tip2 = document.createElement('div');
  tip2.textContent = 'Press R to Restart Level';
  tip2.style.cssText = `
    font-size: 22px;
    margin-bottom: 40px;
    color: rgba(255,255,255,0.9);
  `;
  panel.appendChild(tip2);

  // === Color Picker Section ===
  const colorSection = document.createElement('div');
  colorSection.style.cssText = `
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    margin-bottom: 50px;
  `;

  const colorLabel = document.createElement('div');
  colorLabel.textContent = 'Choose Ball Color';
  colorLabel.style.cssText = `
    font-size: 20px;
    color: rgba(255,255,255,0.95);
  `;
  colorSection.appendChild(colorLabel);

  const colorPicker = document.createElement('input');
  colorPicker.type = 'color';
  colorPicker.value = '#ff0000';
  colorPicker.style.cssText = `
    width: 90px;
    height: 45px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    box-shadow: 0 0 10px rgba(0,0,0,0.3);
  `;
  colorPicker.oninput = (e) => {
    if (typeof changeBallColor === 'function') {
      changeBallColor(e.target.value);
    }
  };
  colorSection.appendChild(colorPicker);

  panel.appendChild(colorSection);

  // === Bottom buttons ===
  const bottomButtons = document.createElement('div');
  bottomButtons.style.cssText = `
    display: flex;
    justify-content: center;
    gap: 40px;
  `;
  panel.appendChild(bottomButtons);

  // Resume Button
  const resumeBtn = document.createElement('button');
  resumeBtn.textContent = 'Resume';
  resumeBtn.style.cssText = `
    padding: 14px 28px;
    font-size: 20px;
    border-radius: 12px;
    border: 2px solid rgba(0,255,150,0.7);
    background: rgba(0,255,150,0.3);
    color: white;
    cursor: pointer;
    transition: all 0.2s;
  `;
  resumeBtn.onmouseenter = () => resumeBtn.style.background = 'rgba(0,255,150,0.5)';
  resumeBtn.onmouseleave = () => resumeBtn.style.background = 'rgba(0,255,150,0.3)';
  resumeBtn.onclick = () => { pauseKey = false; hidePauseOverlay(); };
  bottomButtons.appendChild(resumeBtn);

  // Quit Button
  const quitBtn = document.createElement('button');
  quitBtn.textContent = 'Quit Game';
  quitBtn.style.cssText = `
    padding: 14px 28px;
    font-size: 20px;
    border-radius: 12px;
    border: 2px solid rgba(255,100,100,0.8);
    background: rgba(255,100,100,0.4);
    color: white;
    cursor: pointer;
    transition: all 0.2s;
  `;
  quitBtn.onmouseenter = () => quitBtn.style.background = 'rgba(255,100,100,0.6)';
  quitBtn.onmouseleave = () => quitBtn.style.background = 'rgba(255,100,100,0.4)';
  quitBtn.onclick = () => { location.reload(); }; // Back to menu
  bottomButtons.appendChild(quitBtn);

  // === Final mount ===
  document.body.appendChild(pauseOverlayEl);
}

// Show / hide helpers
function showPauseOverlay() {
  if (pauseOverlayEl) pauseOverlayEl.style.display = 'flex';
}

function hidePauseOverlay() {
  if (pauseOverlayEl) pauseOverlayEl.style.display = 'none';
}


  
  function showPauseOverlay() {
    if (pauseOverlayEl) pauseOverlayEl.style.display = 'flex';
  }
  
  function hidePauseOverlay() {
    if (pauseOverlayEl) pauseOverlayEl.style.display = 'none';
}

// performs an aggressive cleaning of the canvas
function forceClean() {
    // clear drawing space
    clear();
    // remove all sprites from the scene
    allSprites.remove();
}

function setup() {
    createCanvas(windowWidth, windowHeight);

    // jumpSound.loop();
    // makes the pixels not blurry
    noSmooth();

    // Initialization pretty cool stuff
    initializeLevels();

	// Space background init
    randomSeed(spaceSeed);
    noiseSeed(spaceSeed);

    buildBgStarfield();
    buildPauseOverlay();

  const picker = document.getElementById('colorPicker');
  picker.addEventListener('input', () => {
  const chosenColor = picker.value;
    if (ball) {
      ball.color = chosenColor;
      levels[currentLevel].ballColor = chosenColor;
    }
  });
}

function pauseMenu() {
    camera.off(); // Draw UI directly in screen space
    push();
    noStroke();
    fill(255, 255, 255, 400); // semi-transparent black overlay
    rectMode(CORNER);
    rect(0, 0, width, height);
  
    // === Glass panel ===
    const panelW = width * 0.7;
    const panelH = height * 0.6;
    const panelX = width / 2 - panelW / 2;
    const panelY = height / 2 - panelH / 2;
  
    // translucent white "glass"
    drawingContext.save();
    drawingContext.shadowBlur = 40;
    drawingContext.shadowColor = "rgba(255,255,255,0.4)";
    fill(255, 255, 255, 50);
    stroke(255, 255, 255, 100);
    strokeWeight(2);
    rect(panelX, panelY, panelW, panelH, 30);
    drawingContext.restore();
  
    // === Title ===
    fill(255);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(60);
    text("Game Paused", width / 2, height / 2 - 120);
  
    // === Sub text ===
    textSize(28);
    fill(255, 230);
    text("Press P to Resume", width / 2, height / 2 - 40);
    text("Press R to Restart Level", width / 2, height / 2 + 10);
  
    // === Buttons ===
    const btnY = height / 2 + 100;
    const btnW = 180;
    const btnH = 50;
  
    // Resume Button
    fill(255, 255, 255, 40);
    stroke(255, 255, 255, 150);
    strokeWeight(2);
    rect(width / 2 - btnW - 10, btnY, btnW, btnH, 12);
    noStroke();
    fill(255);
    textSize(24);
    text("Resume", width / 2 - btnW / 2 - 10, btnY + btnH / 2 + 2);
  
    // Random Color Button
    fill(255, 100, 100, 100);
    stroke(255, 100, 100);
    strokeWeight(2);
    rect(width / 2 + 10, btnY, btnW, btnH, 12);
    noStroke();
    fill(255);
    text("Random Color", width / 2 + btnW / 2 + 10, btnY + btnH / 2 + 2);
  
    pop(); 
    camera.on();
}
  
   

function update() {
  // --- toggles ---
  if (kb.pressed('e')) {
    editor.enabled = !editor.enabled;

    // if entering editor while paused, unpause & hide DOM pause overlay
    if (editor.enabled && pauseKey) {
      pauseKey = false;
      if (typeof hidePauseOverlay === 'function') hidePauseOverlay();
    }
  }

  if (kb.pressed('P')|| presspause) {
    pauseKey = !pauseKey;
    if (pauseKey) { if (typeof showPauseOverlay === 'function') showPauseOverlay(); }
    else          { if (typeof hidePauseOverlay === 'function') hidePauseOverlay(); }
    presspause = false;
  }

  // restart level ONLY when not editing and not paused
  if (!editor.enabled && !pauseKey && kb.pressed('r')) {
    loadLevel(currentLevel);
  }

  // --- editor hotkeys: tool switching + rotate + delete + save ---
  // cycle tools: 1 = previous, 2 = next
  if (kb.pressed('1')) {
    editor.toolIndex = (editor.toolIndex - 1 + TOOL_LIST.length) % TOOL_LIST.length;
    editor.tool = TOOL_LIST[editor.toolIndex];
  }
  if (kb.pressed('2')) {
    editor.toolIndex = (editor.toolIndex + 1) % TOOL_LIST.length;
    editor.tool = TOOL_LIST[editor.toolIndex];
  }

  // rotate spike orientation (unchanged)
  if (kb.pressed('r')) {
    const dirs = ['up','right','down','left'];
    if (editor.tool === 'spike') {
      editor.spikeDir = dirs[(dirs.indexOf(editor.spikeDir)+1)%dirs.length];
    } else if (editor.tool === 'laser') {
      editor.laserDir = dirs[(dirs.indexOf(editor.laserDir)+1)%dirs.length];
    }
  }

  // Delete nearest of active tool
  if (editor.enabled && (kb.pressed('delete') || kb.pressed('backspace'))) {
    const p = worldMouseRaw();
    let key = null;

    if (editor.tool === 'ground')                key = 'ground';
    else if (editor.tool === 'platform')         key = 'platforms';
    else if (editor.tool === 'spring')           key = 'springs';
    else if (editor.tool === 'spike')            key = 'spikes';
    else if (editor.tool === 'checkpoint')       key = 'checkpoints';
    else if (editor.tool === 'goal') {
      levels[currentLevel].goalPosition = null;
      loadLevel(currentLevel);
      return; // early exit after removing goal
    }
    else if (editor.tool === 'enemy')            key = 'enemies';
    else if (editor.tool === 'teleporter')       key = 'teleporter';
    else if (editor.tool === 'laser')            key = 'lasers';
    else if (editor.tool === 'disappearingPlatform') key = 'disappearingPlatforms';
    else if (editor.tool === 'swingingHammer')   key = 'swingingHammers';

    if (!key) return;

    const dataArr = levels[currentLevel][key] || [];
    if (!dataArr.length) return;

    // Prefer sprite positions when available
    const spriteArr =
      key === 'ground'                 ? levelObjects.ground :
      key === 'platforms'              ? levelObjects.platforms :
      key === 'springs'                ? levelObjects.springs :
      key === 'spikes'                 ? levelObjects.spikes :
      key === 'checkpoints'            ? levelObjects.checkpoints :
      key === 'enemies'                ? levelObjects.enemies :
      key === 'teleporter'             ? levelObjects.teleporter :
      key === 'lasers'                 ? levelObjects.laserBlasters :
      key === 'asteriods'              ? levelObjects.asteriodFields :
      key === 'disappearingPlatforms'  ? levelObjects.disappearingPlatforms :
      key === 'swingingHammers'        ? levelObjects.swingingHammers :
      null;

    let idx = -1, best = 1e9;

    if (spriteArr && spriteArr.length) {
      // pick by sprite centers
      for (let i = 0; i < spriteArr.length; i++) {
        const s = spriteArr[i];
        const d = dist(p.x, p.y, s.x, s.y);
        if (d < best) { best = d; idx = i; }
      }
    } else {
      // fallback: pick by data center
      for (let i = 0; i < dataArr.length; i++) {
        const it = dataArr[i];
        const cx = it.x ?? it.startX ?? it.pivotX ?? 0;
        const cy = it.y ?? it.startY ?? it.pivotY ?? 0;
        const d = dist(p.x, p.y, cx, cy);
        if (d < best) { best = d; idx = i; }
      }
    }

    if (idx >= 0 && best < PICK_RADIUS) {
      dataArr.splice(idx, 1);
      loadLevel(currentLevel);
    }
  }

  // Save current level JSON
  if (kb.pressed('s')) {
    if (typeof saveJSON === 'function') saveJSON(levels[currentLevel], `level-${currentLevel}.json`);
    else {
      const txt = JSON.stringify(levels[currentLevel], null, 2);
      navigator.clipboard?.writeText(txt);
      alert('Level JSON copied to clipboard');
    }
  }

  // ===== EDITOR MODE (separate from Pause): freeze + repaint + banner, then return =====
  if (editor.enabled) {
    // freeze physics/state
    levelObjects.platforms?.forEach(p => { p.physics = STATIC; });
    
    if (ball) {
        ball.physics = NONE;
        ball.vel.x = 0; ball.vel.y = 0;
        ball.rotationSpeed = 0; ball.angularVelocity = 0;
    }

    // repaint world so edits show immediately
    drawBackgroundForLevel();
    if (typeof allSprites !== 'undefined') allSprites.draw();
    

    // editor UI
    drawEditorBanner();
    return;
  }

  // ===== PAUSED MODE =======
  if (pauseKey) {
    levelObjects.platforms?.forEach(p => { p.physics = STATIC; });

    if (ball) {
        ball.physics = NONE;
        ball.vel.x = 0; ball.vel.y = 0;
        ball.rotationSpeed = 0; ball.angularVelocity = 0;
    }

    drawBackgroundForLevel();
    if (typeof allSprites !== 'undefined') allSprites.draw();
    

    pauseMenu();            
    return;
  }

  // --- unpaused: normal game ---
  levelObjects.platforms?.forEach(platform => {
    platform.physics = KINEMATIC;
    if (!platform.speed) platform.speed = 2;
  });

  if (ball) {
    ball.physics = DYNAMIC;

    // Camera handeler
    camera.x += (ball.x - camera.x) * 0.1;
    camera.y += (ball.y - camera.y) * 0.1;
  }

	drawBackgroundForLevel();

    // Ball fall off map respawner
    if (ball && ball.y > 700) {
        respawn();
    }

    levelObjects.laserBlasters?.forEach(laser => {
        laser.update();
    });

    levelObjects.asteriodFields?.forEach(field => {
        field.update();
    });
    
   // Disappearing Platform handler
    levelObjects.disappearingPlatforms?.forEach(platform => {
        // Check if ball is touching platform
        if (ball && (ball.colliding(platform) && !platform.playerTouched && !platform.isDisappearing && !platform.isReappearing)) {
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
            if (ball && (ball.colliding(platform) && ball.vel.y >= 0)) {
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
        if (ball && ball.colliding(spring)) {
            ball.vel.y = -15;
            if (springSound && springSound.isLoaded()) {
              springSound.setVolume(globalVolume);
              springSound.play();
            } 
        }
    });

    // Jump reset Handler
    let onGround = false;
    levelObjects.ground?.forEach(ground => {
        if (ball && ball.colliding(ground)) onGround = true;
    });
    levelObjects.platforms?.forEach(platform => {
        if (ball && ball.colliding(platform)) onGround = true;
    });
    if (onGround) jumpCount = 0;

    // Controls
    if (kb.presses('space')) {
        if (ball && jumpCount < maxJumps) {
            // when grounded we can assume vel.y is 0
            // we can just increment the vel.y by the jump-strength
            ball.vel.y += -7;
            if (jumpSound && jumpSound.isLoaded()) {
              jumpSound.setVolume(globalVolume);
              jumpSound.play();
            }
              
            jumpCount++;
        }
    }

    if (ball && kb.pressing('left')) {
        if (ball.vel.x > 0) ball.applyForce(-30);
        else ball.applyForce(-15);
    }

    if (ball && kb.pressing('right')) {
        if (ball.vel.x < 0) ball.applyForce(30);
        else ball.applyForce(15);
    }

    // Spike collision handeler
    levelObjects.spikes?.forEach(spike => {
        if (ball && ball.colliding(spike)) {
            respawn();
        }
    });

    //Enemy Collision Handler
    levelObjects.enemies?.forEach(enemy => {
        if (ball && ball.colliding(enemy)) {
            respawn();
        }
    });
    
    //Swinging Hammer Handler
    levelObjects.swingingHammers?.forEach(hammer => {
        hammer.currentAngle += hammer.speed * hammer.direction;
        if (hammer.currentAngle > hammer.amplitude) {
            hammer.direction = -1;
        } else if (hammer.currentAngle < -hammer.amplitude) {
            hammer.direction = 1;
        }

        let angleRad = radians(hammer.currentAngle);

        hammer.sprite.x = hammer.pivotX + sin(angleRad) * hammer.length;
        hammer.sprite.y = hammer.pivotY + cos(angleRad) * hammer.length;
        hammer.sprite.rotation = hammer.currentAngle;

        let totalHeight = hammer.height * hammer.scale;
        let headOffset = hammer.length + (totalHeight / 2) - (hammer.spikeHeight / 2);
        hammer.spikeHitbox.x = hammer.pivotX + sin(angleRad) * headOffset;
        hammer.spikeHitbox.y = hammer.pivotY + cos(angleRad) * headOffset;
        hammer.spikeHitbox.width = hammer.width * hammer.scale;
        hammer.spikeHitbox.height = hammer.spikeHeight;
        hammer.spikeHitbox.rotation = hammer.currentAngle;
    });
    
    // Checkpoint update
    levelObjects.checkpoints?.forEach(checkpoint => {
        checkpoint.update();
    });

    blackholeAttraction(); //blackhole attraction

    teleportation (); //teleporter check

    updateParticles();

    // Respawn Timer handler
    if (ball && respawnTimer > 0) {
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
    
    drawSigns();
    
    drawUI();

    // editor banner while unpaused
    if (editor.enabled) drawEditorBanner();
}
   

// When called the function assigns ballColor to a random color
function randomColor() {
    levels[currentLevel].ballColor = random(['red', 'black', 'purple', 'pink', 'yellow', 'green', 'blue']);
    if (ball) ball.color = levels[currentLevel].ballColor;
}
