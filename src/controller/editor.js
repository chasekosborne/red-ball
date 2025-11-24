// ================ Level Editor Tools ======================
let editor = {
    enabled: false,
    tool: 'ground',          // 'ground' | 'platform' | 'spring' | 'spike' | 'checkpoint' | 'goal'
    grid: 20,
    dragStart: null,         // {x,y} while drawing rectangles
    spikeDir: 'up'           // 'up' | 'down' | 'left' | 'right'
};

// List of editor tools (cycle with 1/2)
const TOOL_LIST = [
    'ground',
    'platform',
    'spring',
    'spike',
    'checkpoint',
    'goal',
    'enemy',
    'teleporter',
    'laser',
    'disappearingPlatform',
    'swingingHammer'
];

// editor defaults for multi-step tools / orientation
editor.toolIndex = TOOL_LIST.indexOf(editor.tool);
editor.spikeDir = editor.spikeDir || 'up';          // 'up'|'right'|'down'|'left'
editor.laserDir = editor.laserDir || 'down';        // 'up'|'right'|'down'|'left'
editor.dragStart = null;                            // for rectangle tools
editor.staging = null;                              // for 2-click tools (enemy)

//================================ End Level Editor Tools =====================================

function drawEditorBanner() {
    camera.off();
    push();

    // preserve scale/shear
    const t = drawingContext.getTransform();  // DOMMatrix
    drawingContext.save();
    drawingContext.setTransform(t.a, t.b, t.c, t.d, 0, 0);

    rectMode(CORNER);
    noStroke();

    // clear strip
    fill(0);
    rect(0, 0, width, 28);

    // optional tint
    fill(0, 160);
    rect(0, 0, width, 28);

    // fresh text
    fill(255);
    textAlign(LEFT, CENTER);
    textSize(12);
    text(
        `EDITOR – tool: ${editor.tool} | 1:prev  2:next | R:rotate spike/laser | E:toggle | S:save`,
        8, 14
    );

    drawingContext.restore();
    pop();
    camera.on();
}

function worldMouseRaw() {
    // screen -> world, no grid snap (best for precise picking)
    return { x: mouseX + camera.x - halfWidth, y: mouseY + camera.y - halfHeight };
}

// pick radius in pixels (bump if needed)
const PICK_RADIUS = 70; // was 50; a bit more forgiving

function mousePressed() {
    // If the editor is enabled, priority goes to editor placement
    if (editor.enabled) {
        const p = worldMouse(); // snapped

        // Rectangle-by-drag tools
        if (['ground', 'platform', 'spring', 'teleporter', 'disappearingPlatform'].includes(editor.tool)) {
            editor.dragStart = p;
            return false;
        }

        // Single-click tools
        if (editor.tool === 'spike') {
            (levels[currentLevel].spikes ||= []).push({
                x: p.x, y: p.y, orientation: editor.spikeDir
            });

            loadLevel(currentLevel);
            return false;
        }

        if (editor.tool === 'checkpoint') {
            (levels[currentLevel].checkpoints ||= []).push({ x: p.x, y: p.y });

            loadLevel(currentLevel);
            return false;
        }

        if (editor.tool === 'goal') {
            levels[currentLevel].goalPosition = { x: p.x, y: p.y };

            loadLevel(currentLevel);
            return false;
        }

        // Two-click tool: enemy (click A = start, click B = end)
        if (editor.tool === 'enemy') {
            if (!editor.staging) {
                editor.staging = { startX: p.x, startY: p.y };
            }
            else {
                const a = editor.staging;
                (levels[currentLevel].enemies ||= []).push({
                    startX: a.startX, startY: a.startY,
                    endX: p.x, endY: p.y,
                    speed: 1
                });
                editor.staging = null;

                loadLevel(currentLevel);
            }
            return false;
        }

        // Single-click with defaults: laser, swingingHammer
        if (editor.tool === 'laser') {
            (levels[currentLevel].lasers ||= []).push({
                x: p.x, y: p.y,
                range: 300,
                speedData: { speed: 3, bulletSpeed: 8 },
                fwdDir: editor.laserDir.toUpperCase()   // UP/DOWN/LEFT/RIGHT
            });

            loadLevel(currentLevel);
            return false;
        }

        if (editor.tool === 'swingingHammer') {
            (levels[currentLevel].swingingHammers ||= []).push({
                pivotX: p.x,
                pivotY: p.y,
                length: 200,
                amplitude: 50,
                speed: 2,
                phase: 0,
                width: 780,
                height: 800,
                spikeHeight: 200,
                scale: 0.3
            });

            loadLevel(currentLevel);
            return false;
        }

        return false; // consume clicks while editing
    }

    // --- normal (non-editor) clicks: pause button & pause-menu button ---
    if (gameHandler.isPaused()) {
        // Example "Random Color" button in pause menu
        const btnX = width / 2, btnY = height / 2 + 100, btnW = 120, btnH = 40;
        if (mouseX >= btnX - btnW / 2 && mouseX <= btnX + btnW / 2 &&
            mouseY >= btnY - btnH / 2 && mouseY <= btnY + btnH / 2) {
            randomColor();
            return false;
        }
    } else {
        // On-screen Pause button
        if (mouseX >= pauseButtonBounds.x && mouseX <= pauseButtonBounds.x + pauseButtonBounds.w &&
            mouseY >= pauseButtonBounds.y && mouseY <= pauseButtonBounds.y + pauseButtonBounds.h) {
            presspause = true;
            return false;
        }
    }
}

