import { ref, computed, watch } from 'vue'

/**
 * 數字亂跳收斂動畫
 * @param {Ref<number>} targetRef  - 目標數值
 * @param {Ref<number>} goalRef    - 目標上限（用於計算百分比）
 */
export function useCountAnimation(targetRef, goalRef) {
  const displayCount = ref(0)
  const locked       = ref(false)

  const displayRemaining = computed(() => Math.max(0, goalRef.value - displayCount.value))
  const displayPct       = computed(() => Math.round(displayCount.value / goalRef.value * 100))

  let watcherUnsubscribe = null

  function animate() {
    // 清除先前的 watcher，避免重複監聽
    if (watcherUnsubscribe) { watcherUnsubscribe(); watcherUnsubscribe = null }

    const target   = targetRef.value
    const duration = 2000
    const start    = performance.now()

    function step(now) {
      const elapsed = now - start
      const prog    = Math.min(elapsed / duration, 1)
      const eased   = 1 - Math.pow(1 - prog, 3)
      const noise   = prog < 0.85 ? (Math.random() - 0.5) * target * 0.18 * (1 - prog) : 0
      displayCount.value = Math.round(Math.max(0, eased * target + noise))
      if (prog < 1) {
        requestAnimationFrame(step)
      } else {
        displayCount.value = target
        locked.value       = true
        setTimeout(() => { locked.value = false }, 600)
        // 動畫結束後跟隨 target 變化
        watcherUnsubscribe = watch(targetRef, val => { displayCount.value = val })
      }
    }
    requestAnimationFrame(step)
  }

  // 重置並重新播放（切換部門用）
  function reset() {
    if (watcherUnsubscribe) { watcherUnsubscribe(); watcherUnsubscribe = null }
    displayCount.value = 0
    locked.value       = false
    animate()
  }

  return { displayCount, displayRemaining, displayPct, locked, animate, reset }
}
