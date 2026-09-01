const canvas = document.getElementById('galton');
const ctx = canvas.getContext('2d');
const W = canvas.width, H = canvas.height;

const rows = 8;
const pegSpacing = 40;
const startX = W / 2;
const startY = 20;
const binCount = rows + 1;
const binWidth = W / binCount;
const binHeights = new Array(binCount).fill(0);
const maxBinHeight = 90;

const balls = [];

function pegPosition(row, col) {
  const x = startX + (col - row / 2) * pegSpacing;
  const y = startY + row * 22;
  return { x, y };
}

function spawnBall() {
  balls.push({ row: 0, col: 0, x: startX, y: startY, path: [] });
}

function stepBall(ball) {
  if (ball.row < rows) {
    const goRight = Math.random() < 0.5;
    ball.row++;
    ball.col += goRight ? 0.5 : -0.5;
    ball.x = startX + (ball.col) * pegSpacing;
    ball.y = startY + ball.row * 22;
  } else {
    const bin = Math.round(ball.col + rows / 2);
    const clampedBin = Math.max(0, Math.min(binCount - 1, bin));
    binHeights[clampedBin] = Math.min(maxBinHeight, binHeights[clampedBin] + 6);
    return true;
  }
  return false;
}

function draw() {
  ctx.clearRect(0, 0, W, H);

  ctx.fillStyle = '#c7ccdb';
  for (let row = 0; row <= rows; row++) {
    for (let col = 0; col <= row; col++) {
      const x = startX + (col - row / 2) * pegSpacing;
      const y = startY + row * 22;
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.fillStyle = '#2d3a8c';
  binHeights.forEach((h, i) => {
    const x = i * binWidth + binWidth * 0.15;
    const w = binWidth * 0.7;
    ctx.fillRect(x, H - h, w, h);
  });

  ctx.fillStyle = '#c0392b';
  balls.forEach(b => {
    ctx.beginPath();
    ctx.arc(b.x, b.y, 3.5, 0, Math.PI * 2);
    ctx.fill();
  });
}

function tick() {
  if (Math.random() < 0.08) spawnBall();

  for (let i = balls.length - 1; i >= 0; i--) {
    const done = stepBall(balls[i]);
    if (done) balls.splice(i, 1);
  }

  draw();
  requestAnimationFrame(loop);
}

let lastStep = 0;
function loop(timestamp) {
  if (timestamp - lastStep > 120) {
    tick();
    lastStep = timestamp;
  } else {
    requestAnimationFrame(loop);
  }
}

setInterval(() => {
  binHeights.fill(0);
}, 8000);

requestAnimationFrame(loop);