function mouseReleased() {
    // Only finish a drag if the editor is on and a drag started
    if (!editor.enabled || !editor.dragStart) return;

    const a = editor.dragStart;
    const b = worldMouse();

    // Convert two corners -> center + size
    const x = (a.x + b.x) / 2;
    const y = (a.y + b.y) / 2;
    const w = Math.abs(b.x - a.x);
    const h = Math.abs(b.y - a.y);

    // ignore tiny drags (prevents accidental clicks)
    const MIN = 2;
    if (w < MIN || h < MIN) {
        editor.dragStart = null;
        return;
    }

    let placed = false;

    // Ground
    if (editor.tool === 'ground') {
        (levels[currentLevel].ground ||= []).push({ x, y, w, h });
        placed = true;
    }

    // Platform
    else if (editor.tool === 'platform') {
        (levels[currentLevel].platforms ||= []).push({
            x, y, w, h,
            color: 'orange',
            moving: false
        });
        placed = true;
    }

    // Spring
    else if (editor.tool === 'spring') {
        (levels[currentLevel].springs ||= []).push({ x, y, w, h });
        placed = true;
    }

    // Teleporter
    else if (editor.tool === 'teleporter') {
        (levels[currentLevel].teleporter ||= []).push({ x, y, w, h });
        placed = true;
    }

    // Disappearing Platform
    else if (editor.tool === 'disappearingPlatform') {
        (levels[currentLevel].disappearingPlatforms ||= []).push({ x, y, w, h });
        placed = true;
    }

    // For non-rectangle tools (spike, checkpoint, goal, laser, enemy, swingingHammer),
    // placement happens on mousePressed()

    editor.dragStart = null;

    // Rebuild sprites
    if (placed) {
        loadLevel(currentLevel);
    }
}

// Mouse for Level
function worldMouse() {
    const wx = mouseX + camera.x - halfWidth;
    const wy = mouseY + camera.y - halfHeight;
    // snap to grid
    const g = editor.grid;
    return { x: Math.round(wx / g) * g, y: Math.round(wy / g) * g };
}

