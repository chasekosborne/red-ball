const ShrinkPad = (function () {
  "use strict";

  // --- Tunables (module-local) ---
  const SMALL_SCALE = 0.65;   // player scale when "Small" (relative to baseScale)
  const GRACE_MS    = 600;    // ignore pads for this long after each level load
  const COOLDOWN_MS = 750;    // per-pad cooldown after a toggle
  const DEFAULT_R   = 40;     // fallback trigger radius if pad.__triggerR is unset

  // --- Module state (hidden) ---
  let touching = new Set();   // pad ids currently touched (for edge-trigger)
  let readyAt  = 0;           // millis timestamp when pads become active again

  // Unique id for each pad (stored on the pad instance)
  function _id(pad) {
    if (!window.__shrinkPadSeq) window.__shrinkPadSeq = 1;
    if (pad.__sid == null) pad.__sid = window.__shrinkPadSeq++;
    return pad.__sid;
  }

  function _now() {
    return (typeof millis === "function") ? millis() : performance.now();
  }

  function _ensurePlayerInit(ball) {
    if (!ball) return;
    if (ball.baseScale == null) ball.baseScale = 1;
    if (!ball.sizeState) {
      ball.sizeState = "Normal";
      ball.scale = ball.baseScale;
    }
  }

  // --- reset per level ---
  function reset(ball) {
    // reset player size each level
    if (ball) {
      if (ball.baseScale == null) ball.baseScale = 1;
      ball.sizeState = "Normal";
      ball.scale = ball.baseScale;
    }
    // reset module state
    touching = new Set();
    readyAt  = _now() + GRACE_MS;
  }

  // --- update each frame during gameplay ---
  function update(ball, pads) {
    if (!ball || !pads || !pads.length) return;

    // Optional: ignore pads entirely while in God Mode
    if (typeof godMode !== "undefined" && godMode) return;

    const now = _now();
    if (now < readyAt) return;

    for (let i = 0; i < pads.length; i++) {
      const pad = pads[i];
      const pid = _id(pad);

      // Tight, image-independent hitbox (small circle centered on the pad)
      const r  = (pad.__triggerR != null ? pad.__triggerR : DEFAULT_R);
      const dx = ball.x - pad.x;
      const dy = ball.y - pad.y;
      const isTouching = (dx * dx + dy * dy) < (r * r);

      const wasTouching = touching.has(pid);
      if (pad.__cooldownUntil == null) pad.__cooldownUntil = 0;

      if (isTouching && !wasTouching && now >= pad.__cooldownUntil) {
        _ensurePlayerInit(ball);

        // Toggle size
        if (ball.sizeState === "Normal") {
          ball.sizeState = "Small";
          ball.scale     = (ball.baseScale || 1) * SMALL_SCALE;
        } else {
          ball.sizeState = "Normal";
          ball.scale     = ball.baseScale || 1;
        }

        // Per-pad cooldown and mark as touching
        pad.__cooldownUntil = now + COOLDOWN_MS;
        touching.add(pid);
      }

      // Edge: left the pad → allow future re-triggers (after cooldown)
      if (!isTouching && wasTouching) {
        touching.delete(pid);
      }
    }
  }

  // Public surface
  return { reset, update };
})();
