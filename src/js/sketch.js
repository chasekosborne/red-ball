new Q5();
new Canvas();

world.gravity.y = 10;
beginTime = millis();

// Music control functions
function playLevelMusic(level) {
    // Stop current music if playing
    if (currentMusic) {
        currentMusic.stop();
    }

    // Play new music based on level
    if (level.music === 'land' && landMusic && landMusic.isLoaded()) {
        currentMusic = landMusic;
        currentMusic.setVolume(globalVolume * 0.3); // Lower volume for background music
        currentMusic.loop();
        console.log('Playing Land music for level:', level.name);
    } else if (level.music === 'odyssey' && odysseyMusic && odysseyMusic.isLoaded()) {
        currentMusic = odysseyMusic;
        currentMusic.setVolume(globalVolume * 0.3); // Lower volume for background music
        currentMusic.loop();
        console.log('Playing Odyssey music for level:', level.name);
    } else {
        console.log('No music specified for level:', level.name);
    }
}

function pauseMusic() {
    if (currentMusic && currentMusic.isPlaying()) {
        currentMusic.pause();
        console.log('Music paused');
    }
}

function resumeMusic() {
    if (currentMusic && !currentMusic.isPlaying()) {
        currentMusic.play();
        console.log('Music resumed');
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
                      teleportSound.setVolume(globalVolume * 0.25);
                      teleportSound.play(); 
                    } 

                    teleporterActive = false;     //deactivates teleporter temporarily
                    beginTime = millis();         //logs the milliseconds when teleportation occured
                } else if (teleporter === levelObjects.teleporter[1] && teleporterActive == true) {
                    ball.x = levelObjects.teleporter[0].x;        
                    ball.y = levelObjects.teleporter[0].y;
                    if(teleportSound && teleportSound.isLoaded()) {
                      teleportSound.setVolume(globalVolume * 0.25);
                      teleportSound.play(); 
                    } 
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
            if (deathSound && deathSound.isLoaded()) {
              deathSound.setVolume(globalVolume * 0.25);
              deathSound.play();
            }
          }
        }
        
    }); 
}

function preload() {
    jumpSound = loadSound('../audio/ball.mp3');
    springSound = loadSound('../audio/spring.mp3');
    deathSound = loadSound('../audio/dead.mp3');
    teleportSound = loadSound('../audio/whoosh.mp3');

    // Load music files
    landMusic = loadSound('../audio/music/Land.mp3');
    odysseyMusic = loadSound('../audio/music/Odyssey.mp3');

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


    // Load all ball skins
    ballSkins = {
        '8ball': loadImage("../art/8ball.png", img => {
            img.resize(125, 125);
        }),
        'donut': loadImage("../art/donut.png", img => {
            img.resize(125, 125);
        }),
        'soccer': loadImage("../art/SoccerBall.png", img => {
            img.resize(125, 125);
        })
    };

    // Set default skin
    ballSkinImage = ballSkins['8ball'];
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
        }
    } else {
        if (key === 'e') {
            editor.enabled = !editor.enabled;

            // if entering editor while paused, unpause & hide DOM pause overlay
            if (editor.enabled && gameHandler.isPaused()) {
                gameHandler.resumeGame()
                hidePauseOverlay();
            }
        } else if (key === 'r') {
            // restart level ONLY when not editing and not paused
            if (!editor.enabled && !gameHandler.isPaused()) {
                loadLevel(currentLevel);
            }
        }
    }
}

function update() {
    if (pressedPause() || presspause) {
        presspause = false;
    }

    if (editor.enabled) { // level edit mode
        EditorMode();
    } else if (gameHandler.isPaused()) { // paused game
        levelObjects.platforms?.forEach(p => { p.physics = STATIC; });

        if (ball) {
            ball.vel.x = 0; ball.vel.y = 0;
            ball.rotationSpeed = 0; ball.angularVelocity = 0;
        }

        drawBackgroundForLevel();
        if (typeof allSprites !== 'undefined') allSprites.draw();

        pauseObstacles();
    } else { // running game
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
                    springSound.setVolume(globalVolume * 0.25);
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
        levelObjects.disappearingPlatforms?.forEach(platform => {
            if (ball && ball.colliding(platform)) onGround = true;
        });
        if (onGround) jumpCount = 0;

        // Controls
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

        teleportation(); //teleporter check

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
}

// When called the function assigns ballColor to a random color
function randomColor() {
    levels[currentLevel].ballColor = random(['red', 'black', 'purple', 'pink', 'yellow', 'green', 'blue']);
    if (ball) ball.color = levels[currentLevel].ballColor;
}