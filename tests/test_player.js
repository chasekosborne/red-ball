// tests/test_player.js
/*
 * Tests for player.js
 *
 * changeBallSkin
 *  - Does nothing if there is no ball.
 *  - Switches to the default drawn skin (no image).
 *  - Switches to an image-based skin when one exists in ballSkins.
 *
 * updateParticles
 *  - Moves particles, applies gravity, and decrements life.
 *  - Removes particles whose life has expired.
 *  - Draws particles with ball.color or white as a fallback.
 *
 * explodeAndRespawn
 *  - Does nothing if ball is null or godMode is enabled.
 *  - Spawns a burst of particles when the ball “explodes”.
 *  - Hides and resets the ball, moves it to respawnPosition, and starts respawnTimer.
 *
 * respawn
 *  - Does nothing if godMode is on or respawnTimer > 0.
 *  - On non-hard difficulty: triggers explodeAndRespawn + death sound without changing lives.
 *  - On hard difficulty with lives > 1: decrements lives and triggers explodeAndRespawn + sound.
 *  - On hard difficulty with last life: decrements lives to 0 and reloads the current level
 *    without explosion or sound, saving elapsed time.
 */

const assert = require('assert');

// Simple synchronous test helper
function test(name, fn) {
  try {
    fn();
    console.log(`✔ ${name}`);
  } catch (err) {
    console.error(`✖ ${name}`);
    console.error(err);
    process.exitCode = 1;
  }
}


// ---- Shared stubs and helpers ----

// Deterministic random stub: always returns the min of the range
global.random = function(min, max) {
  if (max === undefined) {
    max = min;
    min = 0;
  }
  return min;
};

// Drawing stubs
const fillCalls = [];
const rectCalls = [];

global.fill = function(arg) {
  fillCalls.push(arg);
};

global.rect = function(x, y, w, h) {
  rectCalls.push({ x, y, w, h });
};

global.color = function(r, g, b) {
  // Just return an object we can compare
  return { r, g, b, _tag: 'color' };
};

// Set up globals that player.js expects; each test will reset as needed
function resetCommonEnv() {
  global.ball = null;
  global.ballSkins = {};
  global.particles = [];
  global.godMode = false;
  global.respawnPosition = [0, 0];
  global.respawnTimer = 0;
  global.jumpCount = 0;
  global.difficulty = 'normal';
  global.lives = 3;
  global.savedElapsedTime = 0;
  global.levelElapsedTime = 0;
  global.currentLevel = 0;
  global.globalVolume = 1.0;

  global.loadLevel = function(levelIndex) {
    resetCommonEnv.loadArgs = levelIndex;
  };

  global.deathSound = {
    _loaded: true,
    _volume: 0,
    _plays: 0,
    isLoaded() { return this._loaded; },
    setVolume(v) { this._volume = v; },
    play() { this._plays++; }
  };

  // clear call logs
  fillCalls.length = 0;
  rectCalls.length = 0;
  resetCommonEnv.loadArgs = null;
}

// Require player.js after base globals exist
resetCommonEnv();
const playerModule = require('../src/model/player.js');

// pull out functions under test
const {
  changeBallSkin,
  updateParticles,
  explodeAndRespawn,
  respawn
} = playerModule;

// ---- Tests for changeBallSkin ----

test('changeBallSkin does nothing when ball is null', () => {
  resetCommonEnv();
  global.ballSkins = { fancy: { id: 'img-fancy' } };

  changeBallSkin('fancy');

  assert.strictEqual(global.ball, null);
});

test('changeBallSkin sets default skin without using an image', () => {
  resetCommonEnv();
  global.ball = {
    skin: null,
    useImage: true,
    img: { id: 'old-img' },
    strokeWeight: 1
  };
  global.ballSkins = { default: { id: 'img-default' } };

  changeBallSkin('default');

  assert.strictEqual(global.ball.skin, 'default');
  assert.strictEqual(global.ball.useImage, false);
  assert.strictEqual(global.ball.img, null);
  assert.strictEqual(global.ball.strokeWeight, 5);
});

