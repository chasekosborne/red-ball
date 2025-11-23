// tests/test_menu.js
/*
  Tests menu.js UI helpers:

  - buildPauseOverlay():
    • creates #pauseOverlay and #levelSelectPanel elements
    • wires up DOM structure without throwing

  - showPauseOverlay() / hidePauseOverlay():
    • toggle pause overlay display between 'flex' and 'none'

  - pauseMenu():
    • calls camera.off() and camera.on() exactly once
    • runs without throwing with p5 draw stubs

  - Level select panel:
    • showLevelSelectPanel() hides pause overlay and shows level select
    • clicking a level button calls loadLevel(i), resumeGame(), and resumeMusic()

  - Pause overlay buttons:
    • clicking Resume calls gameHandler.resumeGame() and resumeMusic()
*/

const assert = require('node:assert/strict');

const {
  buildPauseOverlay,
  showPauseOverlay,
  hidePauseOverlay,
  pauseMenu,
  buildLevelSelectPanel,
  showLevelSelectPanel,
  hideLevelSelectPanel
} = require('../src/controller/menu.js');

// local test helper
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


// ---------- DOM stubs ----------

function makeElement(tag) {
  const el = {
    tag,
    id: '',
    style: {},
    children: [],
    textContent: '',
    onmouseenter: null,
    onmouseleave: null,
    onclick: null,
    appendChild(child) {
      this.children.push(child);
    },
    querySelectorAll(selector) {
      const results = [];
      function walk(node) {
        for (const c of node.children) {
          if (selector === 'button' && c.tag === 'button') {
            results.push(c);
          }
          walk(c);
        }
      }
      walk(this);
      return results;
    }
  };
  return el;
}

function createDocumentStub() {
  const body = makeElement('body');

  function findById(node, id) {
    if (node.id === id) return node;
    for (const c of node.children) {
      const found = findById(c, id);
      if (found) return found;
    }
    return null;
  }

  return {
    body,
    createElement(tag) {
      return makeElement(tag);
    },
    getElementById(id) {
      return findById(body, id);
    }
  };
}

function resetBaseEnv() {
  // DOM
  global.document = createDocumentStub();
  global.location = {
    reload: () => { /* no-op in tests */ }
  };

  // game globals used by menu.js
  global.changeBallSkin = () => { /* stub */ };
  global.ball = { color: '#ffffff' };
  global.levels = [{ ballColor: '#ffffff' }];
  global.currentLevel = 0;

  global.gameHandler = {
    resumeGame: () => { },
    isPaused: () => false
  };

  global.resumeMusic = () => { };
  global.openOptions = null;
  global.loadLevel = () => { };
}

// ---------- Tests ----------

test('buildPauseOverlay creates pause and level-select overlays', () => {
  resetBaseEnv();

  // fresh body
  document.body.children = [];

  buildPauseOverlay();

  const pauseEl = document.getElementById('pauseOverlay');
  const levelPanel = document.getElementById('levelSelectPanel');

  assert.ok(pauseEl, 'pauseOverlay element should exist');
  assert.ok(levelPanel, 'levelSelectPanel element should exist');
});

test('showPauseOverlay and hidePauseOverlay toggle display', () => {
  resetBaseEnv();
  document.body.children = [];

  buildPauseOverlay();

  const pauseEl = document.getElementById('pauseOverlay');
  assert.ok(pauseEl);

  // initially style.display is undefined; show should set it to flex
  showPauseOverlay();
  assert.equal(pauseEl.style.display, 'flex');

  hidePauseOverlay();
  assert.equal(pauseEl.style.display, 'none');
});

test('clicking Resume button calls resumeGame and resumeMusic', () => {
  resetBaseEnv();

  let resumed = false;
  let music = false;

  global.gameHandler.resumeGame = () => { resumed = true; };
  global.resumeMusic = () => { music = true; };

  document.body.children = [];
  buildPauseOverlay();

  const pauseEl = document.getElementById('pauseOverlay');
  const buttons = [];
  (function collectButtons(node) {
    for (const c of node.children) {
      if (c.tag === 'button') buttons.push(c);
      collectButtons(c);
    }
  })(pauseEl);

  const resumeBtn = buttons.find(b => b.textContent === 'Resume');
  assert.ok(resumeBtn, 'Resume button should exist');

  resumeBtn.onclick();

  assert.equal(resumed, true);
  assert.equal(music, true);
});

test('showLevelSelectPanel hides pauseOverlay and shows levelSelectPanel', () => {
  resetBaseEnv();
  document.body.children = [];

  buildPauseOverlay();

  const pauseEl = document.getElementById('pauseOverlay');
  const levelPanel = document.getElementById('levelSelectPanel');
  assert.ok(pauseEl);
  assert.ok(levelPanel);

  pauseEl.style.display = 'flex';
  levelPanel.style.display = 'none';

  showLevelSelectPanel();

  assert.equal(pauseEl.style.display, 'none');
  assert.equal(levelPanel.style.display, 'flex');

  hideLevelSelectPanel();
  assert.equal(levelPanel.style.display, 'none');
});

test('clicking a level button calls loadLevel, resumeGame, and resumeMusic', () => {
  resetBaseEnv();
  document.body.children = [];

  let resumed = false;
  let music = false;
  let loadedIdx = null;

  global.gameHandler.resumeGame = () => { resumed = true; };
  global.resumeMusic = () => { music = true; };
  global.loadLevel = (i) => { loadedIdx = i; };

  buildPauseOverlay();

  const levelPanel = document.getElementById('levelSelectPanel');
  assert.ok(levelPanel);

  const buttons = [];
  (function collectButtons(node) {
    for (const c of node.children) {
      if (c.tag === 'button') buttons.push(c);
      collectButtons(c);
    }
  })(levelPanel);

  // First level button (not the "Back" button at the end)
  const levelBtn = buttons.find(b => b.textContent !== 'Back');
  assert.ok(levelBtn, 'At least one level button should exist');

  levelBtn.onclick();

  assert.equal(resumed, true);
  assert.equal(music, true);
  assert.equal(loadedIdx, 0); // first level should be index 0
});

test('pauseMenu calls camera.off and camera.on once and does not throw', () => {
  resetBaseEnv();

  let offCount = 0;
  let onCount = 0;

  global.camera = {
    off() { offCount++; },
    on() { onCount++; }
  };

  // p5-ish drawing stubs
  global.push = () => { };
  global.pop = () => { };
  global.noStroke = () => { };
  global.fill = () => { };
  global.rectMode = () => { };
  global.rect = () => { };
  global.textAlign = () => { };
  global.textSize = () => { };
  global.text = () => { };
  global.stroke = () => { };
  global.strokeWeight = () => { };
  global.width = 800;
  global.height = 600;
  global.CORNER = 'CORNER';
  global.CENTER = 'CENTER';

  global.drawingContext = {
    save: () => { },
    restore: () => { },
    shadowBlur: 0,
    shadowColor: ''
  };

  assert.doesNotThrow(() => {
    pauseMenu();
  });

  assert.equal(offCount, 1);
  assert.equal(onCount, 1);
});


