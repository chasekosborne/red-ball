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