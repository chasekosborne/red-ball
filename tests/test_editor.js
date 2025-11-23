// tests/test_editor.js
/*
  Tests of the core functionality of editor.js include:

  - Mouse → world coordinate conversion (worldMouseRaw, worldMouse)
    • camera offsets
    • grid snapping
    • negative positions

  - Editor UI safety (drawEditorBanner)
    • ensures camera.off/on are called
    • verifies no p5 constants crash in Node

  - EditorMode behavior
    • freezes ball physics while editing
    • tool cycling with keys 1 (back) and 2 (forward)
    • spike/laser rotation with key R

  - Object editing actions
    • deleting nearest ground piece within PICK_RADIUS
    • deleting goal position
    • restarting level when not editing (R key)

  - Rectangle placement tools
    • mousePressed + mouseReleased to create ground rectangles
    • verifies correct center/size and level reload

  This file ensures that all non-visual, interactive editor logic works
  correctly under Node by stubbing p5 globals and testing real functions.
*/

const assert = require('node:assert/strict');

const {
    editor,
    TOOL_LIST,
    PICK_RADIUS,
    drawEditorBanner,
    worldMouseRaw,
    worldMouse,
    mousePressed,
    mouseReleased,
    EditorMode
} = require('../src/controller/editor.js');

// tiny local test helper (same style as your other tests)
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

// ---- shared helpers ----

// reset just the editor state (no globals)
function resetEditorState() {
    editor.enabled = true;
    editor.tool = 'ground';
    editor.grid = 20;
    editor.dragStart = null;
    editor.spikeDir = 'up';
    editor.laserDir = editor.laserDir || 'down';
    editor.toolIndex = TOOL_LIST.indexOf(editor.tool);
    editor.staging = null;
}

// basic game globals used across editor.js
function setupGameEnv() {
    const level = {
        ground: [],
        platforms: [],
        springs: [],
        spikes: [],
        checkpoints: [],
        enemies: [],
        teleporter: [],
        lasers: [],
        disappearingPlatforms: [],
        swingingHammers: [],
        goalPosition: null
    };

    global.levels = [level];
    global.currentLevel = 0;

    const loadCalls = [];
    global.loadLevel = function (idx) {
        loadCalls.push(idx);
    };

    global.levelObjects = {
        ground: [],
        platforms: [],
        springs: [],
        spikes: [],
        checkpoints: [],
        enemies: [],
        teleporter: [],
        laserBlasters: [],
        asteriodFields: [],
        disappearingPlatforms: [],
        swingingHammers: []
    };

    global.STATIC = 'STATIC';
    global.NONE = 'NONE';

    global.ball = {
        physics: 'DYNAMIC',
        vel: { x: 1, y: 2 },
        rotationSpeed: 5,
        angularVelocity: 3
    };

    global.drawBackgroundForLevel = function () { };
    global.allSprites = { draw: function () { } };

    global.gameHandler = {
        isPaused: function () { return false; }
    };

    global.navigator = { clipboard: { writeText: function () { } } };
    global.alert = function () { };

    global.dist = function (x1, y1, x2, y2) {
        const dx = x1 - x2;
        const dy = y1 - y2;
        return Math.sqrt(dx * dx + dy * dy);
    };

    // keyboard stub; tests can tweak _pressed
    global.kb = {
        _pressed: new Set(),
        pressed: function (key) {
            return this._pressed.has(key);
        }
    };

    // camera & draw context will be set by setupDrawingEnv if needed

    // some defaults for mouse/world math
    global.mouseX = 0;
    global.mouseY = 0;
    global.halfWidth = 0;
    global.halfHeight = 0;

    return { level, loadCalls };
}

// set up drawing-related globals (used by drawEditorBanner & EditorMode)
function setupDrawingEnv(counter) {
    counter = counter || { off: 0, on: 0 };

    global.width = 800;
    global.height = 600;

    global.CORNER = 'CORNER';
    global.LEFT = 'LEFT';
    global.CENTER = 'CENTER';

    global.camera = {
        x: 0,
        y: 0,
        off: function () { counter.off++; },
        on: function () { counter.on++; }
    };

    global.push = function () { };
    global.pop = function () { };
    global.rectMode = function () { };
    global.noStroke = function () { };
    global.fill = function () { };
    global.rect = function () { };
    global.textAlign = function () { };
    global.textSize = function () { };
    global.text = function () { };

    global.drawingContext = {
        getTransform: function () {
            return { a: 1, b: 0, c: 0, d: 1 };
        },
        save: function () { },
        setTransform: function () { },
        restore: function () { }
    };

    return counter;
}