function EditorMode() {
    // freeze physics/state
    levelObjects.platforms?.forEach(p => { p.physics = STATIC; });

    if (ball) {
        ball.physics = NONE;
        ball.vel.x = 0; ball.vel.y = 0;
        ball.rotationSpeed = 0; ball.angularVelocity = 0;
    }

    // repaint world so edits show immediately
    drawBackgroundForLevel();
    if (typeof drawOptimizedTiles === 'function') {
        drawOptimizedTiles();
    }
    if (typeof allSprites !== 'undefined') allSprites.draw();

    // ===== EDITOR MODE (separate from Pause): freeze + repaint + banner, then return =====

    // editor UI
    drawEditorBanner();

    // --- editor hotkeys: tool switching + rotate + delete + save ---
    // cycle tools: 1 = previous, 2 = next
    if (kb.pressed('1')) {
        editor.toolIndex = (editor.toolIndex - 1 + TOOL_LIST.length) % TOOL_LIST.length;
        editor.tool = TOOL_LIST[editor.toolIndex];
    }
    if (kb.pressed('2')) {
        editor.toolIndex = (editor.toolIndex + 1) % TOOL_LIST.length;
        editor.tool = TOOL_LIST[editor.toolIndex];
    }

    // rotate spike orientation (unchanged)
    if (kb.pressed('r')) {
        const dirs = ['up', 'right', 'down', 'left'];
        if (editor.tool === 'spike') {
            editor.spikeDir = dirs[(dirs.indexOf(editor.spikeDir) + 1) % dirs.length];
        } else if (editor.tool === 'laser') {
            editor.laserDir = dirs[(dirs.indexOf(editor.laserDir) + 1) % dirs.length];
        }
    }

    // Delete nearest of active tool
    if (editor.enabled && (kb.pressed('delete') || kb.pressed('backspace'))) {
        const p = worldMouseRaw();
        let key = null;

        if (editor.tool === 'ground') key = 'ground';
        else if (editor.tool === 'platform') key = 'platforms';
        else if (editor.tool === 'spring') key = 'springs';
        else if (editor.tool === 'spike') key = 'spikes';
        else if (editor.tool === 'checkpoint') key = 'checkpoints';
        else if (editor.tool === 'goal') {
            levels[currentLevel].goalPosition = null;
            loadLevel(currentLevel);
            return; // early exit after removing goal
        }
        else if (editor.tool === 'enemy') key = 'enemies';
        else if (editor.tool === 'teleporter') key = 'teleporter';
        else if (editor.tool === 'laser') key = 'lasers';
        else if (editor.tool === 'disappearingPlatform') key = 'disappearingPlatforms';
        else if (editor.tool === 'swingingHammer') key = 'swingingHammers';

        if (!key) return;

        const dataArr = levels[currentLevel][key] || [];
        if (!dataArr.length) return;

        // Prefer sprite positions when available
        const spriteArr =
            key === 'ground' ? levelObjects.ground :
            key === 'platforms' ? levelObjects.platforms :
            key === 'springs' ? levelObjects.springs :
            key === 'spikes' ? levelObjects.spikes :
            key === 'checkpoints' ? levelObjects.checkpoints :
            key === 'enemies' ? levelObjects.enemies :
            key === 'teleporter' ? levelObjects.teleporter :
            key === 'lasers' ? levelObjects.laserBlasters :
            key === 'asteriods' ? levelObjects.asteriodFields :
            key === 'disappearingPlatforms' ? levelObjects.disappearingPlatforms :
            key === 'swingingHammers' ? levelObjects.swingingHammers :
            null;

        let idx = -1, best = 1e9;

        if (spriteArr && spriteArr.length) {
            // pick by sprite centers
            for (let i = 0; i < spriteArr.length; i++) {
                const s = spriteArr[i];
                const d = dist(p.x, p.y, s.x, s.y);
                if (d < best) { best = d; idx = i; }
            }
        } else {
            // fallback: pick by data center
            for (let i = 0; i < dataArr.length; i++) {
                const it = dataArr[i];
                const cx = it.x ?? it.startX ?? it.pivotX ?? 0;
                const cy = it.y ?? it.startY ?? it.pivotY ?? 0;
                const d = dist(p.x, p.y, cx, cy);
                if (d < best) { best = d; idx = i; }
            }
        }

        if (idx >= 0 && best < PICK_RADIUS) {
            dataArr.splice(idx, 1);
            loadLevel(currentLevel);
        }
    }

    // Save current level JSON
    if (kb.pressed('s')) {
        if (typeof saveJSON === 'function') saveJSON(levels[currentLevel], `level-${currentLevel}.json`);
        else {
            const txt = JSON.stringify(levels[currentLevel], null, 2);
            navigator.clipboard?.writeText(txt);
            alert('Level JSON copied to clipboard');
        }
    }


    // restart level ONLY when not editing and not paused
    if (!editor.enabled && !gameHandler.isPaused() && kb.pressed('r')) {
        loadLevel(currentLevel);
    }
}

// Only for Node-based unit tests
if (typeof module !== 'undefined') {
    module.exports = {
        editor,
        TOOL_LIST,
        PICK_RADIUS,
        drawEditorBanner,
        worldMouseRaw,
        worldMouse,
        mousePressed,
        mouseReleased,
        EditorMode
    };
}