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

    <!-- Toast -->
    <div v-if="toast" class="toast">{{ toast }}</div>

    <!-- Particles -->
    <div
      v-for="p in particles" :key="'p' + p.id"
      class="particle"
      :style="{ left: p.x + 'px', top: p.y + 'px', fontSize: p.sz + 'px', '--dur': p.dur + 's', '--del': p.del + 's' }"
    >{{ p.ch }}</div>

    <!-- Pages -->
    <FormPage v-if="page === 'form'" @submit="handleFormSubmit" @view="handleViewBottle" />
    <BottlePage
      v-if="page === 'bottle'"
      :active-dept="activeDept"
      :goal-count="goalCount"
      :current-count="currentCount"
      @back="page = 'form'"
      @switch-dept="switchDept"
    />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import FormPage   from './components/FormPage.vue'
import BottlePage from './components/BottlePage.vue'
import { useBgStars }    from './composables/useBgStars.js'
import { GOALS, MOCK_SUBMISSIONS, computeTotal } from './data/mockData.js'

/* ── Background stars ──────────────────────────────────────────── */
const { bgStars } = useBgStars(280)

/* ── Page routing ──────────────────────────────────────────────── */
const page = ref('form')

/* ── Bottle state ──────────────────────────────────────────────── */
const activeDept   = ref('junior')
const goalCount    = ref(GOALS.junior)
const submissions  = ref([...MOCK_SUBMISSIONS])
const currentCount = ref(computeTotal('junior', submissions.value))

function switchDept(dept) {
  activeDept.value   = dept
  goalCount.value    = GOALS[dept]
  currentCount.value = computeTotal(dept, submissions.value)
}

function handleViewBottle(dept) {
  activeDept.value   = dept
  goalCount.value    = GOALS[dept]
  currentCount.value = computeTotal(dept, submissions.value)
  page.value         = 'bottle'
}

function handleFormSubmit(entry) {
  submissions.value.push(entry)
  const dept = entry.identity
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

// Milestone toasts（以 currentCount / goalCount 百分比觸發）
watch(currentCount, (n) => {
  const pct = Math.round(n / goalCount.value * 100)
  const MS  = { 25: '🌟 已達成 25%！繼續加油！', 50: '⭐ 太棒了！完成一半！', 75: '✨ 快到了！最後衝刺！', 100: '🎉 達標！南無妙法蓮華經！' }
  for (const [m, msg] of Object.entries(MS)) {
    if (pct >= +m) { showToast(msg); if (+m === 100) boom(); break }
  }
})
</script>
