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

    <!-- 說明文字（step 1 限定） -->
    <div v-if="step === 1" class="intro-box">
      <p class="intro-title">✦ 大家好！歡迎來到福運搜集站 ✦</p>
      <p>暑期活動即將展開，讓我們一起集結所有人的力量，創造最閃亮的夏天！</p>
      <p>在這裡，每一遍南無妙法蓮華經，都會化作一顆閃耀的星星，緩緩填滿你的星星瓶。大家的堅持與努力，將在這個夏天凝聚成無盡的福運。</p>
      <p class="intro-cta">就讓我們攜手搜集題目，讓這個暑期活動大勝利吧！🌟</p>
    </div>

    <!-- 使用說明彈出視窗 -->
    <teleport to="body">
      <div v-if="showManual" class="manual-overlay" @click.self="showManual = false">
        <div class="manual-box pixel-card">
          <button class="manual-close" @click="showManual = false">✕</button>
          <div class="manual-header">📖 使用說明</div>
          <div class="manual-body">
            <div class="manual-section">
              <div class="manual-step">① 選擇你的組別</div>
              <p>進入頁面後，請先選擇自己所屬的組別：</p>
              <ul>
                <li><b>國中部</b> — 國中部的夥伴</li>
                <li><b>高中部</b> — 高中部的夥伴</li>
                <li><b>總務部</b> — 幕後默默支持的夥伴</li>
              </ul>
            </div>
            <div class="manual-section">
              <div class="manual-step">② 填寫本週題目數</div>
              <p>選好組別後，依序填寫：部別、性別、姓名、週次，以及本週的唱題<b>分鐘數</b>。填寫完畢後按下「SUBMIT」送出即可。</p>
              <div class="manual-tip">💡 換算提醒：1 分鐘 = 60 遍題目，系統會自動幫你換算成遍數喔！</div>
            </div>
            <div class="manual-section">
              <div class="manual-step">③ 查看星星瓶</div>
              <p>送出後會自動跳轉到星星瓶頁面，你可以看到：</p>
              <ul>
                <li>目前全組的累積分鐘數與遍數</li>
                <li>距離目標還差多少</li>
                <li>瓶中的星星隨著大家的努力越來越多！</li>
              </ul>
            </div>
            <div class="manual-section">
              <div class="manual-step">④ 切換組別 | 部別</div>
              <p>畫面上方的按鈕可以切換國中、高中、總務三個瓶子，也可以透過下拉選單查看各部別的個別進度。</p>
            </div>
            <div class="manual-footer">🌟 一起讓星星瓶裝滿吧！ 🌟</div>
          </div>
        </div>
      </div>
    </teleport>

    <!-- ── Step 1: 選擇身分 ── -->
    <div v-if="step === 1" class="f-card pixel-card">
      <div class="f-card-title-row">
        <div class="f-card-title">▌ SELECT YOUR TEAM</div>
        <button class="manual-btn" @click="showManual = true">使用說明書</button>
      </div>

      <div class="id-menu">
        <div
          v-for="id in identities" :key="id.value"
          class="id-item"
          :class="{ selected: form.identity === id.value }"
          @click="form.identity = id.value; form.dept = ''"
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

      <!-- 性別 -->
      <div class="f-field">
        <label class="f-label">◆ 性別</label>
        <div class="sub-row">
          <button
            v-for="g in GENDERS" :key="g.value"
            class="gender-btn"
            :class="{ selected: form.gender === g.value }"
            :style="form.gender === g.value ? { borderColor: g.color, color: g.color, boxShadow: `3px 3px 0 ${g.color}44` } : {}"
            @click="form.gender = g.value"
          >
            <span class="gender-star" :style="{ color: g.color }">★</span>
            {{ g.label }}
          </button>
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
const showManual  = ref(false)
const currentWeek = getCurrentWeek()
const identities  = IDENTITIES
const depts       = DEPTS
const weeks       = WEEKS

const GENDERS = [
  { value: 'male',   label: '男生', color: '#4deeea' },
  { value: 'female', label: '女生', color: '#FF8080' },
]

const form = ref({
  identity: '',
  dept:     '',
  gender:   '',
  name:     '',
  week:     currentWeek,
  minutes:  '',
})

