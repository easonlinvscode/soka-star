import { ref, onMounted } from 'vue'

/** 生成背景星星（由下往上漂移 + 閃爍） */
export function useBgStars(count = 280) {
  const bgStars = ref([])

  onMounted(() => {
    const W = window.innerWidth
    const H = window.innerHeight
    bgStars.value = Array.from({ length: count }, (_, i) => {
      const fd = 22 + Math.random() * 30
      const r  = Math.random()
      return {
        id: i,
        x:  Math.random() * W,
        y:  H + Math.random() * H,
        w:  r < 0.05 ? 7 : r < 0.15 ? 5 : r < 0.35 ? 4 : r < 0.65 ? 3 : 2,
        op: (0.1 + Math.random() * 0.75).toFixed(2),
        'fall-dur': fd.toFixed(1) + 's',
        'fall-del': (-Math.random() * fd).toFixed(1) + 's',
        'tw-dur':   (2.5 + Math.random() * 5).toFixed(1) + 's',
        'tw-del':   (-Math.random() * 6).toFixed(1) + 's',
      }
    })
  })

  return { bgStars }
}
