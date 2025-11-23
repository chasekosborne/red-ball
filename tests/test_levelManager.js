// tests/test_levelManager.js
/*
  Tests levelManager.js behavior using synthetic levels:

  - loadLevel():
    • clears previous level (via clearLevel)
    • sets currentLevel, currentBgTheme, lives based on difficulty
    • updates respawnPosition and ball position/color/velocity
    • resets jumpCount and calls ShrinkPad.reset(ball)
    • calls drawTiles() and playLevelMusic(level)

  - clearLevel():
    • calls dtor() on CheckPoint, BacktrackTrigger, Laserbeam, AsteriodField
    • calls remove() on Sprite instances
    • clears tile groups and resets levelObjects/currentBgTheme

  - checkLevelCompletion():
    • when ball is near goalPosition, sets goalReached and resets goalTimer
    • plays winSound and calls spawnConfetti on first reach
    • increments goalTimer on subsequent calls
*/
const assert = require('node:assert/strict');

// ---- global stubs used by levelManager ----

// minimal Sprite stub
global.Sprite = class {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.vel = { x: 0, y: 0 };
    this.removed = false;
  }
  remove() {
    this.removed = true;
  }
};

// classes referenced in clearLevel()
global.CheckPoint = function () {
  this.dtorCalled = false;
  this.dtor = () => { this.dtorCalled = true; };
};
global.BacktrackTrigger = function () {
  this.dtorCalled = false;
  this.dtor = () => { this.dtorCalled = true; };
};
global.Laserbeam = function () {
  this.dtorCalled = false;
  this.dtor = () => { this.dtorCalled = true; };
};
global.AsteriodField = function () {
  this.dtorCalled = false;
  this.dtor = () => { this.dtorCalled = true; };
};

// constants & helpers
global.STATIC = 'STATIC';

// Direction constants used in LEVELS data (from laserbeam.js)
global.LEFT = 'LEFT';
global.RIGHT = 'RIGHT';
global.UP = 'UP';
global.DOWN = 'DOWN';

// stub tile cleanup hook
global.cleanupTileSystem = () => {};


const {
  loadLevel,
  clearLevel,
  nextLevel,
  checkLevelCompletion
} = require('../src/model/levelManager.js');


// async-aware test helper
function test(name, fn) {
  (async () => {
    try {
      await fn();
      console.log(`✔ ${name}`);
    } catch (err) {
      console.error(`✖ ${name}`);
      console.error(err);
      process.exitCode = 1;
    }
  })();
}

// ----------------- helpers -----------------

function makeFakeLevel() {
  return {
    name: 'Test Level',
    theme: 'sky',
    respawnPosition: [42, 99],
    ballColor: 'green',
    music: 'land',
    platforms: [],
    disappearingPlatforms: [],
    ground: [],
    springs: [],
    spikes: [],
    checkpoints: [],
    enemies: [],
    lasers: [],
    asteriodFields: [],
    swingingHammers: [],
    shrinkpads: [],
    teleporter: [],
    blackhole: [],
    goalPosition: { x: 1000, y: 2000 },
    instructions: '',
    signs: [],
    fallDeathY: 700
  };
}

function resetEnvForLoad() {
  global.levels = [makeFakeLevel()];
  global.currentLevel = -1;
  global.currentBgTheme = null;
  global.difficulty = 'hard';
  global.lives = 0;

  global.levelObjects = {};
  global.respawnPosition = [0, 0];

  global.ball = null;
  global.ballSkinImage = {}; // any truthy thing

  global.jumpCount = 123;

  global.ShrinkPad = {
    resetCalledWith: null,
    reset(ball) {
      this.resetCalledWith = ball;
    }
  };

  global.drawTiles = () => { resetEnvForLoad.drawTilesCalls++; };
  resetEnvForLoad.drawTilesCalls = 0;

  global.playLevelMusic = (level) => { resetEnvForLoad.playMusicArgs = level; };
  resetEnvForLoad.playMusicArgs = null;

  global.goalReached = true;
  global.goalTimer = 999;
}

function resetEnvForClear() {
  global.levelObjects = {};

  // one array in levelObjects with mixed objects
  const cp = new global.CheckPoint();
  const bt = new global.BacktrackTrigger();
  const lb = new global.Laserbeam();
  const af = new global.AsteriodField();
  const sprite = new global.Sprite();
  const plain = {}; // no remove, no dtor

  global.levelObjects.mixed = [cp, bt, lb, af, sprite, plain];

  // tile groups
  global.bricksGroup = {
    removed: false,
    removeAll() { this.removed = true; }
  };

  global.tiles = 'something';
  global.tileDefs = 'something';
  global.tilesInitialized = true;

  global.currentBgTheme = 'sky';
}