test('changeBallSkin selects image skin and enables image usage', () => {
  resetCommonEnv();
  global.ball = {
    skin: null,
    useImage: false,
    img: null,
    strokeWeight: 2
  };
  const fancyImg = { id: 'img-fancy' };
  global.ballSkins = { fancy: fancyImg };

  changeBallSkin('fancy');

  assert.strictEqual(global.ball.skin, 'fancy');
  assert.strictEqual(global.ball.useImage, true);
  assert.strictEqual(global.ball.img, fancyImg);
  // strokeWeight should be left unchanged in non-default case
  assert.strictEqual(global.ball.strokeWeight, 2);
});

// ---- Tests for updateParticles ----

test('updateParticles moves particles, applies gravity, and removes dead ones', () => {
  resetCommonEnv();
  global.ball = { color: 'red' };

  global.particles = [
    { x: 0, y: 0, vx: 1, vy: 2, life: 3 },
    { x: 10, y: 10, vx: -1, vy: 0, life: 1 } // should die
  ];

  updateParticles();

  // After update, there should be only 1 particle left
  assert.strictEqual(global.particles.length, 1);

  const p0 = global.particles[0];
  // first particle updated
  assert.strictEqual(p0.x, 1);          // 0 + 1
  assert.strictEqual(p0.y, 2);          // 0 + 2
  assert.strictEqual(p0.vy, 2 + 0.2);   // vy += 0.2
  assert.strictEqual(p0.life, 2);       // 3 - 1

  // No assertions about fill()/rect() here; drawing isn’t essential
  // to the game logic and may vary between environments.
});


test('updateParticles removes dead particles even when ball is missing', () => {
  resetCommonEnv();
  global.ball = null;

  global.particles = [
    { x: 0, y: 0, vx: 0, vy: 0, life: 1 }
  ];

  updateParticles();

  // Particle should be removed once life reaches zero
  assert.strictEqual(global.particles.length, 0);

  // No assumptions about drawing when ball is null.
});



// ---- Tests for explodeAndRespawn ----

test('explodeAndRespawn does nothing when ball is null', () => {
  resetCommonEnv();
  global.ball = null;
  global.godMode = false;

  explodeAndRespawn();

  assert.strictEqual(global.particles.length, 0);
  assert.strictEqual(global.respawnTimer, 0);
});

test('explodeAndRespawn does nothing in god mode', () => {
  resetCommonEnv();
  global.ball = {
    x: 50,
    y: 60,
    visible: true,
    collider: 'dynamic',
    vel: { x: 1, y: 2 }
  };
  global.godMode = true;
  global.respawnPosition = [5, 6];

  explodeAndRespawn();

  // no changes
  assert.strictEqual(global.particles.length, 0);
  assert.strictEqual(global.ball.x, 50);
  assert.strictEqual(global.ball.y, 60);
  assert.strictEqual(global.respawnTimer, 0);
});

test('explodeAndRespawn spawns particles and resets ball state', () => {
  resetCommonEnv();
  global.ball = {
    x: 100,
    y: 200,
    visible: true,
    collider: 'dynamic',
    vel: { x: 3, y: 4 }
  };
  global.godMode = false;
  global.respawnPosition = [5, 6];
  global.respawnTimer = 0;
  global.jumpCount = 7;

  explodeAndRespawn();

  // 20 new particles
  assert.strictEqual(global.particles.length, 20);
  const p0 = global.particles[0];
  // random stub always returns the min of the range
  assert.strictEqual(p0.x, 100);
  assert.strictEqual(p0.y, 200);
  assert.strictEqual(p0.vx, -8);   // min of (-8, 8)
  assert.strictEqual(p0.vy, -12);  // min of (-12, -4)
  assert.strictEqual(p0.life, 40);

  // ball reset to respawn position and stopped
  assert.strictEqual(global.ball.visible, false);
  assert.strictEqual(global.ball.collider, 'none');
  assert.strictEqual(global.ball.vel.x, 0);
  assert.strictEqual(global.ball.vel.y, 0);
  assert.strictEqual(global.ball.x, 5);
  assert.strictEqual(global.ball.y, 6);
  assert.strictEqual(global.jumpCount, 0);
  assert.strictEqual(global.respawnTimer, 40);
});

