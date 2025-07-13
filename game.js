let level = 1;
let progress = 0;
let timer = 30;
let timerInterval = null;

// Difficulty increases each level (e.g., needed taps increases)
function getLevelGoal(level) {
  return 10 + (level - 1) * 5;
}

// Start a new level
function startLevel() {
  document.getElementById('level').textContent = "Level: " + level;
  timer = 30;
  progress = 0;
  updateProgressBar();
  document.getElementById('timer').textContent = `Time: ${timer}s`;

  let goal = getLevelGoal(level);

  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timer--;
    document.getElementById('timer').textContent = `Time: ${timer}s`;
    if (timer <= 0) {
      clearInterval(timerInterval);
      level++;
      startLevel();
    }
  }, 1000);

  // Remove all event listeners first
  let btn = document.getElementById('action-btn');
  let newBtn = btn.cloneNode(true);
  btn.parentNode.replaceChild(newBtn, btn);

  newBtn.onclick = () => {
    progress++;
    updateProgressBar();
    if (progress >= goal) {
      clearInterval(timerInterval);
      level++;
      startLevel();
    }
  };
}

function updateProgressBar() {
  let goal = getLevelGoal(level);
  let percent = Math.min((progress / goal) * 100, 100);
  document.getElementById('progress-bar').style.width = percent + '%';
}

startLevel();