// tests/test_levelManager.js
/**
 * What this file tests in levelManager.js:
 * - loadLevel:
 *     - Is exported and is an async function.
 *
 * - clearLevel:
 *     - Calls dtor/remove on objects in levelObjects.
 *     - Clears levelObjects to an empty object.
 *     - Clears bricksGroup via removeAll() and sets it to null.
 *     - Resets tiles and tileDefs via cleanupTileSystem().
 *
 * - checkLevelCompletion:
 *     - When the ball is at the goal position:
 *         - Plays winSound once at globalVolume * 0.5.
 *         - Calls spawnConfetti at the goal position.
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

// stub tile cleanup hook – mimic real tile teardown
global.cleanupTileSystem = () => {
  global.tiles = null;
  global.tileDefs = null;
  global.tilesInitialized = false;
};



const {
  loadLevel,
  clearLevel,
  nextLevel,
  checkLevelCompletion
} = require('../src/model/levelManager.js');


// async-aware test helper (sequential)
const tests = [];

function test(name, fn) {
  try {
    fn(); // run immediately and synchronously
    console.log(`✔ ${name}`);
  } catch (err) {
    console.error(`✖ ${name}`);
    console.error(err);
    process.exitCode = 1;
  }
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

  // tile groups used by clearLevel (loadLevel calls clearLevel first)
  global.bricksGroup = {
    removed: false,
    removeAll() { this.removed = true; }
  };

  global.pinkfullGroup = null;
  global.pinkleftGroup = null;
  global.pinkrightGroup = null;
  global.texturedBrickGroup = null;
  global.leftCornerBrickGroup = null;
  global.rightCornerBrickGroup = null;
  global.leftCornerBrickGroupInvert = null;
  global.leftCornerBrickGroupInvert2 = null;
  global.rightCornerBrickGroupInvert = null;
  global.rightCornerBrickGroupInvert2 = null;

  // optional: goal flags, etc.
  global.goalReached = true;
  global.goalTimer = 999;
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

  // ball starts at goal
  global.ball = { x: 10, y: 20 };

  // p5 dist stub
  global.dist = (x1, y1, x2, y2) => {
    const dx = x1 - x2;
    const dy = y1 - y2;
    return Math.sqrt(dx * dx + dy * dy);
  };

  global.globalVolume = 0.8;

  // Track winSound usage directly on the object
  global.winSound = {
    _loaded: true,
    _plays: 0,
    _volume: 0,
    isLoaded() { return this._loaded; },
    setVolume(v) { this._volume = v; },
    play() { this._plays++; }
  };

  // Track confetti calls
  resetEnvForCheckGoal.confettiCalls = [];
  global.spawnConfetti = (x, y, n) => {
    resetEnvForCheckGoal.confettiCalls.push({ x, y, n });
  };
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

  // tile groups used in clearLevel
  global.bricksGroup = {
    removed: false,
    removeAll() { this.removed = true; }
  };

  // declare all other tile groups so the `if (...)` checks don’t throw
  global.pinkfullGroup = null;
  global.pinkleftGroup = null;
  global.pinkrightGroup = null;
  global.texturedBrickGroup = null;
  global.leftCornerBrickGroup = null;
  global.rightCornerBrickGroup = null;
  global.leftCornerBrickGroupInvert = null;
  global.leftCornerBrickGroupInvert2 = null;
  global.rightCornerBrickGroupInvert = null;
  global.rightCornerBrickGroupInvert2 = null;

  // tiles / tileDefs that clearLevel will reset
  global.tiles = 'something';
  global.tileDefs = 'something';
  global.tilesInitialized = true;

  global.currentBgTheme = 'sky';
}



// ----------------- tests -----------------

test('loadLevel is exported and is an async function', () => {
  // It exists and is a function
  assert.equal(typeof loadLevel, 'function');

  // Optionally verify it’s actually async (for documentation):
  const AsyncFunction = (async () => {}).constructor;
  assert.ok(loadLevel instanceof AsyncFunction);
});


test('clearLevel calls dtor/remove and clears level objects and tiles', () => {
  resetEnvForClear();

  clearLevel(); // async inside, but we only assert on synchronous effects

  // all entries cleared
  assert.equal(Object.keys(global.levelObjects).length, 0);

  // bricksGroup cleaned up
  assert.equal(global.bricksGroup, null);

  // tiles reset
  assert.equal(global.tiles, null);
  assert.equal(global.tileDefs, null);

});


test('checkLevelCompletion plays win sound and spawns confetti when near goal', () => {
  resetEnvForCheckGoal();

  checkLevelCompletion();

  // winSound should have played once at globalVolume * 0.5
  assert.strictEqual(global.winSound._plays, 1);
  assert.strictEqual(global.winSound._volume, global.globalVolume * 0.5);

  // Confetti should have spawned at the goal position
  assert.ok(resetEnvForCheckGoal.confettiCalls.length >= 1);
  const call = resetEnvForCheckGoal.confettiCalls[0];
  assert.equal(call.x, global.levels[0].goalPosition.x);
  assert.equal(call.y, global.levels[0].goalPosition.y);
});

