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