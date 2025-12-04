function buildPauseOverlay() {
  // === Outer overlay ===
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

  // === Glass panel ===
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

  // === Title ===
  const h1 = document.createElement('h1');
  h1.textContent = 'Game Paused';
  h1.style.cssText = `
    font-size: 60px;
    margin: 0 0 25px;
    color: white;
    text-shadow: 0 0 15px rgba(255,255,255,0.8);
  `;
  panel.appendChild(h1);

  // === Instructions ===
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

  // === Ball Skin Section ===
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
  // this is where you can easily add skins btw
  const skins = ['default', '8ball', 'donut', 'soccer', 'moon'];
  
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
    btn.style.backgroundImage = `url(../view/art/${skin === 'soccer' ? 'SoccerBall' : skin}.png)`;
    if (skin === 'default') {
      // Default = 没有图片，只是纯色球
      btn.style.backgroundImage = 'none';
      btn.style.background = 'rgba(255, 255, 255, 0.2)';
  } else {
      btn.style.backgroundImage = `url(../view/art/${skin === 'soccer' ? 'SoccerBall' : skin}.png)`;
  }
  

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

  // === Ball Color Picker ===
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
    if (!ball) return;

    if (ball.skin === "default") {
        ball.color = e.target.value;
    }

    levels[currentLevel].ballColor = e.target.value;
};

  colorSection.appendChild(colorPicker);
  panel.appendChild(colorSection);

  // === Bottom Buttons (Resume, Options, Quit) ===
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
    gameHandler.resumeGame();
    hidePauseOverlay();
    resumeMusic();
  };
  bottomButtons.appendChild(resumeBtn);

  // Options Button
  const optionsBtn = document.createElement('button');
  optionsBtn.textContent = 'Options';
  optionsBtn.style.cssText = `
    padding: 14px 28px;
    font-size: 20px;
    border-radius: 12px;
    border: 2px solid rgba(255,255,255,0.6);
    background: rgba(255,255,255,0.2);
    color: white;
    cursor: pointer;
    transition: all 0.2s;
  `;
  optionsBtn.onmouseenter = () => optionsBtn.style.background = 'rgba(255,255,255,0.4)';
  optionsBtn.onmouseleave = () => optionsBtn.style.background = 'rgba(255,255,255,0.2)';
  optionsBtn.onclick = () => {
    hidePauseOverlay();
    if (typeof openOptions === 'function') {
      openOptions();
    } else {
      document.getElementById("options-menu").style.display = "block";
    }
  };
  bottomButtons.appendChild(optionsBtn);


  // Change Level Button
  const changeLevelBtn = document.createElement('button');
  changeLevelBtn.textContent = 'Change Level';
  changeLevelBtn.style.cssText = `
    padding: 14px 28px;
    font-size: 20px;
    border-radius: 12px;
    border: 2px solid rgba(255,255,255,0.6);
    background: rgba(255,255,255,0.2);
    color: white;
    cursor: pointer;
    transition: all 0.2s;
  `;
  changeLevelBtn.onmouseenter = () => changeLevelBtn.style.background = 'rgba(255,255,255,0.4)';
  changeLevelBtn.onmouseleave = () => changeLevelBtn.style.background = 'rgba(255,255,255,0.2)';
  changeLevelBtn.onclick = () => {
    console.log('Change Level clicked');
    showLevelSelectPanel();
  };
  bottomButtons.appendChild(changeLevelBtn);



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

  // === Add overlay to document ===
  document.body.appendChild(pauseOverlayEl);
  buildLevelSelectPanel();
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

