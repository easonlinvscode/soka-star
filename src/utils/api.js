const API_URL = 'https://script.google.com/macros/s/AKfycbzhPcFrMMSghapQCz7cJL_YRXFCrxpcunD2IFBGfqC-IfwdniwY854QXx3CZu7jfek/exec'

/** 讀取所有提交資料 */
export async function fetchSubmissions() {
  const res  = await fetch(API_URL, { redirect: 'follow' })
  const json = await res.json()
  if (!json.ok) throw new Error('fetch failed')

  // 將 Sheet 欄位對應回前端格式
  return json.data
    .filter(row => row['姓名'])  // 過濾空列
    .map(row => ({
      identity: row['組別'] === '國中部' ? 'junior' : row['組別'] === '高中部' ? 'senior' : 'general',
      dept:     row['部別']    || null,
      gender:   row['性別']    === '男生' ? 'male' : 'female',
      name:     row['姓名'],
      week:     Number(row['週次']),
      minutes:  Number(row['本週分鐘數']),
    }))
}

/** 新增一筆提交資料 */
export async function postSubmission(entry) {
  // 使用 text/plain 避免 CORS preflight
  await fetch(API_URL, {
    method:   'POST',
    redirect: 'follow',
    headers:  { 'Content-Type': 'text/plain' },
    body:     JSON.stringify({
      identity: entry.identity === 'junior' ? '國中部' : entry.identity === 'senior' ? '高中部' : '總務部',
      dept:     entry.dept,
      gender:   entry.gender === 'male' ? '男生' : '女生',
      name:     entry.name,
      week:     entry.week,
      minutes:  entry.minutes,
    }),
  })
}
