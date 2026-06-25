<template>
  <div class="bottle-page">

    <!-- Title -->
    <div style="text-align:center">
      <div class="b-title">★ 搜集SOKA之星 ★</div>
      <div class="b-sub">2026 桃園西區 暑期活動</div>
    </div>

    <!-- Dept switcher -->
    <div class="dept-bar">
      <button
        v-for="d in deptTabs" :key="d.value"
        class="dept-tab"
        :class="{ active: activeDept === d.value }"
        @click="$emit('switch-dept', d.value)"
      >{{ d.label }}</button>
    </div>

    <!-- Canvas bottle -->
    <div class="bottle-wrap">
      <canvas ref="cvs" width="160" height="240"></canvas>
      <div class="tag-label">{{ deptLabel }}</div>
    </div>

    <!-- Stats -->
    <div class="stats-box">
      <div class="pbar-wrap">
        <div class="pbar-fill" :style="{ width: pct + '%', background: barColor }"></div>
      </div>
      <div class="stat-row">
        <div class="stat-item">
          <div class="stat-label">目標分鐘</div>
          <div class="stat-value goal">{{ fmt(goalCount) }}</div>
        </div>
        <div class="stat-item stat-c">
          <div class="stat-label">目前分鐘</div>
          <div class="stat-value current" :class="{ locked }">{{ fmt(displayCount) }}</div>
          <div class="stat-pct" :class="{ locked }">{{ displayPct }}%</div>
        </div>
        <div class="stat-item stat-r">
          <div class="stat-label">剩餘分鐘</div>
          <div class="stat-value remain" :class="{ locked }">{{ fmt(displayRemaining) }}</div>
        </div>
      </div>
    </div>

    <!-- Back -->
    <button class="back-btn" @click="$emit('back')"><span class="btn-icon">◀</span> BACK TO FORM</button>

  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { ALL_STARS, renderFrame } from '../utils/canvas.js'
import { useCountAnimation } from '../composables/useCountAnimation.js'
import { DEPT_TABS, GOALS } from '../data/mockData.js'

const props = defineProps({
  activeDept:   { type: String, required: true },
  goalCount:    { type: Number, required: true },
  currentCount: { type: Number, required: true },
})
defineEmits(['back', 'switch-dept'])

const deptTabs = DEPT_TABS
const deptLabel = computed(() => ({ junior: '國中', senior: '高中', general: '總務' }[props.activeDept]))

const fmt = n => Number(n || 0).toLocaleString()

/* ── Count animation ─────────────────────────────────────────── */
const currentCountRef = computed(() => props.currentCount)
const goalCountRef    = computed(() => props.goalCount)
const { displayCount, displayRemaining, displayPct, locked, reset } =
  useCountAnimation(currentCountRef, goalCountRef)

// currentCount 或 activeDept 變動時重播動畫（nextTick 確保 props 全數到位）
watch([() => props.activeDept, () => props.currentCount], async () => {
  await nextTick()
  reset()
})

/* ── Progress ────────────────────────────────────────────────── */
const progress = computed(() => Math.min(Math.max(props.currentCount / props.goalCount, 0), 1))
const pct      = computed(() => Math.round(progress.value * 100))
const shown    = computed(() => Math.round(progress.value * ALL_STARS.length))
const barColor = computed(() => {
  const p = progress.value
  if (p < 0.33) return 'linear-gradient(90deg,#FF3333,#FF7733)'
  if (p < 0.66) return 'linear-gradient(90deg,#FF7733,#FFD700)'
  if (p < 1)    return 'linear-gradient(90deg,#FFD700,#4499FF)'
  return 'linear-gradient(90deg,#FF3333,#FFD700,#4499FF,#FF3333)'
})

/* ── Canvas animation ────────────────────────────────────────── */
const cvs   = ref(null)
let animId  = null
let t       = 0

function loop() {
  if (!cvs.value) return
  t += 0.018
  renderFrame(cvs.value.getContext('2d'), shown.value, t)
  animId = requestAnimationFrame(loop)
}
function stopLoop() {
  if (animId) { cancelAnimationFrame(animId); animId = null }
}

onMounted(async () => {
  await nextTick()
  t = 0
  loop()
  reset()
})
onUnmounted(stopLoop)
</script>

<style scoped>
.bottle-page {
  position: relative; z-index: 1;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  min-height: 100vh;
  padding: 12px 14px 28px;
  gap: 10px;
}

/* Dept switcher */
.dept-bar {
  display: flex; gap: 16px;
  width: 100%; max-width: 480px;
}
.dept-tab {
  flex: 1;
  font-family: 'Press Start 2P', monospace;
  font-size: clamp(11px, 2vw, 14px);
  padding: 12px 8px;
  border: 4px solid #94a2f5;
  background: #0e0e2e; color: #6677bb;
  cursor: pointer; letter-spacing: 1px; outline: none;
  text-align: center;
  box-shadow: 4px 4px 0 #6c729f;
}
.dept-tab.active {
  border-color: #FFD700;
  color: #FFD700;
  background: #1e1800;
  box-shadow: 4px 4px 0 #aa7700, 0 0 14px rgba(255,215,0,0.4);
  transform: translate(-1px, -1px);
}
.dept-tab:hover:not(.active) {
  border-color: #ffffff; color: #ffffff;
  background: #181848;
  transform: translate(-1px, -1px);
  box-shadow: 5px 5px 0 #d9dcf7;
}

