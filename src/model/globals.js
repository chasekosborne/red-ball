// collection of images
let unclaimedFlagImage;
let claimedFlagImage;
let spikeImage;
let laserBlasterImage;
let hammerImage;
let asteriod_sprites;
let teleporterImage;
let blackholeImage;
let shrinkPadImage;

// Player Vars
let ball;
let ballColor;
let particles = [];
let respawnTimer = 0;
let jumpCount = 0;
let maxJumps = 1;
let lastPlayerVel = [0, 0];
let pausePosition = [0, 0];
let lives = Infinity;
let respawnPosition = [500, 150];

// Confetti variables
let confetti = [];
let confettiActive = false;

// SFX
let jumpSound;
let deathSound;
let springSound;
let ballSkinImage;
let teleportSound;
let checkSound;
let winSound;

// Music variables
let landMusic;
let odysseyMusic;
let redballMusic;
let currentMusic;

// Game Vars
let spikes;
let platform;
let spring;
let blackhole;
let gameState = "playing"; // start in menu
let teleporter;
let teleporterActive = true;

// menu globals
let button;
let pauseOverlayEl;
let colorButtonBounds = { x: 20, y: 100, w: 100, h: 30 };
let pauseButtonBounds = { x: 20, y: 140, w: 100, h: 30 };

// level meta data
let presspause = false;
let difficulty = 'normal';
let globalVolume = 0.5;
let musicVolume = 0.8;
let positionMenuVisible = false;

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

// ==== Timer variables ====
let beginTime;
let levelElapsedTime = 0;
let lastFrameTime = 0;
let savedElapsedTime = 0;

// ==== Tile variables ====
let bricksGroup = null;
let bricksBuilt = false;
let brickImage;
let pinkfullGroup = null;
let pinkrightGroup = null;
let pinkleftGroup = null;
let pinkleftImage;
let pinkfullImage;
let pinkrightImage;
let texturedBrickImage;
let texturedBrickGroup = null;
let leftCornerBrickImage;
let rightCornerBrickImage;
let leftCornerBrickGroup = null;
let rightCornerBrickGroup = null;
let leftCornerInvertBrickImage;
let rightCornerInvertBrickImage;
let leftCornerBrickGroupInvert = null;
let rightCornerBrickGroupInvert = null;
let rightCornerInvertBrickImage2;
let rightCornerBrickGroupInvert2 = null;
let leftCornerInvertBrickImage2;
let leftCornerBrickGroupInvert2 = null;

// ==== Tile Optimization ====
let tileGraphicsCache = null; // Pre-rendered tile graphics buffer
let tiles = null; // Tiles object (legacy)
let tileRenderDistance = 1500; // Only render tiles within this distance from camera
let tileCollisionUpdateCounter = 0; // Counter to throttle collision updates
let tileCollisionUpdateInterval = 5; // Update collisions every N frames
let simplifiedTileColliders = []; // Simplified collision boxes instead of individual sprites
let useLegacyTiles = false; // Flag to switch between old and new tile system

// ==== God Mode ====
let godMode = false;

// ==== Exports for Node-based unit tests ====
// This only runs in Node (for tests), not in the browser.
if (typeof module !== 'undefined') {
  module.exports = {
    difficulty,
    globalVolume,
    musicVolume,
    BG_SKY,
    BG_SPACE,
    godMode,
  };
}