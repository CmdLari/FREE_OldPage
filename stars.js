const canvas = document.getElementById("stars-canvas");
const ctx = canvas.getContext("2d");

let w, h;
function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

const particles = [];
const COUNT = 90;

const STAR_COLOR = { r: 255, g: 245, b: 210 }; // #fff5d2

function makeParticle() {
  const big = Math.random() < 0.18;        // some larger stars
  const solid = Math.random() < 0.55;      // more bright ones

  const size = big
    ? 10 + Math.random() * 8
    : 3 + Math.random() * 6;

  return {
    x: Math.random() * w,
    y: Math.random() * h,

    // Upward drift + slight horizontal sway
    vx: (-0.2 + Math.random() * 0.4),
    vy: 0.6 + Math.random() * 1.4, // upward speed

    size,

    rot: Math.random() * Math.PI * 2,
    spin: (-0.02 + Math.random() * 0.04),

    wobble: Math.random() * 10,
    wobbleSpeed: 0.02 + Math.random() * 0.05,

    alpha: solid
      ? 0.85 + Math.random() * 0.12
      : 0.25 + Math.random() * 0.25,

    tw: Math.random() * 10,          // twinkle phase
    twSpeed: 0.02 + Math.random() * 0.05
  };
}

for (let i = 0; i < COUNT; i++) particles.push(makeParticle());

// 5-point star path
function starPath(ctx, outerR, innerR) {
  const spikes = 5;
  let rot = -Math.PI / 2;
  const step = Math.PI / spikes;

  ctx.beginPath();
  ctx.moveTo(Math.cos(rot) * outerR, Math.sin(rot) * outerR);
  for (let i = 0; i < spikes; i++) {
    rot += step;
    ctx.lineTo(Math.cos(rot) * innerR, Math.sin(rot) * innerR);
    rot += step;
    ctx.lineTo(Math.cos(rot) * outerR, Math.sin(rot) * outerR);
  }
  ctx.closePath();
}

function drawStar(ctx, x, y, size, rot, alpha, twinkle) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);

  const a = Math.max(0, Math.min(1, alpha * twinkle));

  // Soft glow
  ctx.shadowColor = `rgba(${STAR_COLOR.r},${STAR_COLOR.g},${STAR_COLOR.b},${0.9 * a})`;
  ctx.shadowBlur = size * 1.1;

  ctx.fillStyle = `rgba(${STAR_COLOR.r},${STAR_COLOR.g},${STAR_COLOR.b},${a})`;

  const outer = size;
  const inner = size * 0.45;

  starPath(ctx, outer, inner);
  ctx.fill();

  ctx.restore();
}

let t = 0;

function update() {
  ctx.clearRect(0, 0, w, h);

  // Gentle "air current" changes
  t += 0.01;
  const drift = Math.sin(t) * 0.35;

  for (const p of particles) {
    // Twinkle
    p.tw += p.twSpeed;
    const twinkle = 0.75 + (Math.sin(p.tw) * 0.25);

    // Motion (upwards)
    p.y -= p.vy;
    p.x += p.vx + drift * 0.25;

    // Float wobble + rotation
    p.rot += p.spin;
    p.wobble += p.wobbleSpeed;
    p.x += Math.sin(p.wobble) * 0.35;

    // Respawn at bottom when leaving the top (or sides)
    if (p.y < -30 || p.x < -40 || p.x > w + 40) {
      Object.assign(p, makeParticle(), {
        x: Math.random() * w,
        y: h + 30
      });
    }

    drawStar(ctx, p.x, p.y, p.size, p.rot, p.alpha, twinkle);
  }

  requestAnimationFrame(update);
}

update();
