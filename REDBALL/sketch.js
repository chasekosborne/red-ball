new Q5();
new Canvas();

world.gravity.y = 10;

// collection of images
let unclaimedFlagImage;
let claimedFlagImage;

let ball;
let respawnPosition = [500, 150];
let jumpSound;
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
    }
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

        fill('orange');
        rect(p.x, p.y, 6, 6);

        if (p.life <= 0) particles.splice(i, 1);
    }
}

function preload() {
    jumpSound = loadSound('soundeffects/jump.mp3');
    springSound = loadSound('soundeffects/spring.mp3');

    unclaimedFlagImage = loadImage("art/unclaimed_checkpoint.png", img => {
        // force the image to be at a certain scale
        img.resize(100, 100);
    });

    claimedFlagImage = loadImage("art/claimed_checkpoint.png", img => {
        img.resize(100, 100);
    });
}

function setup() {
    platform = new Sprite(600, 250, 120, 20);
    platform.color = 'orange';
    platform.physics = KINEMATIC;
    platform.speed = 2;
    platform.direction = 1;

    ball = new Sprite();
    ball.drag = 0.4;
    ball.textSize = 40;
    ball.text = ":)";
    ball.x = respawnPosition[0];
    ball.y = respawnPosition[1];
    ball.diameter = 50;
    ball.color = 'red';

    spawnCheckpoints();

    let groundA = ground = new Sprite(500, 350, 800, 40);
    groundA.physics = STATIC;

    spring = new Sprite(1100, 350, 200, 40)
    spring.physics = STATIC;

    spikes = new Sprite([
        [780 + 0, 290 + 40],
        [780 + 20, 290 + 0],
        [780 + 40, 290 + 40],
        [780 + 0, 290 + 40]
    ]);

    spikes.color = 'red';
    spikes.physics = STATIC;
}

function pauseMenu() {
    fill(173, 216, 230, 50);   //setting rectangular box for menu
    rectMode(CENTER);  //starts drawing from the center 
    rect(850, 450, 1500, 700); //setting dimensions

    fill(0); 
    textAlign(CENTER, CENTER);
    textSize(25);
    text('Press ESC to resume',850, 350); //text appears slightly above center of rectangle
}


function update() {
    if (kb.pressed('escape')) {
        pauseKey = !pauseKey;   // changes false to true to ensure game is paused
}

// if paused == true, skips game logic and switches to pause menu
if (pauseKey==true) {
    pauseMenu();
    pausePosition = [ball.x, ball.y];
    //setting ball velocity, resetting ball position, and setting platform and ball physics to 0 to prevent further movement when game is paused, stopping update function
    platform.physics = STATIC;
    ball.physics = NONE;
    ball.vel.x = 0;
    ball.vel.y = 0;
    ball.x = pausePosition[0];
    ball.y = pausePosition[1];
    return;
}

if(pauseKey == false){ //if pause key is not pressed, resume game 
  platform.physics = KINEMATIC;  //resetting platform physics
  ball.physics = DYNAMIC; //resetting ball physics
  platform.speed = 2;
  if (platform.x > 1000) { //ensuring that platform moves to the left when reaching >1000 to avoid conflict with update code 
  platform.vel.x = '-2'; 
}  else if (platform.x < 200) { 
  platform.vel.x = '2';  
}

    camera.x += (ball.x - camera.x) * 0.1;
    camera.y += (ball.y - camera.y) * 0.1;

    background('skyblue');
    if (ball.y > 700) {
        respawn();
    }

    textAlign(CENTER);
    textSize(20);
    text('space to jump!', halfWidth, halfHeight - 100);
    if (ball.colliding(spring)) { ball.vel.y = -15; springSound.play() }

    // Resets jump count when on ground or platforms
    if (ball.colliding(ground) || ball.colliding(platform)) { jumpCount = 0; }

    if (kb.presses('space')) {
        if (jumpCount < maxJumps) {
            ball.vel.y = -7;
            jumpSound.play();
            jumpCount++;
        }
    }

    if (kb.pressing('left')) {
        if (ball.vel.x > 0) {
            ball.applyForce(-30);
        } else {
            ball.applyForce(-15);
        }
    }

    if (kb.pressing('right')) {
        if (ball.vel.x < 0) {
            ball.applyForce(30);
        } else {
            ball.applyForce(15);
        }
    }

    if (platform.x > 1000) {
        platform.vel.x = '-2';
        platform.vel.y = 0;
    } else if (platform.x < 200) {
        platform.vel.y = 0;
        platform.vel.x = '2';
    }
    if (ball.colliding(platform) && ball.vel.y >= 0) {
        ball.x += platform.vel.x
    }

    if (ball.colliding(spikes)) {
        respawn();
    }

    let worldMouseX = mouseX + camera.x - halfWidth;
    let worldMouseY = mouseY + camera.y - halfHeight;
    fill('black');
    textSize(16);
    textAlign(LEFT, TOP);
    text(`Mouse: ${worldMouseX}, ${worldMouseY}`, 10, 10);

    updateParticles();

    if (respawnTimer > 0) {
        respawnTimer--;
        if (respawnTimer === 0) {
            ball.vel.x = 0;
            ball.vel.y = 0;
            ball.visible = true;
            ball.collider = 'dynamic';
        }
    }
     updateCheckpoints();
}
   

}

// When called the function assigns ballColor to a random color
function randomColor() {
    ballColor = random(['red', 'black', 'purple', 'pink', 'yellow', 'green', 'blue'])
}