/* Title */
.b-title { font-size:clamp(24px,5vw,36px); color:#FFD700; text-shadow:3px 3px 0 #aa7700, 6px 6px 0 #553300; text-align:center; letter-spacing:3px; line-height:1.8; }
.b-sub   { font-size:clamp(10px,2vw,15px); color:#aaccff; text-align:center; letter-spacing:2px; opacity:.85; margin-top:4px; }

/* Canvas */
.bottle-wrap {
  position: relative;
  --bh: min(48vh, calc(50vw * 1.5), 420px);
  width: calc(var(--bh) * 80 / 120);
}
canvas {
  image-rendering: pixelated;
  image-rendering: crisp-edges;
  height: var(--bh);
  width: calc(var(--bh) * 80 / 120);
  display: block;
  filter: drop-shadow(0 0 28px rgba(80,140,255,0.55));
}
.tag-label {
  position: absolute;
  left:   calc(var(--bh) / 240 * 104);
  top:    calc(var(--bh) / 240 * 80);
  width:  calc(var(--bh) / 240 * 52);
  height: calc(var(--bh) / 240 * 38);
  display: flex; align-items: center; justify-content: center;
  font-family: "PingFang TC","Noto Sans TC","Microsoft JhengHei",sans-serif;
  font-weight: 700;
  font-size: max(12px, calc(var(--bh) / 240 * 11));
  color: #3A2008;
  pointer-events: none;
  letter-spacing: .05em;
}

/* Stats */
.stats-box {
  width:100%; max-width:480px;
  background:#12123a; border:4px solid #4455aa;
  padding:14px 16px; box-shadow:4px 4px 0 #000, 0 0 16px rgba(68,85,170,0.3);
}
.pbar-wrap {
  width:100%; height:14px;
  background:#0c0c2e; border:3px solid #3344aa;
  overflow:hidden; margin-bottom:14px;
}
.pbar-fill {
  height:100%; transition:width 1s ease;
  position:relative; overflow:hidden;
  animation:breathe 2.4s ease-in-out infinite;
  color:rgba(255,215,0,0.6);
}
.pbar-fill::after {
  content:''; position:absolute; inset:0;
  background:linear-gradient(90deg,transparent,rgba(255,255,255,.35),transparent);
  animation:shim 2.2s linear infinite;
}
@keyframes shim    { from{transform:translateX(-100%)} to{transform:translateX(250%)} }
@keyframes breathe { 0%,100%{box-shadow:0 0 4px 1px currentColor;opacity:1} 50%{box-shadow:0 0 20px 8px currentColor;opacity:.85} }

.stat-row  { display:flex; justify-content:space-between; align-items:flex-start; gap:8px; }
.stat-item { flex:1; }
.stat-c    { text-align:center; }
.stat-r    { text-align:right; }
.stat-label { font-size:12px; color:#7788cc; margin-bottom:6px; }
.stat-value { font-size:clamp(12px,1.4vw,16px); font-family:'Press Start 2P',monospace; }
.stat-value.goal    { color:#4deeea; text-shadow:0 0 8px rgba(77,238,234,0.5); }
.stat-value.current { color:#FFD700; text-shadow:0 0 12px rgba(255,215,0,.6); }
.stat-value.remain  { color:#FF8888; text-shadow:0 0 8px rgba(255,136,136,0.4); }
.stat-pct  { font-size:clamp(12px,1.6vw,18px); color:#FFD700; opacity:.75; margin-top:27px; text-shadow:0 0 8px rgba(255,215,0,0.4); }

@keyframes lockIn {
  0%  {transform:scale(1);   filter:brightness(1)}
  25% {transform:scale(1.15);filter:brightness(2.5)}
  60% {transform:scale(1.05);filter:brightness(1.6)}
  100%{transform:scale(1);   filter:brightness(1)}
}
.stat-value.locked,.stat-pct.locked { animation:lockIn .55s ease-out forwards; }

/* Back button */
.back-btn {
  font-family:'Press Start 2P',monospace;
  font-size:clamp(9px,1.4vw,11px); padding:10px 20px;
  border:3px solid #4455aa; background:#0e0e2e;
  color:#7788cc; cursor:pointer; letter-spacing:1px; box-shadow:3px 3px 0 #000; outline:none;
}
.back-btn:hover { border-color:#4deeea; color:#4deeea; transform:translate(-1px,-1px); box-shadow:4px 4px 0 #000, 0 0 10px rgba(77,238,234,0.3); }

@media (min-width:768px) {
  .bottle-wrap { --bh: min(52vh, 420px); }
}
</style>