function buildLevelSelectPanel() {
  const panel = document.createElement('div');
  panel.id = 'levelSelectPanel';
  panel.style.cssText = `
    position: fixed;
    inset: 0;
    display: none;
    z-index: 10000;
    backdrop-filter: blur(8px);
    background: rgba(0, 0, 0, 0.6);
    color: white;
    text-align: center;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  `;

  // === Title ===
  const title = document.createElement('h2');
  title.textContent = "Select a Level";
  title.style.marginBottom = "20px";
  title.style.fontSize = "36px";
  panel.appendChild(title);

  // === Level Buttons Container ===
  const btnContainer = document.createElement('div');
  btnContainer.style.cssText = `
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
  `;
  panel.appendChild(btnContainer);

  // should match our levels in order now
  const levelNames = ["Tutorial", "Level 1", "Level 2", "Level 3", "Level 4"];

  levelNames.forEach((name, i) => {
    const btn = document.createElement('button');
    btn.className = 'level-select-btn'; 
    btn.dataset.levelIndex = i; 
    btn.textContent = name;
    btn.style.cssText = `
      width: 220px;
      padding: 12px 24px;
      font-size: 20px;
      font-weight: bold;
      border-radius: 10px;
      border: 2px solid rgba(255, 0, 0, 0.8);
      background: white;
      color: black;
      cursor: pointer;
      box-shadow: 0 0 10px rgba(255, 0, 0, 0.3);
      transition: all 0.2s;
    `;
    
    btn.onmouseenter = () => {
      if (btn.disabled) return;
      const isCompleted = completedLevels.includes(i);
      btn.style.background = isCompleted ? "rgba(200, 255, 200, 1)" : "rgba(255, 200, 200, 1)";
    };
    btn.onmouseleave = () => {
      if (btn.disabled) return;
      btn.style.background = "white";
    };

    btn.onclick = () => {
      if (btn.disabled) {
        console.log(`Level ${name} is locked!`);
        return;
      }
      console.log(`Clicked: ${name}`);
      hideLevelSelectPanel();
      gameHandler.resumeGame();
      resumeMusic();
      loadLevel(i);
    };

    btnContainer.appendChild(btn);
  });

  // === Back Button ===
  const backBtn = document.createElement("button");
  backBtn.textContent = "Back";
  backBtn.style.cssText = `
    width: 220px;
    padding: 12px 24px;
    font-size: 20px;
    font-weight: bold;
    border-radius: 10px;
    border: 2px solid rgba(255, 0, 0, 0.8);
    background: white;
    color: black;
    cursor: pointer;
    margin-top: 25px;
  `;
  backBtn.onmouseenter = () => (backBtn.style.background = "rgba(255, 200, 200, 1)");
  backBtn.onmouseleave = () => (backBtn.style.background = "white");
  backBtn.onclick = () => {
    hideLevelSelectPanel();
    showPauseOverlay();
  };

  panel.appendChild(backBtn);
  document.body.appendChild(panel);
}


function showLevelSelectPanel() {
  document.getElementById('pauseOverlay').style.display = 'none';
  document.getElementById('levelSelectPanel').style.display = 'flex';
  updateLevelSelectButtons(); 
}

function updateLevelSelectButtons() {
  const buttons = document.querySelectorAll('.level-select-btn');
  const levelNames = ["Tutorial", "Level 1", "Level 2", "Level 3", "Level 4"];
  
  buttons.forEach((btn, index) => {
    const levelIndex = parseInt(btn.dataset.levelIndex);
    const isUnlocked = isLevelUnlocked(levelIndex);
    const isCompleted = completedLevels.includes(levelIndex);
    
    
    btn.textContent = isUnlocked ? levelNames[index] : `🔒 ${levelNames[index]}`;
    
    
    btn.style.border = `2px solid ${isCompleted ? 'rgba(0, 255, 150, 0.8)' : 'rgba(255, 0, 0, 0.8)'}`;
    btn.style.background = isUnlocked ? 'white' : 'rgba(100, 100, 100, 0.5)';
    btn.style.color = isUnlocked ? 'black' : 'rgba(150, 150, 150, 1)';
    btn.style.cursor = isUnlocked ? 'pointer' : 'not-allowed';
    btn.style.boxShadow = `0 0 10px ${isCompleted ? 'rgba(0, 255, 150, 0.3)' : 'rgba(255, 0, 0, 0.3)'}`;
    btn.disabled = !isUnlocked;
  });
}

function hideLevelSelectPanel() {
  document.getElementById('levelSelectPanel').style.display = 'none';
}

// Only for Node-based unit tests
if (typeof module !== 'undefined') {
  module.exports = {
    buildPauseOverlay,
    showPauseOverlay,
    hidePauseOverlay,
    pauseMenu,
    buildLevelSelectPanel,
    showLevelSelectPanel,
    hideLevelSelectPanel
  };
}