const canSubmit = computed(() => {
  const f = form.value
  const base = f.name.trim() && f.week && Number(f.minutes) > 0 && f.gender
  return f.identity === 'general' ? base : base && f.dept
})

function handleSubmit() {
  if (!canSubmit.value) return
  emit('submit', {
    identity: form.value.identity,
    dept:     form.value.identity === 'general' ? null : form.value.dept,
    gender:   form.value.gender,
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
.f-sub    { font-size: clamp(12px,2vw,15px); color: #aaccff; letter-spacing: 2px; margin-top: 8px; }

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
.f-card-title-row {
  display: flex; align-items: center; justify-content: space-between;
  border-bottom: 2px solid #3344aa; padding-bottom: 12px; margin-bottom: 20px;
}
.f-card-title { font-size:clamp(12px,1.8vw,13px); color:#4deeea; letter-spacing:2px; text-shadow:0 0 8px rgba(77,238,234,0.5); }

/* Step 2 standalone title */
.f-card > .f-card-title {
  border-bottom: 2px solid #3344aa;
  padding-bottom: 12px;
  margin-bottom: 20px;
}

/* 使用說明書按鈕 */
.manual-btn {
  font-family: 'Press Start 2P', monospace;
  font-size: 12px; padding: 5px 8px;
  border: 2px solid #6677bb; background: #0e0e2e; color: #8899cc;
  cursor: pointer; letter-spacing: 1px; outline: none;
  white-space: nowrap; flex-shrink: 0;
}
.manual-btn:hover { border-color: #FFD700; color: #FFD700; }

/* 說明彈出視窗 */
.manual-overlay {
  position: fixed; inset: 0; z-index: 200;
  background: rgba(5,5,20,0.85);
  display: flex; align-items: center; justify-content: center;
  padding: 16px;
}
.manual-box {
  position: relative;
  width: 100%; max-width: 520px; max-height: 80vh;
  overflow-y: auto;
  padding: 20px 22px 24px;
}
.manual-close {
  position: absolute; top: 10px; right: 12px;
  font-family: 'Press Start 2P', monospace;
  font-size: 12px; padding: 4px 8px;
  border: 2px solid #4455aa; background: #0e0e2e; color: #8899cc;
  cursor: pointer; outline: none;
}
.manual-close:hover { border-color: #FF8080; color: #FF8080; }
.manual-header {
  font-size: clamp(13px, 2vw, 15px); color: #FFD700;
  text-shadow: 0 0 10px rgba(255,215,0,0.5);
  letter-spacing: 2px; margin-bottom: 18px;
  border-bottom: 2px solid #3344aa; padding-bottom: 12px;
}
.manual-body {
  font-family: "PingFang TC","Noto Sans TC","Microsoft JhengHei",sans-serif;
  font-size: clamp(12px,1.6vw,13px); color: #aabbdd; line-height: 1.9;
  display: flex; flex-direction: column; gap: 14px;
}
.manual-section { display: flex; flex-direction: column; gap: 6px; }
.manual-step {
  font-family: 'Press Start 2P', monospace;
  font-size: 12px; color: #4deeea;
  text-shadow: 0 0 6px rgba(77,238,234,0.4);
  letter-spacing: 1px;
}
.manual-body p { margin: 0; }
.manual-body ul { margin: 4px 0 0 16px; padding: 0; }
.manual-body li { margin-bottom: 4px; }
.manual-body b { color: #ffffff; }
.manual-tip {
  background: #0a0a28; border-left: 3px solid #FFD700;
  padding: 8px 12px; color: #ccbb77;
  font-size: 12px;
}
.manual-footer {
  text-align: center; color: #4deeea;
  text-shadow: 0 0 8px rgba(77,238,234,0.4);
  font-family: 'Press Start 2P', monospace;
  font-size: 12px; padding-top: 6px;
  border-top: 2px solid #3344aa; margin-top: 4px;
}

/* Identity menu */
.id-menu { display:flex; flex-direction:column; gap:6px; margin-bottom:22px; }
.id-item {
  display:flex; align-items:center; gap:12px; padding:12px 14px;
  border:3px solid transparent; cursor:pointer; color:#8899cc;
  font-size:clamp(12px,1.8vw,13px); letter-spacing:1px; user-select:none;
}
.id-item:hover        { color:#ccd; border-color:#5566cc; background:#181840; }
.id-item.selected     { color:#fff; border-color:#FFD700; background:#1e1800; box-shadow:3px 3px 0 #553300; }
.id-cursor            { color:#FFD700; width:16px; flex-shrink:0; animation:blink .8s step-end infinite; }
.id-cursor.hidden     { color:transparent; animation:none; }
.id-badge             { margin-left:auto; font-size:12px; color:#6677aa; }
@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }

/* Coin */
.coin-row { display:flex; align-items:center; gap:8px; justify-content:center; font-size:12px; color:#FFD700; margin-bottom:4px; }
.coin { width:14px; height:14px; background:#FFD700; border-radius:50%; border:2px solid #aa8800; display:inline-block; animation:coinFlip 1.2s step-end infinite; }
@keyframes coinFlip { 0%{width:14px} 25%{width:4px} 50%{width:14px} 75%{width:4px} 100%{width:14px} }

/* Team badge */
.team-badge {
  display: flex; align-items: center; gap: 12px;
  padding: 10px 14px; margin-bottom: 18px;
  border: 3px solid #FFD700; background: #1e1800;
  box-shadow: 3px 3px 0 #553300;
}
.team-badge-label { font-size: 12px; color: #aa8800; letter-spacing: 1px; }
.team-badge-value { font-size: clamp(12px, 2vw, 15px); color: #FFD700; text-shadow: 0 0 8px rgba(255,215,0,0.5); }

/* Form fields */
.f-field   { margin-bottom:16px; }
.f-label   { font-size:12px; color:#4deeea; display:block; margin-bottom:8px; letter-spacing:1px; text-shadow:0 0 6px rgba(77,238,234,0.4); }
.sub-row   { display:flex; gap:8px; flex-wrap:wrap; }
.sub-btn   { font-family:'Press Start 2P',monospace; font-size:12px; padding:8px 14px; border:3px solid #4455aa; background:#13133a; color:#8899cc; cursor:pointer; letter-spacing:1px; outline:none; }
.sub-btn:hover { border-color:#7788dd; color:#ccd; background:#1e1e50; }
.sub-btn.selected { border-color:#FFD700; color:#FFD700; background:#1e1800; box-shadow:3px 3px 0 #553300; }

.gender-btn {
  font-family:'Press Start 2P',monospace; font-size:12px;
  padding:10px 20px; border:3px solid #4455aa; background:#13133a;
  color:#8899cc; cursor:pointer; letter-spacing:1px; outline:none;
  display:inline-flex; align-items:center; gap:8px;
}
.gender-btn:hover { border-color:#7788dd; color:#ccd; background:#1e1e50; }
.gender-btn.selected { background:#0d0d28; }
.gender-star { font-size:16px; position:relative; top:-1px; }

.week-sel {
  font-family:'Press Start 2P',monospace; font-size:12px;
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
.min-unit { font-size:12px; color:#8899cc; white-space:nowrap; flex-shrink:0; }

.f-actions { display:flex; gap:12px; justify-content:center; margin-top:22px; flex-wrap:wrap; }

@media (max-width:400px) {
  .f-card { padding:16px 12px; }
  .sub-btn { padding:7px 10px; }
}

/* 說明文字 */
.intro-box {
  width: 100%; max-width: 600px;
  padding-bottom: 4px;
  display: flex; flex-direction: column; gap: 10px;
  font-family: "PingFang TC", "Noto Sans TC", "Microsoft JhengHei", sans-serif;
  font-size: clamp(12px, 1.8vw, 14px);
  color: #8899cc;
  line-height: 1.8;
  text-align: center;
}
.intro-title {
  font-size: clamp(13px, 2vw, 15px);
  color: #FFD700;
  text-shadow: 0 0 10px rgba(255,215,0,0.4);
  letter-spacing: 1px;
  margin: 0;
}
.intro-cta {
  color: #4deeea;
  text-shadow: 0 0 8px rgba(77,238,234,0.35);
  margin: 0;
}
.intro-box p { margin: 0; }
</style>
