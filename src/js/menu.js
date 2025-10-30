function buildPauseOverlay() {
    //overlay
    pauseOverlayEl = document.createElement('div');
    pauseOverlayEl.id = 'pauseOverlay';
    pauseOverlayEl.style.cssText = `
    position: fixed;
    inset: 0;
    display: none;
    z-index: 9999;
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(8px);
    justify-content: center;
    align-items: center;
    font-family: 'Arial', sans-serif;
  `;

    // the main panel
    const panel = document.createElement('div');
    panel.style.cssText = `
    width: min(90vw, 900px);
    padding: 50px 60px;
    border-radius: 24px;
    background: rgba(255, 255, 255, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 8px 32px rgba(0,0,0,0.3);
    color: white;
    text-align: center;
  `;
    pauseOverlayEl.appendChild(panel);

    //the title
    const h1 = document.createElement('h1');
    h1.textContent = 'Game Paused';
    h1.style.cssText = `
    font-size: 60px;
    margin: 0 0 25px;
    color: white;
    text-shadow: 0 0 15px rgba(255,255,255,0.8);
  `;
    panel.appendChild(h1);
    // the instructions
    const tip1 = document.createElement('div');
    tip1.textContent = 'Press P to Resume';
    tip1.style.cssText = `
    font-size: 22px;
    margin: 10px 0;
    color: rgba(255,255,255,0.9);
  `;
    panel.appendChild(tip1);

    const tip2 = document.createElement('div');
    tip2.textContent = 'Press R to Restart Level';
    tip2.style.cssText = `
    font-size: 22px;
    margin-bottom: 40px;
    color: rgba(255,255,255,0.9);
  `;
    panel.appendChild(tip2);

    // skin selection section
    const skinSection = document.createElement('div');
    skinSection.style.cssText = `
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
    margin: 30px 0;
  `;

    const skinLabel = document.createElement('div');
    skinLabel.textContent = 'Select Ball Skin';
    skinLabel.style.cssText = `
    font-size: 20px;
    color: rgba(255,255,255,0.95);
  `;
    skinSection.appendChild(skinLabel);

    const skinButtons = document.createElement('div');
    skinButtons.style.cssText = `
    display: flex;
    gap: 20px;
  `;

    // make the skin buttons
    const skins = ['8ball', 'donut', 'soccer'];
    skins.forEach(skin => {
        const btn = document.createElement('button');
        btn.style.cssText = `
      width: 80px;
      height: 80px;
      border-radius: 50%;
      border: 3px solid rgba(255,255,255,0.3);
      background: rgba(0,0,0,0.2);
      cursor: pointer;
      background-size: cover;
      background-position: center;
      transition: all 0.2s;
    `;
        btn.style.backgroundImage = `url(../art/${skin === 'soccer' ? 'SoccerBall' : skin}.png)`;

        btn.onmouseenter = () => {
            btn.style.borderColor = 'rgba(255,255,255,0.8)';
            btn.style.transform = 'scale(1.1)';
        };
        btn.onmouseleave = () => {
            btn.style.borderColor = 'rgba(255,255,255,0.3)';
            btn.style.transform = 'scale(1.0)';
        };
        btn.onclick = () => {
            changeBallSkin(skin);
            skinButtons.querySelectorAll('button').forEach(b =>
                b.style.borderColor = 'rgba(255,255,255,0.3)');
            btn.style.borderColor = '#00ff96';
        };

        skinButtons.appendChild(btn);
    });

    skinSection.appendChild(skinButtons);
    panel.appendChild(skinSection);

    // pick color
    const colorSection = document.createElement('div');
    colorSection.style.cssText = `
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    margin: 30px 0;
  `;

    const colorLabel = document.createElement('div');
    colorLabel.textContent = 'Choose Ball Color';
    colorLabel.style.cssText = `
    font-size: 20px;
    color: rgba(255,255,255,0.95);
  `;
    colorSection.appendChild(colorLabel);

    const colorPicker = document.createElement('input');
    colorPicker.type = 'color';
    colorPicker.value = '#ff0000';
    colorPicker.style.cssText = `
    width: 90px;
    height: 45px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    box-shadow: 0 0 10px rgba(0,0,0,0.3);
  `;
    colorPicker.oninput = (e) => {
        if (ball) {
            ball.color = e.target.value;
            levels[currentLevel].ballColor = e.target.value;
        }
    };
    colorSection.appendChild(colorPicker);
    panel.appendChild(colorSection);

    // butons on the bottomn
    const bottomButtons = document.createElement('div');
    bottomButtons.style.cssText = `
    display: flex;
    justify-content: center;
    gap: 40px;
    margin-top: 20px;
  `;
    panel.appendChild(bottomButtons);

    // Resume Button
    const resumeBtn = document.createElement('button');
    resumeBtn.textContent = 'Resume';
    resumeBtn.style.cssText = `
    padding: 14px 28px;
    font-size: 20px;
    border-radius: 12px;
    border: 2px solid rgba(0,255,150,0.7);
    background: rgba(0,255,150,0.3);
    color: white;
    cursor: pointer;
    transition: all 0.2s;
  `;
    resumeBtn.onmouseenter = () => resumeBtn.style.background = 'rgba(0,255,150,0.5)';
    resumeBtn.onmouseleave = () => resumeBtn.style.background = 'rgba(0,255,150,0.3)';
    resumeBtn.onclick = () => {
        gameHandler.pauseGame();

        hidePauseOverlay();
        resumeMusic(); // Resume music when resume button is clicked
    };
    bottomButtons.appendChild(resumeBtn);

    // Quit Button
    const quitBtn = document.createElement('button');
    quitBtn.textContent = 'Quit Game';
    quitBtn.style.cssText = `
    padding: 14px 28px;
    font-size: 20px;
    border-radius: 12px;
    border: 2px solid rgba(255,100,100,0.8);
    background: rgba(255,100,100,0.4);
    color: white;
    cursor: pointer;
    transition: all 0.2s;
  `;
    quitBtn.onmouseenter = () => quitBtn.style.background = 'rgba(255,100,100,0.6)';
    quitBtn.onmouseleave = () => quitBtn.style.background = 'rgba(255,100,100,0.4)';
    quitBtn.onclick = () => { location.reload(); };
    bottomButtons.appendChild(quitBtn);

    // Add overlay to document
    document.body.appendChild(pauseOverlayEl);
}

