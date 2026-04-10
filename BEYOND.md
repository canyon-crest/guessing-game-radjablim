# Above and Beyond — Number Quest

## Extra Features

### 1. Visual Proximity Bar
**Where:** `setProximity(diff)` function in `script.js`, `#proximityBar` in `index.html`, `.proximity-bar` / `.prox-*` rules in `style.css`

A color-coded horizontal bar updates after every guess to show how close the player is. It animates smoothly from cold (blue) → warm (yellow) → hot (orange) → correct (green). The bar width is proportional to `(1 - diff/range)`, giving a true visual sense of closeness — not just a word label.

---

### 2. Win Streak Tracker
**Where:** `winStreak` variable and `updateStreakDisplay()` in `script.js`; `#streakBlock` / `#streakVal` in `index.html`

Tracks consecutive wins without giving up. Resets to 0 on any Give Up. Displayed as a large glowing number in the stats panel, encouraging players to keep winning.

---

### 3. Enter Key to Submit Guess
**Where:** Bottom of `script.js` — `keydown` event listener on `#guess`

```js
document.getElementById("guess").addEventListener("keydown", function(e) {
  if (e.key === "Enter") makeGuess();
});
```

Players can press **Enter** instead of clicking the Submit button, making the game faster and more natural to play.

---

### 4. Input Validation with Friendly Message
**Where:** Top of `makeGuess()` in `script.js`

If the player types a number outside the valid range (e.g., 0, -5, or 200 on Medium) or leaves the field empty, the game shows a clear error message using the player's name and the valid range — instead of silently accepting an invalid guess or crashing.

---

### 5. Retro Arcade Cabinet Visual Design
**Where:** `style.css` entirely

The full UI is styled as a retro arcade game:
- **Press Start 2P** pixel font for labels and headings
- **Share Tech Mono** for live data values
- Neon cyan / pink / green / yellow color palette with CSS `text-shadow` glow effects
- Animated CRT scanlines overlay (`repeating-linear-gradient` fixed overlay)
- Dark panels with subtle inner gradients and glowing borders
- Neon-glow buttons with hover and active states
- Smooth CSS transitions on the proximity bar, button interactions, and border highlights

The design gives the game a distinctive identity while keeping all required elements fully functional and readable.