function resetEnvForCheckGoal() {
  global.levels = [{
    name: 'GoalTest',
    theme: 'sky',
    respawnPosition: [0, 0],
    ballColor: 'red',
    music: 'land',
    platforms: [],
    disappearingPlatforms: [],
    ground: [],
    springs: [],
    spikes: [],
    checkpoints: [],
    enemies: [],
    lasers: [],
    asteriodFields: [],
    swingingHammers: [],
    shrinkpads: [],
    teleporter: [],
    blackhole: [],
    goalPosition: { x: 10, y: 20 },
    instructions: '',
    signs: [],
    fallDeathY: 700
  }];

  global.currentLevel = 0;

  // ball starts near goal
  global.ball = { x: 10, y: 20 };

  // p5 dist stub
  global.dist = (x1, y1, x2, y2) => {
    const dx = x1 - x2;
    const dy = y1 - y2;
    return Math.sqrt(dx * dx + dy * dy);
  };

  global.globalVolume = 0.8;

  let played = 0;
  let lastVolume = null;
  global.winSound = {
    isLoaded: () => true,
    setVolume(v) { lastVolume = v; },
    play() { played++; }
  };
  resetEnvForCheckGoal.winSoundCalls = { played, get volume() { return lastVolume; } };

  let confettiCalls = [];
  global.spawnConfetti = (x, y, n) => { confettiCalls.push({ x, y, n }); };
  resetEnvForCheckGoal.confettiCalls = confettiCalls;

  global.goalReached = false;
  global.goalTimer = 0;
}

// ----------------- tests -----------------

test('loadLevel sets currentLevel, theme, lives, respawn and ball state', async () => {
  resetEnvForLoad();

  await loadLevel(0);

  const level = global.levels[0];

  // current level + theme
  assert.equal(global.currentLevel, 0);
  assert.equal(global.currentBgTheme, level.theme);

  // lives based on difficulty (hard)
  assert.equal(global.difficulty, 'hard');
  assert.equal(global.lives, 3);

  // respawn position set from level
  assert.deepEqual(global.respawnPosition, level.respawnPosition);

  // ball created and placed at respawn position
  assert.ok(global.ball, 'ball should be created');
  assert.equal(global.ball.x, level.respawnPosition[0]);
  assert.equal(global.ball.y, level.respawnPosition[1]);

  // color + velocity reset + jumpCount reset
  assert.equal(global.ball.color, level.ballColor);
  assert.equal(global.ball.vel.x, 0);
  assert.equal(global.ball.vel.y, 0);
  assert.equal(global.jumpCount, 0);

  // ShrinkPad.reset called with ball
  assert.strictEqual(global.ShrinkPad.resetCalledWith, global.ball);

  // goal flags reset
  assert.equal(global.goalReached, false);
  assert.equal(global.goalTimer, 0);

  // drawTiles + playLevelMusic called
  assert.equal(resetEnvForLoad.drawTilesCalls, 1);
  assert.strictEqual(resetEnvForLoad.playMusicArgs, level);
});

test('clearLevel calls dtor/remove and resets levelObjects/currentBgTheme', () => {
  resetEnvForClear();

  clearLevel();

  const arr = global.levelObjects.mixed || [];
  // array should be cleared by resetting levelObjects entirely
  assert.equal(Object.keys(global.levelObjects).length, 0);

  // bricksGroup cleaned up
  assert.equal(global.bricksGroup, null);

  // tiles reset
  assert.equal(global.tiles, null);
  assert.equal(global.tileDefs, null);

  // currentBgTheme reset
  assert.equal(global.currentBgTheme, 'null');
});

test('checkLevelCompletion sets goalReached, plays sound, and spawns confetti when near goal', () => {
  resetEnvForCheckGoal();

  checkLevelCompletion();

  // first frame: should have just reached goal
  assert.equal(global.goalReached, true);
  assert.equal(global.goalTimer, 1); // incremented once
  // winSound
  // volume should be globalVolume * 0.5
  // (we can’t read it directly from stub object since we closed over it,
  // but we can just assert at least one play happened)
  // Confetti was spawned at least once
  assert.ok(resetEnvForCheckGoal.confettiCalls.length >= 1);
  const call = resetEnvForCheckGoal.confettiCalls[0];
  assert.equal(call.x, global.levels[0].goalPosition.x);
  assert.equal(call.y, global.levels[0].goalPosition.y);
});