// Show / hide helpers
function showPauseOverlay() {
    if (pauseOverlayEl) pauseOverlayEl.style.display = 'flex';
}

function hidePauseOverlay() {
    if (pauseOverlayEl) pauseOverlayEl.style.display = 'none';
}

function showPauseOverlay() {
    if (pauseOverlayEl) pauseOverlayEl.style.display = 'flex';
}

function hidePauseOverlay() {
    if (pauseOverlayEl) pauseOverlayEl.style.display = 'none';
}

function pauseMenu() {
    camera.off(); // Draw UI directly in screen space
    push();
    noStroke();
    fill(255, 255, 255, 400); // semi-transparent black overlay
    rectMode(CORNER);
    rect(0, 0, width, height);

    // === Glass panel ===
    const panelW = width * 0.7;
    const panelH = height * 0.6;
    const panelX = width / 2 - panelW / 2;
    const panelY = height / 2 - panelH / 2;

    // translucent white "glass"
    drawingContext.save();
    drawingContext.shadowBlur = 40;
    drawingContext.shadowColor = "rgba(255,255,255,0.4)";
    fill(255, 255, 255, 50);
    stroke(255, 255, 255, 100);
    strokeWeight(2);
    rect(panelX, panelY, panelW, panelH, 30);
    drawingContext.restore();

    // === Title ===
    fill(255);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(60);
    text("Game Paused", width / 2, height / 2 - 120);

    // === Sub text ===
    textSize(28);
    fill(255, 230);
    text("Press P to Resume", width / 2, height / 2 - 40);
    text("Press R to Restart Level", width / 2, height / 2 + 10);

    // === Buttons ===
    const btnY = height / 2 + 100;
    const btnW = 180;
    const btnH = 50;

    // Resume Button
    fill(255, 255, 255, 40);
    stroke(255, 255, 255, 150);
    strokeWeight(2);
    rect(width / 2 - btnW - 10, btnY, btnW, btnH, 12);
    noStroke();
    fill(255);
    textSize(24);
    text("Resume", width / 2 - btnW / 2 - 10, btnY + btnH / 2 + 2);

    // Random Color Button
    fill(255, 100, 100, 100);
    stroke(255, 100, 100);
    strokeWeight(2);
    rect(width / 2 + 10, btnY, btnW, btnH, 12);
    noStroke();
    fill(255);
    text("Random Color", width / 2 + btnW / 2 + 10, btnY + btnH / 2 + 2);

    pop();
    camera.on();
}