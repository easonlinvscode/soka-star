export const GOALS = {
  junior:  10000,
  senior:  10000,
  general: 3000,
}

export const WEEKS = [
  { value: 1, label: '第一週 06/15 - 06/21' },
  { value: 2, label: '第二週 06/22 - 06/28' },
  { value: 3, label: '第三週 06/29 - 07/05' },
  { value: 4, label: '第四週 07/06 - 07/12' },
  { value: 5, label: '第五週 07/13 - 07/19' },
  { value: 6, label: '第六週 07/20 - 07/26' },
  { value: 7, label: '第七週 07/27 - 07/31' },
]

export const IDENTITIES = [
  { value: 'junior',  label: '國中部', badge: 'JR' },
  { value: 'senior',  label: '高中部', badge: 'SR' },
  { value: 'general', label: '總務部', badge: 'GN' },
]

export const DEPTS = ['執行部', '活動部', '熱力部']

export const DEPT_TABS = [
  { value: 'junior',  label: '國中' },
  { value: 'senior',  label: '高中' },
  { value: 'general', label: '總務部' },
]

export const MOCK_SUBMISSIONS = [
  // 國中部
  { identity: 'junior',  dept: '執行部', name: '王小明', week: 1, minutes: 180 },
  { identity: 'junior',  dept: '執行部', name: '李小花', week: 1, minutes: 120 },
  { identity: 'junior',  dept: '執行部', name: '張大偉', week: 2, minutes: 200 },
  { identity: 'junior',  dept: '活動部', name: '陳美玲', week: 1, minutes: 150 },
  { identity: 'junior',  dept: '活動部', name: '林志豪', week: 2, minutes: 90  },
  { identity: 'junior',  dept: '活動部', name: '吳小英', week: 3, minutes: 160 },
  { identity: 'junior',  dept: '熱力部', name: '黃建國', week: 1, minutes: 210 },
  { identity: 'junior',  dept: '熱力部', name: '劉雅琴', week: 2, minutes: 130 },
  // 高中部
  { identity: 'senior',  dept: '執行部', name: '蔡明哲', week: 1, minutes: 190 },
  { identity: 'senior',  dept: '執行部', name: '許秀蘭', week: 2, minutes: 140 },
  { identity: 'senior',  dept: '活動部', name: '江俊宏', week: 1, minutes: 220 },
  { identity: 'senior',  dept: '活動部', name: '林雅惠', week: 3, minutes: 170 },
  { identity: 'senior',  dept: '熱力部', name: '陳冠宇', week: 1, minutes: 110 },
  { identity: 'senior',  dept: '熱力部', name: '王佳琪', week: 2, minutes: 160 },
  // 總務部
  { identity: 'general', dept: null,    name: '蔡老師', week: 1, minutes: 240 },
  { identity: 'general', dept: null,    name: '林助理', week: 1, minutes: 180 },
  { identity: 'general', dept: null,    name: '張幹事', week: 2, minutes: 150 },
]

/** 計算某部門的總分鐘數（國中/高中自動加入總務部） */
export function computeTotal(dept, submissions) {
  const generalSum = submissions
    .filter(s => s.identity === 'general')
    .reduce((a, s) => a + s.minutes, 0)
  if (dept === 'general') return generalSum
  const deptSum = submissions
    .filter(s => s.identity === dept)
    .reduce((a, s) => a + s.minutes, 0)
  return deptSum + generalSum
}

/** 取得當前週次（依日期自動判斷） */
export function getCurrentWeek() {
  const starts = [
    new Date('2026-06-15'), new Date('2026-06-22'), new Date('2026-06-29'),
    new Date('2026-07-06'), new Date('2026-07-13'), new Date('2026-07-20'),
    new Date('2026-07-27'),
  ]
  const now = new Date()
  let cur = 1
  starts.forEach((d, i) => { if (now >= d) cur = i + 1 })
  return Math.min(cur, 7)
}
