<template>
  <div>
    <!-- Background stars -->
    <div
      v-for="s in bgStars" :key="'b' + s.id"
      class="bg-star"
      :style="{
        left: s.x + 'px', top: s.y + 'px',
        width: s.w + 'px', height: s.w + 'px',
        '--op': s.op,
        '--fall-dur': s['fall-dur'], '--fall-del': s['fall-del'],
        '--tw-dur':   s['tw-dur'],   '--tw-del':   s['tw-del'],
      }"
    ></div>

    <!-- Initial Loading -->
    <div v-if="loading" class="loading-screen">
      <div class="loading-text">LOADING...</div>
      <div class="loading-dots">
        <span v-for="n in 3" :key="n" class="dot">★</span>
      </div>
    </div>

    <!-- Submit Loading：流星畫面 -->
    <div v-if="submitting" class="submit-overlay">
      <div
        v-for="s in shootingStars" :key="s.id"
        class="falling-star"
        :style="{
          left:      s.left + '%',
          fontSize:  s.size + 'px',
          color:     s.color,
          '--dur':   s.dur  + 's',
          '--del':   s.del  + 's',
          '--op':    s.op,
        }"
      >★</div>
      <div class="submit-text">
        <div class="submit-label">SENDING...</div>
        <div class="submit-stars">
          <span v-for="n in 3" :key="n" class="s-dot">★</span>
        </div>
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="error-toast">{{ error }}</div>

    <!-- Toast -->
    <div v-if="toast" class="toast">{{ toast }}</div>

    <!-- Particles -->
    <div
      v-for="p in particles" :key="'p' + p.id"
      class="particle"
      :style="{ left: p.x + 'px', top: p.y + 'px', fontSize: p.sz + 'px', '--dur': p.dur + 's', '--del': p.del + 's' }"
    >{{ p.ch }}</div>

    <!-- Pages -->
    <template v-if="!loading">
      <FormPage v-if="page === 'form'" @submit="handleFormSubmit" @view="handleViewBottle" />
      <BottlePage
        v-if="page === 'bottle'"
        :active-dept="activeDept"
        :goal-count="goalCount"
        :current-count="currentCount"
        @back="page = 'form'"
        @switch-dept="switchDept"
      />
    </template>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import FormPage   from './components/FormPage.vue'
import BottlePage from './components/BottlePage.vue'
import { useBgStars }       from './composables/useBgStars.js'
import { GOALS, computeTotal } from './data/mockData.js'
import { fetchSubmissions, postSubmission } from './utils/api.js'

/* ── Background stars ──────────────────────────────────────────── */
const { bgStars } = useBgStars(280)

/* ── Page routing ──────────────────────────────────────────────── */
const page    = ref('form')
const loading    = ref(true)
const submitting = ref(false)
const error      = ref('')

// 生成墜落星星資料
const STAR_COLORS = ['#ffde4d', '#4deeea', '#FF8080', '#ffffff', '#ffde4d']
const shootingStars = Array.from({ length: 60 }, (_, i) => ({
  id:   i,
  left: Math.random() * 100,
  size: 10 + Math.random() * 22,
  dur:  1.5 + Math.random() * 2.5,
  del:  -(Math.random() * 3),
  color: STAR_COLORS[i % 5],
  op:  0.5 + Math.random() * 0.5,
}))

/* ── Bottle state ──────────────────────────────────────────────── */
const activeDept   = ref('junior')
const goalCount    = ref(GOALS.junior)
const submissions  = ref([])
const currentCount = ref(0)

/* ── 載入資料 ──────────────────────────────────────────────────── */
onMounted(async () => {
  try {
    submissions.value  = await fetchSubmissions()
    currentCount.value = computeTotal('junior', submissions.value)
  } catch (e) {
    error.value = '⚠ 無法載入資料，請確認網路連線'
  } finally {
    loading.value = false
  }
})

function switchDept(dept) {
  activeDept.value   = dept
  goalCount.value    = GOALS[dept]
  currentCount.value = computeTotal(dept, submissions.value)
}

async function handleFormSubmit(entry) {
  submitting.value = true
  try {
    await postSubmission(entry)
  } catch (e) {
    console.warn('API 寫入失敗，保留本地資料', e)
  } finally {
    submitting.value = false
  }
  submissions.value.push(entry)
  const dept = entry.identity
  activeDept.value   = dept
  goalCount.value    = GOALS[dept]
  currentCount.value = computeTotal(dept, submissions.value)
  page.value         = 'bottle'
}

function handleViewBottle(dept) {
  activeDept.value   = dept
  goalCount.value    = GOALS[dept]
  currentCount.value = computeTotal(dept, submissions.value)
  page.value         = 'bottle'
}

