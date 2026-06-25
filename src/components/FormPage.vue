<template>
  <div class="form-page">

    <!-- Header -->
    <div class="f-header">
      <div class="f-title">★ 搜集SOKA之星 ★</div>
      <div class="f-sub">2026 桃園西區 暑期活動</div>
    </div>

    <!-- Star row -->
    <div class="pac-row">
      <span v-for="n in 7" :key="n" class="star-blink" :class="'star-blink-' + n">★</span>
    </div>

    <!-- Step indicator -->
    <div class="step-row">
      <div class="step-node" :class="{ active: step === 1, done: step > 1 }">1</div>
      <div class="step-dash" :class="{ done: step > 1 }"></div>
      <div class="step-node" :class="{ active: step === 2 }">2</div>
    </div>

    <!-- ── Step 1: 選擇身分 ── -->
    <div v-if="step === 1" class="f-card pixel-card">
      <div class="f-card-title">▌ SELECT YOUR TEAM</div>

      <div class="id-menu">
        <div
          v-for="id in identities" :key="id.value"
          class="id-item"
          :class="{ selected: form.identity === id.value }"
          @click="form.identity = id.value"
        >
          <span class="id-cursor" :class="{ hidden: form.identity !== id.value }">▶</span>
          <span>{{ id.label }}</span>
          <span class="id-badge">{{ id.badge }}</span>
        </div>
      </div>

      <div class="coin-row">
        <span class="coin"></span>
        <span>COLLECT YOUR STARS</span>
        <span class="coin"></span>
      </div>

      <div class="f-actions">
        <button class="pixel-btn cyan" :disabled="!form.identity" @click="$emit('view', form.identity)">
          查看星星 <span class="btn-icon">★</span>
        </button>
        <button class="pixel-btn green" :disabled="!form.identity" @click="step = 2">
          NEXT <span class="btn-icon">▶</span>
        </button>
      </div>
    </div>

    <!-- ── Step 2: 填寫資料 ── -->
    <div v-if="step === 2" class="f-card pixel-card">
      <div class="f-card-title">▌ ENTER YOUR DATA</div>
      <div class="team-badge">
        <span class="team-badge-label">目前組別</span>
        <span class="team-badge-value">{{ identities.find(i => i.value === form.identity)?.label }}</span>
      </div>

      <!-- 部別（國中/高中限定） -->
      <div v-if="form.identity !== 'general'" class="f-field">
        <label class="f-label">◆ 部別</label>
        <div class="sub-row">
          <button
            v-for="d in depts" :key="d"
            class="sub-btn"
            :class="{ selected: form.dept === d }"
            @click="form.dept = d"
          >{{ d }}</button>
        </div>
      </div>

      <!-- 姓名 -->
      <div class="f-field">
        <label class="f-label">◆ 姓名</label>
        <input
          class="pixel-input"
          type="text"
          v-model="form.name"
          placeholder="INPUT NAME..."
          maxlength="12"
        />
      </div>

      <!-- 週次 -->
      <div class="f-field">
        <label class="f-label">◆ 週次</label>
        <select class="week-sel" v-model="form.week">
          <option v-for="w in weeks" :key="w.value" :value="w.value">
            {{ w.label }}{{ w.value === currentWeek ? '　(本週)' : '' }}
          </option>
        </select>
      </div>

      <!-- 題目數 -->
      <div class="f-field">
        <label class="f-label">◆ 本週題目數</label>
        <div class="min-row">
          <input
            class="pixel-input"
            type="number"
            v-model.number="form.minutes"
            placeholder="0"
            min="0"
            step="1"
            style="max-width: 180px"
            @keydown="e => ['-','+','e','E','.'].includes(e.key) && e.preventDefault()"
            @input="e => { const v = parseInt(e.target.value); e.target.value = (v > 0 ? v : ''); form.minutes = v > 0 ? v : '' }"
          />
          <span class="min-unit">分鐘</span>
        </div>
      </div>

      <div class="f-actions">
        <button class="pixel-btn" @click="step = 1"><span class="btn-icon">◀</span> BACK</button>
        <button class="pixel-btn green" :disabled="!canSubmit" @click="handleSubmit">
          SUBMIT <span class="btn-icon">★</span>
        </button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { IDENTITIES, DEPTS, WEEKS, getCurrentWeek } from '../data/mockData.js'