// ---- worldMouse tests (existing + one extra) ----

test('worldMouseRaw converts screen coords to world coords with camera offset', () => {
    resetEditorState();
    setupGameEnv();
    setupDrawingEnv();

    camera.x = 100;
    camera.y = 50;
    halfWidth = 200;
    halfHeight = 150;
    mouseX = 210;
    mouseY = 160;

    const p = worldMouseRaw();

    // Expected:
    // x = mouseX + camera.x - halfWidth  = 210 + 100 - 200 = 110
    // y = mouseY + camera.y - halfHeight = 160 + 50  - 150 = 60
    assert.deepStrictEqual(p, { x: 110, y: 60 });
});

test('worldMouse snaps world coords to grid', () => {
    resetEditorState();
    setupGameEnv();
    setupDrawingEnv();

    camera.x = 100;
    camera.y = 50;
    halfWidth = 200;
    halfHeight = 150;
    mouseX = 215;
    mouseY = 165;

    editor.grid = 20;

    const p = worldMouse();

    // Raw:
    // wx = 215 + 100 - 200 = 115
    // wy = 165 +  50 - 150 = 65
    //
    // snap:
    // x = round(115/20)*20 = 120
    // y = round(65/20)*20  = 60
    assert.deepStrictEqual(p, { x: 120, y: 60 });
});

test('worldMouse respects different grid sizes', () => {
    resetEditorState();
    setupGameEnv();
    setupDrawingEnv();

    camera.x = 0;
    camera.y = 0;
    halfWidth = 0;
    halfHeight = 0;
    mouseX = 37;
    mouseY = 73;

    editor.grid = 10;

    const p = worldMouse();

    // x = round(37/10)*10 = 40
    // y = round(73/10)*10 = 70
    assert.deepStrictEqual(p, { x: 40, y: 70 });
});

test('worldMouse handles negative camera offsets correctly', () => {
    resetEditorState();
    setupGameEnv();
    setupDrawingEnv();

    camera.x = -50;
    camera.y = -30;
    halfWidth = 0;
    halfHeight = 0;
    mouseX = 10;
    mouseY = 20;

    editor.grid = 5;

    const p = worldMouse();

    // wx = -40, wy = -10
    // x = round(-40/5)*5 = -40
    // y = round(-10/5)*5 = -10
    assert.deepStrictEqual(p, { x: -40, y: -10 });
});

// ---- drawEditorBanner tests ----

test('drawEditorBanner calls camera.off and camera.on without throwing', () => {
    resetEditorState();
    setupGameEnv();
    const counter = setupDrawingEnv({ off: 0, on: 0 });

    assert.doesNotThrow(() => {
        drawEditorBanner();
    });

    assert.equal(counter.off, 1);
    assert.equal(counter.on, 1);
});

// ---- EditorMode tests ----

test('EditorMode freezes the ball (physics NONE and zero velocity)', () => {
    resetEditorState();
    setupGameEnv();
    setupDrawingEnv();

    kb._pressed = new Set(); // no keys pressed

    EditorMode();

    assert.equal(ball.physics, 'NONE');
    assert.equal(ball.vel.x, 0);
    assert.equal(ball.vel.y, 0);
    assert.equal(ball.rotationSpeed, 0);
    assert.equal(ball.angularVelocity, 0);
});

test('EditorMode cycles tools backwards with key 1 (wraps around)', () => {
    resetEditorState();
    setupGameEnv();
    setupDrawingEnv();

    // start at first tool
    editor.tool = TOOL_LIST[0];
    editor.toolIndex = 0;
    kb._pressed = new Set(['1']);

    EditorMode();

    // should wrap to last tool
    const expected = TOOL_LIST[TOOL_LIST.length - 1];
    assert.equal(editor.tool, expected);
    assert.equal(editor.toolIndex, TOOL_LIST.length - 1);
});

test('EditorMode cycles tools forward with key 2', () => {
    resetEditorState();
    setupGameEnv();
    setupDrawingEnv();

    editor.tool = TOOL_LIST[0];
    editor.toolIndex = 0;
    kb._pressed = new Set(['2']);

    EditorMode();

    // move to second tool
    assert.equal(editor.tool, TOOL_LIST[1]);
    assert.equal(editor.toolIndex, 1);
});

