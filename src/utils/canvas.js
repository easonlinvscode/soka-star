/* ══════════════════════════════════════════════════════════════
   Canvas 星星瓶繪製工具
   Canvas 160×240 → 3 層合成：Back / Stars / Front
══════════════════════════════════════════════════════════════ */

export const STAR_COLORS = ['#ffde4d', '#4deeea', '#FF8080']

/* ── Seeded LCG RNG ─────────────────────────────────────────── */
function lcg(seed) {
  let s = seed >>> 0
  return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 0xffffffff }
}

/* ── Pre-generate star positions ────────────────────────────── */
function buildStars() {
  const rng   = lcg(54321)
  const stars = []
  const MIN_D = 9.0
  let tries   = 0

  while (stars.length < 78 && tries < 80000) {
    tries++
    let x, y, r
    const n = stars.length
    if (n < 5) {
      x = 65 + rng() * 26; y = 30 + rng() * 18; r = 1.8 + rng() * 2.2
    } else if (n < 11) {
      x = 54 + rng() * 52; y = 52 + rng() * 40; r = 1.8 + rng() * 2.8
    } else {
      x = 32 + rng() * 96; y = 60 + rng() * 158; r = 2.0 + rng() * 5.5
    }
    if (stars.some(s => Math.hypot(s.x - x, s.y - y) < MIN_D + r * 0.5)) continue
    tries = 0
    stars.push({
      x, y, r,
      color: STAR_COLORS[Math.floor(rng() * 3)],
      phase: rng() * Math.PI * 2,
      speed: 0.55 + rng() * 1.8,
    })
  }
  return stars.sort((a, b) => b.y - a.y)
}

export const ALL_STARS = buildStars()

/* ── Bottle paths ────────────────────────────────────────────── */
function addBottleOuter(ctx) {
  ctx.moveTo(52, 54)
  ctx.bezierCurveTo(36, 62, 24, 76, 24, 92)
  ctx.lineTo(24, 206)
  ctx.bezierCurveTo(24, 224, 36, 232, 54, 232)
  ctx.lineTo(106, 232)
  ctx.bezierCurveTo(124, 232, 136, 224, 136, 206)
  ctx.lineTo(136, 92)
  ctx.bezierCurveTo(136, 76, 124, 62, 108, 54)
  ctx.closePath()
}
function addNeckOuter(ctx) {
  ctx.moveTo(56, 26); ctx.lineTo(104, 26)
  ctx.lineTo(108, 54); ctx.lineTo(52, 54)
  ctx.closePath()
}
function addInterior(ctx) {
  ctx.moveTo(64, 28); ctx.lineTo(96, 28); ctx.lineTo(102, 56)
  ctx.bezierCurveTo(120, 66, 128, 80, 128, 96)
  ctx.lineTo(128, 202)
  ctx.bezierCurveTo(128, 216, 120, 224, 106, 224)
  ctx.lineTo(54, 224)
  ctx.bezierCurveTo(40, 224, 32, 216, 32, 202)
  ctx.lineTo(32, 96)
  ctx.bezierCurveTo(32, 80, 40, 66, 58, 56)
  ctx.closePath()
}
function addCork(ctx) {
  ctx.moveTo(50, 6); ctx.lineTo(110, 6)
  ctx.bezierCurveTo(114, 6, 114, 10, 114, 14)
  ctx.lineTo(114, 24)
  ctx.bezierCurveTo(114, 28, 110, 28, 106, 28)
  ctx.lineTo(54, 28)
  ctx.bezierCurveTo(46, 28, 46, 24, 46, 20)
  ctx.lineTo(46, 14)
  ctx.bezierCurveTo(46, 10, 46, 6, 50, 6)
  ctx.closePath()
}

const pBottleOuter = ctx => { ctx.beginPath(); addBottleOuter(ctx) }
const pNeckOuter   = ctx => { ctx.beginPath(); addNeckOuter(ctx) }
const pInterior    = ctx => { ctx.beginPath(); addInterior(ctx) }
const pCork        = ctx => { ctx.beginPath(); addCork(ctx) }

/* ── Layer 1: Back ───────────────────────────────────────────── */
function drawBack(ctx) {
  ctx.beginPath(); addBottleOuter(ctx); addNeckOuter(ctx)
  ctx.fillStyle = '#1C3A70'; ctx.fill()

  ctx.save()
  ctx.beginPath(); addBottleOuter(ctx); addNeckOuter(ctx); addInterior(ctx)
  ctx.clip('evenodd')
  const gw = ctx.createLinearGradient(20, 0, 140, 0)
  gw.addColorStop(0,    'rgba(130,195,255,0.50)')
  gw.addColorStop(0.18, 'rgba(90,150,230,0.20)')
  gw.addColorStop(0.82, 'rgba(40,80,200,0.10)')
  gw.addColorStop(1,    'rgba(60,100,220,0.42)')
  ctx.fillStyle = gw; ctx.fillRect(20, 20, 124, 220)
  ctx.restore()

  pInterior(ctx); ctx.fillStyle = '#050510'; ctx.fill()
}

