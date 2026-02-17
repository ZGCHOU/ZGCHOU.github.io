import { generateReplyForLetter } from './replyEngine'
import { getLetter, listLetters, LetterStatus, updateLetter } from './db'

const timers = new Map()

function clearTimer(id) {
  const t = timers.get(id)
  if (t) {
    clearTimeout(t)
    timers.delete(id)
  }
}

async function processLetter(letter) {
  if (!letter) return
  if (letter.status === LetterStatus.replied) return
  if (letter.replyId) return
  if (!letter.replyDueAt) return

  if (Date.now() < letter.replyDueAt) return

  const reply = await generateReplyForLetter(letter)
  await updateLetter(letter.id, {
    status: LetterStatus.replied,
    replyId: reply.id,
    repliedAt: Date.now(),
  })
}

export async function scheduleForLetterId(letterId) {
  clearTimer(letterId)

  const letter = await getLetter(letterId)
  if (!letter || !letter.replyDueAt) return

  const delay = Math.max(0, letter.replyDueAt - Date.now())
  const t = setTimeout(async () => {
    timers.delete(letterId)
    const fresh = await getLetter(letterId)
    await processLetter(fresh)
  }, delay)

  timers.set(letterId, t)
}

export async function scheduleAllPendingReplies() {
  const letters = await listLetters()
  for (const l of letters) {
    if (l.status === LetterStatus.sent && l.replyDueAt) {
      // eslint-disable-next-line no-await-in-loop
      await scheduleForLetterId(l.id)
    }
  }

  // 同时处理已经到期但没被调度到的
  for (const l of letters) {
    // eslint-disable-next-line no-await-in-loop
    await processLetter(l)
  }
}