test('EditorMode rotates spikeDir with R', () => {
    resetEditorState();
    setupGameEnv();
    setupDrawingEnv();

    editor.tool = 'spike';
    editor.spikeDir = 'up';
    kb._pressed = new Set(['r']);

    EditorMode();

    // dirs = ['up', 'right', 'down', 'left']
    assert.equal(editor.spikeDir, 'right');
});

test('EditorMode rotates laserDir with R', () => {
    resetEditorState();
    setupGameEnv();
    setupDrawingEnv();

    editor.tool = 'laser';
    editor.laserDir = 'up';
    kb._pressed = new Set(['r']);

    EditorMode();

    assert.equal(editor.laserDir, 'right');
});

test('EditorMode deletes nearest ground within PICK_RADIUS', () => {
    resetEditorState();
    const { level, loadCalls } = setupGameEnv();
    setupDrawingEnv();

    editor.tool = 'ground';
    editor.toolIndex = TOOL_LIST.indexOf('ground');
    editor.enabled = true;

    // two ground pieces + matching sprites
    level.ground.push(
        { x: 0, y: 0, w: 10, h: 10 },
        { x: 100, y: 0, w: 10, h: 10 }
    );
    levelObjects.ground.push(
        { x: 0, y: 0 },
        { x: 100, y: 0 }
    );

    // mouse near the first piece
    camera.x = 0;
    camera.y = 0;
    halfWidth = 0;
    halfHeight = 0;
    mouseX = 5;
    mouseY = 0;

    kb._pressed = new Set(['delete']);

    EditorMode();

    // should remove the first element only
    assert.equal(level.ground.length, 1);
    assert.equal(level.ground[0].x, 100);
    assert.equal(loadCalls.length, 1);
    assert.equal(loadCalls[0], 0);
});

test('EditorMode deletes goal and reloads when tool is goal', () => {
    resetEditorState();
    const { level, loadCalls } = setupGameEnv();
    setupDrawingEnv();

    editor.tool = 'goal';
    editor.toolIndex = TOOL_LIST.indexOf('goal');
    editor.enabled = true;

    level.goalPosition = { x: 50, y: 50 };

    // worldMouseRaw is still called, so give it something sensible
    camera.x = 0;
    camera.y = 0;
    halfWidth = 0;
    halfHeight = 0;
    mouseX = 0;
    mouseY = 0;

    kb._pressed = new Set(['delete']);

    EditorMode();

    assert.equal(level.goalPosition, null);
    assert.equal(loadCalls.length, 1);
    assert.equal(loadCalls[0], 0);
});

test('EditorMode restarts level when not editing, not paused, and R is pressed', () => {
    resetEditorState();
    const { loadCalls } = setupGameEnv();
    setupDrawingEnv();

    // treat this call as a "normal gameplay" frame: editor off
    editor.enabled = false;

    gameHandler.isPaused = function () { return false; };
    kb._pressed = new Set(['r']);

    EditorMode();

    assert.equal(loadCalls.length, 1);
    assert.equal(loadCalls[0], 0);
});

// ---- mousePressed / mouseReleased rectangle tool test ----

test('mousePressed + mouseReleased creates ground rectangle and reloads', () => {
    resetEditorState();
    const { level, loadCalls } = setupGameEnv();
    setupDrawingEnv();

    editor.enabled = true;
    editor.tool = 'ground';
    editor.toolIndex = TOOL_LIST.indexOf('ground');
    editor.grid = 1; // avoid snapping issues

    camera.x = 0;
    camera.y = 0;
    halfWidth = 0;
    halfHeight = 0;

    // first corner
    mouseX = 10;
    mouseY = 20;
    mousePressed();

    assert.deepEqual(editor.dragStart, { x: 10, y: 20 });

    // second corner
    mouseX = 30;
    mouseY = 40;
    mouseReleased();

    // new ground piece at center (20,30) with size 20x20
    assert.equal(level.ground.length, 1);
    const g = level.ground[0];
    assert.equal(g.x, 20);
    assert.equal(g.y, 30);
    assert.equal(g.w, 20);
    assert.equal(g.h, 20);

    // drag should be cleared and level reloaded
    assert.equal(editor.dragStart, null);
    assert.equal(loadCalls.length, 1);
    assert.equal(loadCalls[0], 0);
});

