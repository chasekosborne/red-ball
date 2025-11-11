new Q5();
new Canvas();

world.gravity.y = 10;
beginTime = millis();

function cameraFollow() {
    if (ball) {
        ball.physics = DYNAMIC;

        // Camera handeler
        camera.x += (ball.x - camera.x) * 0.1;
        camera.y += (ball.y - camera.y) * 0.1;
    }
}

function updatePlayer() {
    // Ball fall off map respawner
    if (!godMode && ball && ball.y > 700) {
        respawn();
        updateParticles();
        return;
    }

    // Jump reset Handler
    let onGround = false;
    levelObjects.ground?.forEach(ground => {
        if (ball && ball.colliding(ground)) onGround = true;
    });
    levelObjects.platforms?.forEach(platform => {
        if (ball && ball.colliding(platform)) onGround = true;
    });
    levelObjects.disappearingPlatforms?.forEach(platform => {
        if (ball && ball.colliding(platform)) onGround = true;
    });
    levelObjects.bricks?.forEach(brick => {
        if (ball && ball.colliding(brick)) onGround = true;
    });
    pinkfullGroup?.forEach(brick => {
        if(ball && ball.colliding(brick)) onGround = true;
    });
    // Check simplified tile colliders
    if (simplifiedTileColliders && simplifiedTileColliders.length > 0) {
        simplifiedTileColliders.forEach(collider => {
            if (ball && ball.colliding(collider)) onGround = true;
        });
    }
    if (onGround) jumpCount = 0;

    // Controls
    // God mode flying movement
    if (godMode && ball && ball.visible) {
      const speed = kb.pressing('shift') ? 8 : 4;
      if (kb.pressing('left'))  ball.x -= speed;
      if (kb.pressing('right')) ball.x += speed;
      if (kb.pressing('up'))    ball.y -= speed;
      if (kb.pressing('down'))  ball.y += speed;
      return; // skip normal jump/run controls while flying
    }
    
    if (ball && ball.visible) {
        // only give the player control when the player is visible on screen

        if (kb.presses('space')) {
            if (ball && jumpCount < maxJumps) {
                // when grounded we can assume vel.y is 0
                // we can just increment the vel.y by the jump-strength
                ball.vel.y += -7;
                if (jumpSound && jumpSound.isLoaded()) {
                    jumpSound.setVolume(globalVolume * 0.25);
                    jumpSound.play(0, 1, .2, .5, .7);
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
    }

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

    updateParticles();
}

function pressedPause() {
    return kb.pressed('Escape') || kb.pressed('P') || kb.pressed('p');
}
function pressedPause(key) {
    if (!key) return false;

    console.log(`Key Pressed -> ${key}`);
    return key === 'Escape' || key === 'P' || key === 'p';
}

// p5js predefined callback that triggers per-press
function keyPressed() {
    if (pressedPause(key)) {
        if (!gameHandler.isPaused()) {
            // track current vel
            lastPlayerVel = [ball.vel.x, ball.vel.y];
            gameHandler.pauseGame();

            if (typeof showPauseOverlay === 'function') showPauseOverlay();
            pauseMusic(); // Pause music when game is paused
        } else {
            gameHandler.resumeGame();

            ball.vel.x = lastPlayerVel[0];
            ball.vel.y = lastPlayerVel[1];

            if (typeof hidePauseOverlay === 'function') hidePauseOverlay();
            resumeMusic(); // Resume music when game is unpaused
            lastFrameTime = millis();
        }
    } else {
        if (keyCode === 192) {
            positionMenuVisible = !positionMenuVisible;
        } else if (key === 'e') {
            editor.enabled = !editor.enabled;

            // if entering editor while paused, unpause & hide DOM pause overlay
            if (editor.enabled && gameHandler.isPaused()) {
                gameHandler.resumeGame()
                hidePauseOverlay();
            }
            
            // Ensure tiles are rebuilt when toggling editor
            cleanupTileSystem();
            if (typeof ensureSpaceAssets === 'function') {
                ensureSpaceAssets();
            }
        } else if (key === 'r') {
            // restart level ONLY when not editing and not paused
            if (!editor.enabled && !gameHandler.isPaused()) {
                cleanupTileSystem();
                loadLevel(currentLevel);
            }
        }
    }
    if (key === 'g') {
        godMode = !godMode;
        if (ball) {
            if (godMode) {
                // disable collisions & gravity
                ball.collider = 'none';
                ball.vel.x = 0; 
                ball.vel.y = 0;
                world.gravity.y = 0;
            } else {
                // restore normal physics
                ball.collider = 'dynamic';
                world.gravity.y = 10;  
            }
        }
    }
}

//=========================
//==== P5-JS Functions ====
//=========================

// load images and sounds
function preload() {
  // AUDIO (sfx)
  jumpSound     = loadSound('../view/audio/ball.mp3');
  springSound   = loadSound('../view/audio/spring.mp3');
  deathSound    = loadSound('../view/audio/dead.mp3');
  teleportSound = loadSound('../view/audio/whoosh.mp3');
  checkSound    = loadSound('../view/audio/check.mp3');

  // AUDIO (music)
  landMusic    = loadSound('../view/audio/music/Plains.mp3');
  odysseyMusic = loadSound('../view/audio/music/Odyssey.mp3');
  redballMusic = loadSound('../view/audio/music/Redball.mp3');

  // IMAGES
  unclaimedFlagImage = loadImage('../view/art/unclaimed_checkpoint.png', img => img.resize(100, 100));
  claimedFlagImage   = loadImage('../view/art/claimed_checkpoint.png',   img => img.resize(100, 100));
  spikeImage         = loadImage('../view/art/spike.png',                img => img.resize(100, 100));
  teleporterImage    = loadImage('../view/art/teleportgreener.png',      img => img.resize(150, 150));
  shrinkPadImage     = loadImage('../view/art/shrink_pad.png',           img => img.resize(150, 150));
  laserBlasterImage  = loadImage('../view/art/laserMount.png',           img => img.resize(100, 100));

  brickImage              = loadImage('../view/art/Tiles2/plainbrick.png',         img => img.resize(50, 50));
  pinkfullImage           = loadImage('../view/art/Tiles2/pinktop.png',            img => img.resize(50, 50));
  pinkleftImage           = loadImage('../view/art/Tiles2/pinkleft.png',           img => img.resize(50, 50));
  pinkrightImage          = loadImage('../view/art/Tiles2/pinkright.png',          img => img.resize(50, 50));
  texturedBrickImage      = loadImage('../view/art/Tiles2/texturedtile.png',       img => img.resize(50, 50));
  leftCornerBrickImage    = loadImage('../view/art/Tiles2/tile_0070.png',          img => img.resize(50, 50));
  rightCornerBrickImage   = loadImage('../view/art/Tiles2/tile_0071.png',          img => img.resize(50, 50));
  leftCornerInvertBrickImage  = loadImage('../view/art/Tiles2/tile_0013.png',      img => img.resize(50, 50));
  rightCornerInvertBrickImage = loadImage('../view/art/Tiles2/tile_0014.png',      img => img.resize(50, 50));
  rightCornerInvertBrickImage2 = loadImage('../view/art/Tiles2/tile_0029.png',     img => img.resize(50, 50));
  leftCornerInvertBrickImage2  = loadImage('../view/art/Tiles2/tile_0028.png',     img => img.resize(50, 50));

  // asteroid sprites
  asteriod_sprites = [];
  asteriod_sprites.push(loadImage('../view/art/pixel_asteriod_sprite.png',   img => img.resize(100, 100)));
  asteriod_sprites.push(loadImage('../view/art/pixel_asteriod_sprite_2.png', img => img.resize(100, 100)));

  hammerImage    = loadImage('../view/art/hammer.png',    () => console.log('hammer loaded'));
  blackholeImage = loadImage('../view/art/blackhole.png', img => img.resize(300, 200));

  // ball skins
  ballSkins = {
    '8ball': loadImage('../view/art/8ball.png',      img => img.resize(125, 125)),
    'donut': loadImage('../view/art/donut.png',      img => img.resize(125, 125)),
    'soccer':loadImage('../view/art/SoccerBall.png', img => img.resize(125, 125)),
    'moon':  loadImage('../view/art/moon.png',       img => img.resize(125, 125)),
  };

  ballSkinImage = ballSkins['8ball'];
}

// Check if main menu is visible and play menu music accordingly
function checkAndPlayMenuMusic() {
    const menuElement = document.getElementById('menu');
    if (menuElement) {
        const isMenuVisible = menuElement.style.display !== 'none' && 
                             window.getComputedStyle(menuElement).display !== 'none';
        
        if (isMenuVisible) {
            // Menu is visible - play menu music if not already playing
            if (typeof playMenuMusic === 'function' && redballMusic && redballMusic.isLoaded()) {
                if (!redballMusic.isPlaying()) {
                    playMenuMusic();
                }
            }
        } else {
            // Menu is hidden - stop menu music if playing
            if (typeof stopMenuMusic === 'function' && redballMusic && redballMusic.isPlaying()) {
                stopMenuMusic();
            }
        }
    }
}

// initialize game scene
function setup() {
    createCanvas(windowWidth, windowHeight);

    // makes the pixels not blurry
    noSmooth();

    // Initialization pretty cool stuff
    initializeLevels();

    // Space background init
    randomSeed(spaceSeed);
    noiseSeed(spaceSeed);

    buildBgStarfield();
    buildPauseOverlay();
    
    // Start menu music if menu is visible
    checkAndPlayMenuMusic();

    const picker = document.getElementById('colorPicker');
    picker.addEventListener('input', () => {
        const chosenColor = picker.value;
        if (ball) {
            ball.color = chosenColor;
            levels[currentLevel].ballColor = chosenColor;
        }
    });
}

// game scene update
function update() {
    if (pressedPause() || presspause) {
        presspause = false;
    }

    // Check if main menu is visible and play menu music
    checkAndPlayMenuMusic();

    if (editor.enabled) { // level edit mode
        EditorMode();
    } else {
        if (gameHandler.isPaused()) { // paused game
            levelObjects.platforms?.forEach(p => { p.physics = STATIC; });

            if (ball) {
                ball.vel.x = 0; ball.vel.y = 0;
                ball.rotationSpeed = 0; ball.angularVelocity = 0;
            }

            drawBackgroundForLevel();
            
            // Draw optimized tiles when paused too
            if (typeof drawOptimizedTiles === 'function') {
                drawOptimizedTiles();
            }
            
            if (typeof allSprites !== 'undefined') allSprites.draw();

            pauseObstacles();
        } else { // running game
            if (difficulty === 'hard' && lives === Infinity) {
                lives = 3;
            } else if (difficulty !== 'hard' && lives !== Infinity) {
                lives = Infinity;
            }

            cameraFollow();

            drawBackgroundForLevel();
            
            // Draw optimized tiles BEFORE drawing sprites (so they render under everything)
            if (typeof drawOptimizedTiles === 'function') {
                drawOptimizedTiles();
            }
            
            // Draw all sprites
            if (typeof allSprites !== 'undefined') allSprites.draw();

            // ------ update the time ------
            let currentTime = millis();

            levelElapsedTime += currentTime - lastFrameTime;

            lastFrameTime = currentTime;

            if (difficulty === 'hard' && lives === Infinity) {
                lives = 3;
            } else if (difficulty !== 'hard' && lives !== Infinity) {
                lives = Infinity;
            }
            // -----------------------------

            updateObstacles();

            updatePlayer();

            // Checking if the level is done
            checkLevelCompletion();

            drawSigns();

            drawUI();

            // editor banner while unpaused
            if (editor.enabled) drawEditorBanner();
        }
    }
}