// Music control functions
function playLevelMusic(level) {
    // Stop current music if playing
    if (currentMusic) {
        currentMusic.stop();
    }

    // Play new music based on level
    if (level.music === 'land' && landMusic && landMusic.isLoaded()) {
        currentMusic = landMusic;
        currentMusic.setVolume(musicVolume);
        currentMusic.loop();
        console.log('Playing Land music for level:', level.name);
    } else if (level.music === 'odyssey' && odysseyMusic && odysseyMusic.isLoaded()) {
        currentMusic = odysseyMusic;
        currentMusic.setVolume(musicVolume);
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
    // Also pause menu music if playing
    if (redballMusic && redballMusic.isPlaying()) {
        redballMusic.pause();
    }
}

function resumeMusic() {
    // Resume current level music
    if (currentMusic) {
        currentMusic.setVolume(musicVolume);
        currentMusic.play();
        console.log('Music resumed');
    }
    // Resume menu music if it exists (shouldn't be playing during level, but just in case)
    if (redballMusic) {
        const menuEl = document.getElementById('menu');
        if (menuEl && (menuEl.style.display !== 'none' && window.getComputedStyle(menuEl).display !== 'none')) {
            redballMusic.setVolume(musicVolume);
            redballMusic.play();
        }
    }
}

function playMenuMusic() {
    // Stop current level music if playing
    if (currentMusic) {
        currentMusic.stop();
    }
    
    // Play menu music
    if (redballMusic && redballMusic.isLoaded()) {
        redballMusic.setVolume(musicVolume);
        redballMusic.loop();
        console.log('Playing Redball music for main menu');
    }
}

// Update music volume for all currently playing music
function updateMusicVolume() {
    // Update level music (check if it exists, regardless of playing state - it might be paused)
    if (currentMusic) {
        currentMusic.setVolume(musicVolume);
    }
    // Update menu music if it exists
    if (redballMusic) {
        redballMusic.setVolume(musicVolume);
    }
    console.log('Music volume updated to:', musicVolume);
}

function stopMenuMusic() {
    if (redballMusic && redballMusic.isPlaying()) {
        redballMusic.stop();
        console.log('Stopped menu music');
    }
}