/* ── Layer 2: Stars ──────────────────────────────────────────── */
function drawStars(ctx, count, t) {
  ctx.save()
  pInterior(ctx); ctx.clip()

  const n = Math.min(count, ALL_STARS.length)
  for (let i = 0; i < n; i++) {
    const s = ALL_STARS[i]
    const a = 0.38 + 0.62 * Math.abs(Math.sin(t * s.speed + s.phase))

    function starPath(r) {
      ctx.beginPath()
      for (let j = 0; j < 10; j++) {
        const ang = (j * 36 - 90) * Math.PI / 180
        const rad = j % 2 === 0 ? r : r * 0.56
        j === 0
          ? ctx.moveTo(s.x + rad * Math.cos(ang), s.y + rad * Math.sin(ang))
          : ctx.lineTo(s.x + rad * Math.cos(ang), s.y + rad * Math.sin(ang))
      }
      ctx.closePath()
    }

    ctx.save()
    ctx.fillStyle = s.color
    ctx.globalAlpha = a * 0.18; starPath(s.r * 2.2); ctx.fill()
    ctx.globalAlpha = a * 0.45; starPath(s.r * 1.4); ctx.fill()
    ctx.globalAlpha = a;        starPath(s.r);        ctx.fill()
    ctx.globalAlpha = a * 0.70; ctx.fillStyle = '#ffffff'
    ctx.beginPath(); ctx.arc(s.x, s.y, s.r * 0.22, 0, Math.PI * 2); ctx.fill()
    ctx.restore()
  }
  ctx.restore()
}

/* ── Layer 3: Front ──────────────────────────────────────────── */
function drawFront(ctx) {
  // Glass reflections
  ctx.save(); pBottleOuter(ctx); ctx.clip()
  const gh = ctx.createLinearGradient(28, 0, 60, 0)
  gh.addColorStop(0,    'rgba(210,235,255,0.32)')
  gh.addColorStop(0.55, 'rgba(180,220,255,0.13)')
  gh.addColorStop(1,    'rgba(150,200,255,0)')
  ctx.fillStyle = gh; ctx.fillRect(28, 80, 36, 132)
  ctx.fillStyle = 'rgba(230,245,255,0.18)'
  ctx.beginPath(); ctx.ellipse(42, 112, 6, 16, -0.25, 0, Math.PI * 2); ctx.fill()
  ctx.restore()

  ctx.save(); pNeckOuter(ctx); ctx.clip()
  ctx.fillStyle = 'rgba(200,230,255,0.26)'; ctx.fillRect(58, 28, 8, 24)
  ctx.restore()

  // Bottle outlines
  pBottleOuter(ctx); ctx.strokeStyle = '#0A1830'; ctx.lineWidth = 2.8; ctx.stroke()
  pNeckOuter(ctx);   ctx.strokeStyle = '#0A1830'; ctx.lineWidth = 2.4; ctx.stroke()

  // Cork
  pCork(ctx); ctx.fillStyle = '#9A7020'; ctx.fill()
  ctx.strokeStyle = 'rgba(80,50,10,0.55)'; ctx.lineWidth = 1.7
  for (let y = 12; y <= 24; y += 6) {
    ctx.beginPath(); ctx.moveTo(50, y); ctx.lineTo(110, y); ctx.stroke()
  }
  const cg = ctx.createLinearGradient(0, 6, 0, 28)
  cg.addColorStop(0,   'rgba(225,185,80,0.65)')
  cg.addColorStop(0.5, 'rgba(150,110,30,0.10)')
  cg.addColorStop(1,   'rgba(60,40,5,0.30)')
  pCork(ctx); ctx.fillStyle = cg; ctx.fill()
  pCork(ctx); ctx.strokeStyle = '#4A2C08'; ctx.lineWidth = 2.0; ctx.stroke()
  ctx.fillStyle = 'rgba(25,15,5,0.50)'; ctx.fillRect(56, 26, 48, 4)

  // Label tag string
  ctx.strokeStyle = 'rgba(150,115,55,0.75)'; ctx.lineWidth = 1.7
  ctx.beginPath(); ctx.moveTo(104, 44)
  ctx.bezierCurveTo(114, 52, 118, 64, 118, 80); ctx.stroke()

  // Tag paper
  const TX = 104, TY = 80, TW = 52, TH = 38
  ctx.fillStyle = '#D4AA50'; ctx.beginPath(); ctx.rect(TX, TY, TW, TH); ctx.fill()
  ctx.strokeStyle = '#8A6820'; ctx.lineWidth = 1.8; ctx.stroke()
  ctx.strokeStyle = 'rgba(100,70,20,0.45)'; ctx.lineWidth = 1.0
  ctx.beginPath(); ctx.rect(TX + 3, TY + 3, TW - 6, TH - 6); ctx.stroke()
}

/* ── Main render ─────────────────────────────────────────────── */
export function renderFrame(ctx, count, t) {
  ctx.clearRect(0, 0, 160, 240)
  drawBack(ctx)
  drawStars(ctx, count, t)
  drawFront(ctx)
}
