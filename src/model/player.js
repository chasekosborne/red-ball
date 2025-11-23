function changeBallSkin(skinName) {
    if (!ball) return;

    ball.skin = skinName;

    if (skinName === "default") {
        ball.useImage = false;
        ball.img = null;  
    } else {
        ball.useImage = true;
        ball.img = ballSkins[skinName];
    }
}

function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        let p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.2;
        p.life--;

        if (ball) fill(ball.color); else fill(color(255, 255, 255));
        rect(p.x, p.y, 6, 6);

        if (p.life <= 0) particles.splice(i, 1);
    }
}

function explodeAndRespawn() {
    if (!ball) return;
    if (godMode) return;

    for (let i = 0; i < 20; i++) {
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

function respawn() {
    if (godMode) return;
    if (respawnTimer === 0) {
        if (difficulty === 'hard') {
            lives--;
            if (lives <= 0) {
                savedElapsedTime = levelElapsedTime;
                loadLevel(currentLevel);
                return;
            }
        }
        explodeAndRespawn();

        if (deathSound.isLoaded()) {
            deathSound.setVolume(globalVolume * 0.25);
            deathSound.play();
        }

    }
}