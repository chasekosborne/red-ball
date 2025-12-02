function teleportation() {
    if (!ball) return;

    levelObjects.teleporter?.forEach((teleporter, index) => {  
        if (dist(ball.x, ball.y, teleporter.x, teleporter.y) < 45 && teleporterActive == true) {   
                let pairIndex;
                if (index % 2 === 0) {
                    pairIndex = index + 1;
                } else {
                    pairIndex = index - 1;
                }
                if (pairIndex >= 0 && pairIndex < levelObjects.teleporter.length) {
                    ball.x = levelObjects.teleporter[pairIndex].x;  
                    ball.y = levelObjects.teleporter[pairIndex].y;
                    if(teleportSound && teleportSound.isLoaded()) {
                      teleportSound.setVolume(globalVolume * 0.25);
                      teleportSound.play(); 
                    } 

                    teleporterActive = false;     
                    beginTime = millis();         
                }
        }
        if(millis() - beginTime >=3000){  
            teleporterActive = true;    
        }

    }); 
}

// Only for Node-based unit tests
if (typeof module !== 'undefined') {
  module.exports = {
    teleportation
  };
}