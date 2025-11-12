// performs an aggressive cleaning of the canvas
function forceClean() {
    // clear drawing space
    clear();
    // remove all sprites from the scene
    allSprites.remove();
}

// When called the function assigns ballColor to a random color
function randomColor() {
    levels[currentLevel].ballColor = random(['red', 'black', 'purple', 'pink', 'yellow', 'green', 'blue']);
    if (ball) ball.color = levels[currentLevel].ballColor;
}

function formatTime(totalSeconds) {
    let minutes = floor(totalSeconds / 60);
    let seconds = floor(totalSeconds % 60);
    return nf(minutes, 2) + ":" + nf(seconds, 2);
}

async function sleep(seconds) {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

function updateObstacles() {
    blackholeAttraction(); // blackhole attraction
    teleportation();       // teleporter check

    if (typeof ShrinkPad !== 'undefined') {
      ShrinkPad.update(ball, levelObjects.shrinkpads);
    }

    levelObjects.platforms?.forEach(platform => {
        platform.physics = KINEMATIC;
        if (!platform.speed) platform.speed = 2;
    });

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
        if (godMode) return;
        if (ball && ball.colliding(spring)) {
            ball.vel.y = -15;
            if (springSound && springSound.isLoaded()) {
                springSound.setVolume(globalVolume * 0.25);
                springSound.play();
            }
        }
    });

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
}