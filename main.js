const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const center = { x: 300, y: 300 };
const radius = 200;
let bpm = 30;
let markers = [];
let indicatorAngle = 0;
let lastTimestamp = 0;
let combo = 0, score = 0;

// Example marker pattern
for (let i = 0; i < 8; i++) {
    markers.push({ angle: (i * 45) % 360, hit: false });
}

// Animation loop
function draw(ts) {
    ctx.clearRect(0, 0, 600, 600);

    // Draw central circle
    ctx.strokeStyle = "#2828ff";
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.arc(center.x, center.y, radius, 0, Math.PI * 2);
    ctx.stroke();

    // Draw markers
    markers.forEach(marker => {
        ctx.save();
        ctx.translate(center.x, center.y);
        ctx.rotate((marker.angle - 90) * Math.PI / 180);
        ctx.fillStyle = marker.hit ? "#44ff44" : "#ff2bcb";
        ctx.beginPath();
        ctx.arc(0, -radius, 20, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    });

    // Draw indicator
    ctx.save();
    ctx.translate(center.x, center.y);
    ctx.rotate((indicatorAngle - 90) * Math.PI / 180);
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -radius);
    ctx.stroke();
    ctx.restore();

    // UI: Combo/Score
    ctx.fillStyle = "#fff";
    ctx.font = "24px monospace";
    ctx.fillText(`Combo: ${combo}   Score: ${score}`, 20, 40);

    // Rotate indicator
    if (lastTimestamp) {
        let delta = (ts - lastTimestamp) / 1000;
        indicatorAngle += (360 * bpm / 60) * delta;
        indicatorAngle = indicatorAngle % 360;
    }
    lastTimestamp = ts;

    requestAnimationFrame(draw);
}
requestAnimationFrame(draw);

// Input handler
canvas.addEventListener('mousedown', tryHit);
canvas.addEventListener('touchstart', e => { tryHit(); e.preventDefault(); });

function tryHit() {
    let hit = false;
    markers.forEach(marker => {
        if (!marker.hit) {
            let diff = Math.abs(((indicatorAngle - marker.angle + 540) % 360) - 180);
            if (diff < 10) { // perfect
                marker.hit = true; score += 100; combo++;
                hit = true;
            } else if (diff < 25) { // good
                marker.hit = true; score += 50; combo++;
                hit = true;
            }
        }
    });
    if (!hit) combo = 0;
}