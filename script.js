// ═══════════════════════════════════════════════════════════
//  NUMBER QUEST — script.js
//  CS++ JavaScript Guessing Game Capstone
// ═══════════════════════════════════════════════════════════

// ── Player name (prompt on load, capitalize correctly) ──────
var rawName = prompt("Welcome to Number Quest! What is your name?") || "Player";
var playerName = rawName.charAt(0).toUpperCase() + rawName.slice(1).toLowerCase();

// ── Game state ───────────────────────────────────────────────
var answer = 0;
var range = 10;
var guessCount = 0;
var roundActive = false;

// ── Stats ────────────────────────────────────────────────────
var totalWins = 0;
var totalGuesses = 0;       // sum of winning guess counts (for avgScore)
var allScores = [];         // every game score (wins + give ups)
var roundStartTime = 0;
var allTimes = [];          // elapsed ms for every completed round
var winStreak = 0;

// ── Month / suffix helpers ───────────────────────────────────
var MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

function getDaySuffix(d) {
  if (d >= 11 && d <= 13) return "th";   // special cases
  switch (d % 10) {
    case 1: return "st";
    case 2: return "nd";
    case 3: return "rd";
    default: return "th";
  }
}

// ═══════════════════════════════════════════════════════════
//  time() — returns formatted date+time string
// ═══════════════════════════════════════════════════════════
function time() {
  var now = new Date();
  var month = MONTHS[now.getMonth()];
  var day   = now.getDate();
  var suffix = getDaySuffix(day);
  var year  = now.getFullYear();

  var hours   = now.getHours();
  var minutes = now.getMinutes();
  var seconds = now.getSeconds();
  var ampm    = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;

  var mm = minutes < 10 ? "0" + minutes : "" + minutes;
  var ss = seconds < 10 ? "0" + seconds : "" + seconds;

  return month + " " + day + suffix + ", " + year + "  •  " + hours + ":" + mm + ":" + ss + " " + ampm;
}

// Start the live clock
setInterval(function() {
  document.getElementById("date").textContent = time();
}, 1000);
document.getElementById("date").textContent = time();   // show immediately

// ═══════════════════════════════════════════════════════════
//  play() — start a new round
// ═══════════════════════════════════════════════════════════
function play() {
  // Get selected difficulty
  var radios = document.getElementsByName("level");
  range = 10;
  for (var i = 0; i < radios.length; i++) {
    if (radios[i].checked) {
      range = parseInt(radios[i].value);
      break;
    }
  }

  // Generate random answer exactly as spec requires
  answer = Math.floor(Math.random() * range) + 1;
  guessCount = 0;
  roundActive = true;
  roundStartTime = new Date().getTime();

  // Update UI
  document.getElementById("msg").textContent =
    playerName + ", guess a number between 1 and " + range + "!";
  document.getElementById("guess").disabled = false;
  document.getElementById("guess").value = "";
  document.getElementById("guessBtn").disabled = false;
  document.getElementById("giveUpBtn").disabled = false;
  document.getElementById("playBtn").disabled = true;

  // Disable difficulty radios during round
  for (var j = 0; j < radios.length; j++) {
    radios[j].disabled = true;
  }

  // Reset proximity display
  setProximity(null);
}

// ═══════════════════════════════════════════════════════════
//  makeGuess() — handle a submitted guess
// ═══════════════════════════════════════════════════════════
function makeGuess() {
  if (!roundActive) return;

  var guessInput = document.getElementById("guess");
  var guess = parseInt(guessInput.value);

  // Input validation (Above & Beyond)
  if (isNaN(guess) || guess < 1 || guess > range) {
    document.getElementById("msg").textContent =
      playerName + ", please enter a valid number between 1 and " + range + ".";
    return;
  }

  guessCount++;
  var diff = Math.abs(guess - answer);

  if (guess === answer) {
    // ── CORRECT ─────────────────────────────────────────────
    document.getElementById("msg").textContent =
      "🎉 Correct, " + playerName + "! The number was " + answer +
      ". You got it in " + guessCount + " guess" + (guessCount === 1 ? "" : "es") + "!";
    document.getElementById("guessBtn").disabled = true;
    roundActive = false;
    winStreak++;
    totalWins++;
    totalGuesses += guessCount;
    updateScore(guessCount);
    updateTimers(new Date().getTime());
    reset();
    setProximity(0);

  } else if (guess > answer) {
    // ── TOO HIGH ─────────────────────────────────────────────
    var highMsg = playerName + ", too high! " + getProximityWord(diff);
    document.getElementById("msg").textContent = highMsg;
    setProximity(diff);

  } else {
    // ── TOO LOW ──────────────────────────────────────────────
    var lowMsg = playerName + ", too low! " + getProximityWord(diff);
    document.getElementById("msg").textContent = lowMsg;
    setProximity(diff);
  }

  guessInput.value = "";
  guessInput.focus();
  updateStreakDisplay();
}

