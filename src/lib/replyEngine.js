import { createReply, getSetting, Mood } from './db'
import { generateKimiReply } from './kimi'

const templates = {
  [Mood.anxiety]: [
    '你已经做得很好了。焦虑像一阵风，吹得人心慌，但它也会过去。先把今天要做的事缩小到一件，完成它就够了。',
    '如果你现在很紧绷，先把肩膀放下来一点点。你不是必须立刻解决所有问题，你只需要先照顾好此刻的自己。',
  ],
  [Mood.sad]: [
    '难过不是软弱，是你在认真地感受。你可以允许自己慢一点，哭一会儿也没关系。',
    '今天先别逼自己“振作”。先好好吃饭、喝水、睡一觉。等你稍微有力气了，我们再继续。',
  ],
  [Mood.tired]: [
    '你累了，这很真实。休息不是偷懒，是重新把你自己接回来。',
    '把任务放小，把期待放轻。你不需要今天就把一切都完成。',
  ],
  [Mood.lonely]: [
    '孤独的时候，世界好像很大，但你并不是一个人。至少此刻，我在这里读着你的字。',
    '你值得被温柔对待。哪怕今天只有一点点温柔，也请把它留给自己。',
  ],
  [Mood.stress]: [
    '压力很大时，先把呼吸找回来。吸气四拍、停一拍、呼气六拍，重复三次。',
    '你背着的东西太多了。能不能先放下最不紧急的那一件？只要少一点点，就会轻一点点。',
  ],
  [Mood.confused]: [
    '迷茫的时候，不需要马上找到答案。你可以先选择一个“方向”，然后慢慢靠近。',
    '如果你不知道该怎么做，就先做最小的一步：写下你真正想要的是什么。',
  ],
  [Mood.angry]: [
    '委屈和生气都很正常，你被忽略或被伤害的感受是真实的。先把情绪说出来，它就不会一直堵在心口。',
    '你不需要把所有难受都咽下去。你可以为自己立一个小边界：今天至少不再苛责自己。',
  ],
  [Mood.happy]: [
    '看到你开心，我也跟着松了一口气。把这份小小的幸福记下来，它会在以后照亮你。',
    '愿你把今天的好心情像贴纸一样贴进手帐里，随时都能翻出来看看。',
  ],
}

const keywordTags = [
  { tag: 'work', words: ['工作', '加班', '同事', '领导', 'KPI', '绩效'] },
  { tag: 'study', words: ['考试', '复习', '论文', '作业', '学习'] },
  { tag: 'love', words: ['分手', '喜欢', '恋爱', '暧昧', '对象'] },
  { tag: 'family', words: ['父母', '家里', '妈妈', '爸爸'] },
]

function detectTags(content) {
  const hit = []
  for (const t of keywordTags) {
    if (t.words.some((w) => content.includes(w))) hit.push(t.tag)
  }
  return hit
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

export async function getDevDelayRange() {
  const min = await getSetting('devReplyDelayMinMs', 10_000)
  const max = await getSetting('devReplyDelayMaxMs', 30_000)
  return { min, max }
}

export async function computeReplyDueAt() {
  const mode = await getSetting('replyDelayMode', 'dev')
  if (mode === 'dev') {
    const { min, max } = await getDevDelayRange()
    const ms = Math.floor(min + Math.random() * Math.max(0, max - min))
    return Date.now() + ms
  }
  // default fallback
  return Date.now() + 30_000
}

export async function generateReplyForLetter(letter) {
  console.log('[ReplyEngine] generateReplyForLetter', {
    id: letter?.id,
    mood: letter?.mood,
    dueAt: letter?.replyDueAt,
    now: Date.now(),
  })

  try {
    console.log('[ReplyEngine] trying Kimi...')
    const content = await generateKimiReply(letter)
    console.log('[ReplyEngine] Kimi success')
    const reply = await createReply({ content, mood: letter.mood, letterId: letter.id })
    return reply
  } catch (e) {
    console.error('[ReplyEngine] Kimi failed, fallback to templates', e)

    const base = templates[letter.mood] || templates[Mood.anxiety]
    const text = pick(base)
    const tags = detectTags(letter.content)

    let extra = ''
    if (tags.includes('work')) extra = '\n\n如果可以的话，把“必须做到完美”换成“做到足够好”。你已经很努力了。'
    if (tags.includes('study')) extra = '\n\n学习是一点点堆起来的。今天做 10 分钟也算，别小看它。'
    if (tags.includes('love')) extra = '\n\n感情里的难受很锋利，但它也会被时间磨圆。你值得更温柔的相处。'
    if (tags.includes('family')) extra = '\n\n家人带来的情绪很复杂。你可以先照顾自己的感受，再决定怎么回应。'

    const content = `${text}${extra}\n\n—— 小铺掌柜`
    const reply = await createReply({ content, mood: letter.mood, letterId: letter.id })
    return reply
  }
}