/* ── Toast & particles ─────────────────────────────────────────── */
const toast     = ref('')
const particles = ref([])
let toastTimer  = null
let pid         = 0

function showToast(msg) {
  toast.value = msg
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toast.value = '' }, 3500)
}

function boom() {
  const chs = ['✦', '★', '✨', '⭐', '💫']
  for (let i = 0; i < 22; i++) {
    setTimeout(() => {
      particles.value.push({
        id:  pid++,
        ch:  chs[Math.floor(Math.random() * 5)],
        x:   40 + Math.random() * (window.innerWidth - 80),
        y:   -20,
        sz:  12 + Math.random() * 16,
        dur: (2.2 + Math.random() * 2.8).toFixed(1),
        del: (Math.random() * 1.5).toFixed(1),
      })
      if (particles.value.length > 55) particles.value.splice(0, 8)
    }, i * 80)
  }
}

// Milestone toasts
watch(currentCount, (n) => {
  const pct = Math.round(n / goalCount.value * 100)
  const MS  = { 25: '🌟 已達成 25%！繼續加油！', 50: '⭐ 太棒了！完成一半！', 75: '✨ 快到了！最後衝刺！', 100: '🎉 達標！南無妙法蓮華經！' }
  for (const [m, msg] of Object.entries(MS)) {
    if (pct >= +m) { showToast(msg); if (+m === 100) boom(); break }
  }
})
</script>

<style scoped>
.loading-screen {
  position: fixed; inset: 0; z-index: 10;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 20px;
}
.loading-text {
  font-family: 'Press Start 2P', monospace;
  font-size: clamp(14px, 3vw, 22px);
  color: #FFD700;
  text-shadow: 3px 3px 0 #aa7700;
  animation: loadPulse 1s step-end infinite;
}
@keyframes loadPulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
.loading-dots { display: flex; gap: 12px; }
.loading-dots .dot {
  font-size: 20px;
  animation: dotBounce 1.2s ease-in-out infinite;
}
.loading-dots .dot:nth-child(1) { color: #ffde4d; animation-delay: 0s; }
.loading-dots .dot:nth-child(2) { color: #4deeea; animation-delay: .2s; }
.loading-dots .dot:nth-child(3) { color: #FF8080; animation-delay: .4s; }
@keyframes dotBounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }

/* ── 星星墜落送出畫面 ── */
.submit-overlay {
  position: fixed; inset: 0; z-index: 50;
  background: rgba(8, 8, 28, 0.95);
  overflow: hidden;
  display: flex; align-items: center; justify-content: center;
}
.falling-star {
  position: absolute;
  top: -40px;
  user-select: none;
  pointer-events: none;
  animation: fallDown var(--dur) ease-in infinite var(--del),
             twinkle  calc(var(--dur) * 0.4) ease-in-out infinite var(--del);
  filter: drop-shadow(0 0 6px currentColor);
}
@keyframes fallDown {
  0%   { top: -40px;   opacity: 0; }
  10%  { opacity: var(--op); }
  85%  { opacity: var(--op); }
  100% { top: 110vh;   opacity: 0; }
}
@keyframes twinkle {
  0%,100% { filter: drop-shadow(0 0 4px currentColor) brightness(1); }
  50%     { filter: drop-shadow(0 0 14px currentColor) brightness(1.8); }
}
.submit-text {
  position: relative; z-index: 2;
  display: flex; flex-direction: column; align-items: center; gap: 16px;
}
.submit-label {
  font-family: 'Press Start 2P', monospace;
  font-size: clamp(16px, 3vw, 24px);
  color: #FFD700;
  text-shadow: 3px 3px 0 #aa7700, 0 0 20px rgba(255,215,0,0.6);
  animation: loadPulse 1s step-end infinite;
}
.submit-stars { display: flex; gap: 14px; }
.s-dot {
  font-size: 24px;
  animation: dotBounce 1.2s ease-in-out infinite;
}
.s-dot:nth-child(1) { color: #ffde4d; animation-delay: 0s;   }
.s-dot:nth-child(2) { color: #4deeea; animation-delay: .2s;  }
.s-dot:nth-child(3) { color: #FF8080; animation-delay: .4s;  }

.error-toast {
  position: fixed; top: 16px; left: 50%; transform: translateX(-50%);
  font-family: 'Press Start 2P', monospace; font-size: 11px;
  background: #2a0808; border: 3px solid #ff4444; color: #ff8888;
  padding: 10px 20px; z-index: 200;
  box-shadow: 4px 4px 0 #000;
}
</style>