// ── Proximity word helper ─────────────────────────────────
function getProximityWord(diff) {
  if (diff <= 2) return "You are HOT! 🔥";
  if (diff <= 5) return "You are WARM! 🌡️";
  return "You are COLD! ❄️";
}

// ── Visual proximity bar (Above & Beyond) ────────────────
function setProximity(diff) {
  var fill = document.getElementById("proxFill");
  var hint = document.getElementById("proxHint");

  if (diff === null) {
    fill.style.width = "0%";
    fill.className = "prox-fill";
    hint.textContent = "—";
    return;
  }
  if (diff === 0) {
    fill.style.width = "100%";
    fill.className = "prox-fill prox-correct";
    hint.textContent = "✓ CORRECT";
    return;
  }

  var pct = Math.max(0, Math.min(100, 100 - Math.floor((diff / range) * 100)));
  fill.style.width = pct + "%";

  if (diff <= 2) {
    fill.className = "prox-fill prox-hot";
    hint.textContent = "HOT 🔥";
  } else if (diff <= 5) {
    fill.className = "prox-fill prox-warm";
    hint.textContent = "WARM 🌡️";
  } else {
    fill.className = "prox-fill prox-cold";
    hint.textContent = "COLD ❄️";
  }
}

// ═══════════════════════════════════════════════════════════
//  updateScore(score) — update wins, avgScore, leaderboard
// ═══════════════════════════════════════════════════════════
function updateScore(score) {
  allScores.push(score);
  allScores.sort(function(a, b) { return a - b; });

  // Update wins display
  document.getElementById("wins").textContent = totalWins;

  // Update average score (only winning rounds contribute to totalGuesses)
  if (totalWins > 0) {
    var avg = totalGuesses / totalWins;
    document.getElementById("avgScore").textContent = avg.toFixed(1);
  }

  // Leaderboard — top 3 scores
  var items = document.getElementsByName("leaderboard");
  for (var i = 0; i < items.length; i++) {
    if (allScores[i] !== undefined) {
      items[i].textContent = allScores[i];
    } else {
      items[i].textContent = "--";
    }
  }
}

// ═══════════════════════════════════════════════════════════
//  updateTimers(endMs) — update fastest and average time
// ═══════════════════════════════════════════════════════════
function updateTimers(endMs) {
  var elapsed = endMs - roundStartTime;
  allTimes.push(elapsed);

  // Fastest (minimum)
  var fastest = allTimes[0];
  for (var i = 1; i < allTimes.length; i++) {
    if (allTimes[i] < fastest) fastest = allTimes[i];
  }
  document.getElementById("fastest").textContent = (fastest / 1000).toFixed(2) + "s";

  // Average time
  var sumTime = 0;
  for (var j = 0; j < allTimes.length; j++) {
    sumTime += allTimes[j];
  }
  var avgTime = sumTime / allTimes.length;
  document.getElementById("avgTime").textContent = (avgTime / 1000).toFixed(2) + "s";
}

// ═══════════════════════════════════════════════════════════
//  reset() — re-enable controls for next round
// ═══════════════════════════════════════════════════════════
function reset() {
  document.getElementById("playBtn").disabled = false;
  document.getElementById("guess").disabled = true;
  document.getElementById("guess").value = "";
  document.getElementById("guessBtn").disabled = true;
  document.getElementById("giveUpBtn").disabled = true;

  var radios = document.getElementsByName("level");
  for (var i = 0; i < radios.length; i++) {
    radios[i].disabled = false;
  }
}

// ═══════════════════════════════════════════════════════════
//  giveUp() — end round, score = range value
// ═══════════════════════════════════════════════════════════
function giveUp() {
  if (!roundActive) return;
  roundActive = false;
  winStreak = 0;

  var score = range;   // penalty score = range
  // Give up does NOT count as a win, but still goes to leaderboard and timers
  allScores.push(score);
  allScores.sort(function(a, b) { return a - b; });

  document.getElementById("msg").textContent =
    playerName + " gave up! The answer was " + answer +
    ". Score recorded as " + score + ".";

  // Update leaderboard
  var items = document.getElementsByName("leaderboard");
  for (var i = 0; i < items.length; i++) {
    if (allScores[i] !== undefined) {
      items[i].textContent = allScores[i];
    } else {
      items[i].textContent = "--";
    }
  }

  updateTimers(new Date().getTime());
  setProximity(null);
  updateStreakDisplay();
  reset();
}

// ── Win streak display (Above & Beyond) ──────────────────
function updateStreakDisplay() {
  document.getElementById("streakVal").textContent = winStreak;
}

// ═══════════════════════════════════════════════════════════
//  EVENT LISTENERS  (no onclick attributes in HTML)
// ═══════════════════════════════════════════════════════════
document.getElementById("playBtn").addEventListener("click", play);
document.getElementById("guessBtn").addEventListener("click", makeGuess);
document.getElementById("giveUpBtn").addEventListener("click", giveUp);

// ── Keyboard support: Enter key submits guess (Above & Beyond)
document.getElementById("guess").addEventListener("keydown", function(e) {
  if (e.key === "Enter") makeGuess();
});