const emit = defineEmits(['submit', 'view'])

const step        = ref(1)
const currentWeek = getCurrentWeek()
const identities  = IDENTITIES
const depts       = DEPTS
const weeks       = WEEKS

const form = ref({
  identity: '',
  dept:     '',
  name:     '',
  week:     currentWeek,
  minutes:  '',
})

const canSubmit = computed(() => {
  const f = form.value
  const base = f.name.trim() && f.week && Number(f.minutes) > 0
  return f.identity === 'general' ? base : base && f.dept
})

function handleSubmit() {
  if (!canSubmit.value) return
  emit('submit', {
    identity: form.value.identity,
    dept:     form.value.identity === 'general' ? null : form.value.dept,
    name:     form.value.name.trim(),
    week:     form.value.week,
    minutes:  Number(form.value.minutes),
  })
}
</script>

<style scoped>
.form-page {
  position: relative; z-index: 1;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  min-height: 100vh;
  padding: 16px 14px 40px;
  gap: 14px;
}

/* Header */
.f-header {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  text-align: center; width: 100%; max-width: 600px;
  padding: 12px 0 4px; margin-top: -60px;
}
.f-title  { font-size: clamp(24px, 5vw, 36px); color: #FFD700; text-shadow: 3px 3px 0 #aa7700, 6px 6px 0 #553300; letter-spacing: 3px; line-height: 1.8; }
.f-sub    { font-size: clamp(10px,2vw,15px); color: #aaccff; letter-spacing: 2px; margin-top: 8px; }

/* Star row */
.pac-row { display: flex; gap: 18px; align-items: center; justify-content: center; }
.star-blink {
  font-size: 32px;
  animation: starBreathe 2s ease-in-out infinite;
}
/* 7 stars cycle through 3 colors: yellow / cyan / pink */
.star-blink-1 { color: #ffde4d; animation-delay: 0s;    text-shadow: 0 0 6px #ffde4d; }
.star-blink-2 { color: #4deeea; animation-delay: .28s;  text-shadow: 0 0 6px #4deeea; }
.star-blink-3 { color: #FF8080; animation-delay: .56s;  text-shadow: 0 0 6px #FF8080; }
.star-blink-4 { color: #ffde4d; animation-delay: .84s;  text-shadow: 0 0 6px #ffde4d; }
.star-blink-5 { color: #4deeea; animation-delay: 1.12s; text-shadow: 0 0 6px #4deeea; }
.star-blink-6 { color: #FF8080; animation-delay: 1.40s; text-shadow: 0 0 6px #FF8080; }
.star-blink-7 { color: #ffde4d; animation-delay: 1.68s; text-shadow: 0 0 6px #ffde4d; }
@keyframes starBreathe {
  0%,100% { opacity: 1;    transform: scale(1);    filter: brightness(1); text-shadow: inherit; }
  50%     { opacity: 0.25; transform: scale(0.75); filter: brightness(0.5); }
}

/* Step indicator */
.step-row  { display:flex; gap:6px; align-items:center; justify-content:center; }
.step-node {
  width:24px; height:24px; border:3px solid #4455aa; background:#131340;
  font-size:9px; color:#6677cc; display:flex; align-items:center; justify-content:center;
}
.step-node.active { border-color:#FFD700; color:#FFD700; background:#1e1800; box-shadow:0 0 8px rgba(255,215,0,.6); }
.step-node.done   { border-color:#44ee44; color:#44ee44; background:#0a2010; }
.step-dash { width:20px; height:3px; background:#3344aa; }
.step-dash.done { background:#44ee44; }

/* Card */
.f-card       { width:100%; max-width:600px; padding:22px 18px 20px; }
.f-card-title { font-size:clamp(10px,1.8vw,13px); color:#4deeea; letter-spacing:2px; border-bottom:2px solid #3344aa; padding-bottom:12px; margin-bottom:20px; text-shadow:0 0 8px rgba(77,238,234,0.5); }

/* Identity menu */
.id-menu { display:flex; flex-direction:column; gap:6px; margin-bottom:22px; }
.id-item {
  display:flex; align-items:center; gap:12px; padding:12px 14px;
  border:3px solid transparent; cursor:pointer; color:#8899cc;
  font-size:clamp(10px,1.8vw,13px); letter-spacing:1px; user-select:none;
}
.id-item:hover        { color:#ccd; border-color:#5566cc; background:#181840; }
.id-item.selected     { color:#fff; border-color:#FFD700; background:#1e1800; box-shadow:3px 3px 0 #553300; }
.id-cursor            { color:#FFD700; width:16px; flex-shrink:0; animation:blink .8s step-end infinite; }
.id-cursor.hidden     { color:transparent; animation:none; }
.id-badge             { margin-left:auto; font-size:9px; color:#6677aa; }
@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }

/* Coin */
.coin-row { display:flex; align-items:center; gap:8px; justify-content:center; font-size:11px; color:#FFD700; margin-bottom:4px; }
.coin { width:14px; height:14px; background:#FFD700; border-radius:50%; border:2px solid #aa8800; display:inline-block; animation:coinFlip 1.2s step-end infinite; }
@keyframes coinFlip { 0%{width:14px} 25%{width:4px} 50%{width:14px} 75%{width:4px} 100%{width:14px} }

/* Team badge */
.team-badge {
  display: flex; align-items: center; gap: 12px;
  padding: 10px 14px; margin-bottom: 18px;
  border: 3px solid #FFD700; background: #1e1800;
  box-shadow: 3px 3px 0 #553300;
}
.team-badge-label { font-size: 10px; color: #aa8800; letter-spacing: 1px; }
.team-badge-value { font-size: clamp(12px, 2vw, 15px); color: #FFD700; text-shadow: 0 0 8px rgba(255,215,0,0.5); }

/* Form fields */
.f-field   { margin-bottom:16px; }
.f-label   { font-size:clamp(9px,1.5vw,11px); color:#4deeea; display:block; margin-bottom:8px; letter-spacing:1px; text-shadow:0 0 6px rgba(77,238,234,0.4); }
.sub-row   { display:flex; gap:8px; flex-wrap:wrap; }
.sub-btn   { font-family:'Press Start 2P',monospace; font-size:clamp(9px,1.5vw,11px); padding:8px 14px; border:3px solid #4455aa; background:#13133a; color:#8899cc; cursor:pointer; letter-spacing:1px; outline:none; }
.sub-btn:hover { border-color:#7788dd; color:#ccd; background:#1e1e50; }
.sub-btn.selected { border-color:#FFD700; color:#FFD700; background:#1e1800; box-shadow:3px 3px 0 #553300; }

.week-sel {
  font-family:'Press Start 2P',monospace; font-size:clamp(9px,1.4vw,11px);
  background:#0c0c2e; border:3px solid #4455aa; color:#fff;
  padding:12px 36px 16px 12px; width:100%; outline:none; cursor:pointer;
  line-height: 1.8;
  -webkit-appearance:none; appearance:none;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='7'%3E%3Cpath d='M0 0l5 7 5-7z' fill='%23FFD700'/%3E%3C/svg%3E");
  background-repeat:no-repeat; background-position:right 12px center;
}
.week-sel:focus { border-color:#FFD700; box-shadow:0 0 8px rgba(255,215,0,0.3); }
.week-sel option { background:#13133a; line-height: 1.8; }

.min-row  { display:flex; align-items:center; gap:12px; }
.min-unit { font-size:clamp(9px,1.4vw,11px); color:#8899cc; white-space:nowrap; flex-shrink:0; }

.f-actions { display:flex; gap:12px; justify-content:center; margin-top:22px; flex-wrap:wrap; }

@media (max-width:400px) {
  .f-card { padding:16px 12px; }
  .sub-btn { padding:7px 10px; }
}
</style>