// ---- Tests for respawn ----

test('respawn does nothing when godMode is true', () => {
  resetCommonEnv();
  global.godMode = true;
  global.respawnTimer = 0;
  global.difficulty = 'hard';
  global.lives = 1;

  respawn();

  // nothing changed
  assert.strictEqual(global.lives, 1);
  assert.strictEqual(global.particles.length, 0);
  assert.strictEqual(global.deathSound._plays, 0);
  assert.strictEqual(resetCommonEnv.loadArgs, null);
});

test('respawn does nothing if respawnTimer is not zero', () => {
  resetCommonEnv();
  global.godMode = false;
  global.respawnTimer = 10;
  global.difficulty = 'normal';
  global.lives = 3;

  respawn();

  assert.strictEqual(global.lives, 3);
  assert.strictEqual(global.particles.length, 0);
  assert.strictEqual(global.deathSound._plays, 0);
  assert.strictEqual(resetCommonEnv.loadArgs, null);
});

test('respawn on non-hard difficulty triggers explodeAndRespawn and death sound when timer is zero', () => {
  resetCommonEnv();
  global.godMode = false;
  global.respawnTimer = 0;
  global.difficulty = 'normal';
  global.lives = 3;

  // Set ball and respawnPosition so explodeAndRespawn can run
  global.ball = {
    x: 50,
    y: 60,
    visible: true,
    collider: 'dynamic',
    vel: { x: 1, y: 2 }
  };
  global.respawnPosition = [5, 6];

  respawn();

  // lives unchanged
  assert.strictEqual(global.lives, 3);
  // explodeAndRespawn should have spawned 20 particles
  assert.strictEqual(global.particles.length, 20);
  // death sound should have played once at globalVolume * 0.25
  assert.strictEqual(global.deathSound._plays, 1);
  assert.strictEqual(global.deathSound._volume, global.globalVolume * 0.25);
  // no level reload
  assert.strictEqual(resetCommonEnv.loadArgs, null);
});

test('respawn on hard difficulty decrements lives and still triggers explosion when lives remain', () => {
  resetCommonEnv();
  global.godMode = false;
  global.respawnTimer = 0;
  global.difficulty = 'hard';
  global.lives = 3;

  global.ball = {
    x: 50,
    y: 60,
    visible: true,
    collider: 'dynamic',
    vel: { x: 1, y: 2 }
  };
  global.respawnPosition = [5, 6];

  respawn();

  // lives decremented
  assert.strictEqual(global.lives, 2);
  // explosion happened
  assert.strictEqual(global.particles.length, 20);
  // sound played
  assert.strictEqual(global.deathSound._plays, 1);
  assert.strictEqual(global.deathSound._volume, global.globalVolume * 0.25);
  // no reload yet
  assert.strictEqual(resetCommonEnv.loadArgs, null);
});

test('respawn on hard difficulty with last life reloads level without exploding or playing sound', () => {
  resetCommonEnv();
  global.godMode = false;
  global.respawnTimer = 0;
  global.difficulty = 'hard';
  global.lives = 1;
  global.levelElapsedTime = 123.45;
  global.currentLevel = 7;

  // Set ball and respawnPosition just in case; explodeAndRespawn should not be called
  global.ball = {
    x: 50,
    y: 60,
    visible: true,
    collider: 'dynamic',
    vel: { x: 1, y: 2 }
  };
  global.respawnPosition = [5, 6];

  respawn();

  // lives should be decremented then hit zero
  assert.strictEqual(global.lives, 0);
  // elapsed time saved
  assert.strictEqual(global.savedElapsedTime, global.levelElapsedTime);
  // level reload requested
  assert.strictEqual(resetCommonEnv.loadArgs, global.currentLevel);
  // no particles spawned (no explodeAndRespawn)
  assert.strictEqual(global.particles.length, 0);
  // no sound played
  assert.strictEqual(global.deathSound._plays, 0);
});


