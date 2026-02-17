import { createStore, del, get, keys, set } from 'idb-keyval'

const store = createStore('deyou-shop', 'kv')

export const Mood = {
  anxiety: 'anxiety',
  sad: 'sad',
  tired: 'tired',
  lonely: 'lonely',
  stress: 'stress',
  confused: 'confused',
  angry: 'angry',
  happy: 'happy',
}

export const LetterStatus = {
  sent: 'sent',
  replied: 'replied',
}

function uid(prefix) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
}

function letterKey(id) {
  return `letter:${id}`
}

function replyKey(id) {
  return `reply:${id}`
}

function settingsKey(k) {
  return `settings:${k}`
}

export async function createLetter({ content, mood, replyDueAt }) {
  const id = uid('l')
  const now = Date.now()
  const letter = {
    id,
    content,
    mood,
    status: LetterStatus.sent,
    createdAt: now,
    sentAt: now,
    replyDueAt,
    repliedAt: null,
    replyId: null,
    isPinned: false,
    isFavorite: false,
  }
  await set(letterKey(id), letter, store)
  return letter
}

export async function updateLetter(id, patch) {
  const cur = await getLetter(id)
  if (!cur) return null
  const next = { ...cur, ...patch }
  await set(letterKey(id), next, store)
  return next
}

export async function getLetter(id) {
  return (await get(letterKey(id), store)) || null
}

export async function listLetters() {
  const allKeys = await keys(store)
  const letterKeys = allKeys.filter((k) => typeof k === 'string' && k.startsWith('letter:'))
  const letters = []
  for (const k of letterKeys) {
    // eslint-disable-next-line no-await-in-loop
    const v = await get(k, store)
    if (v) letters.push(v)
  }
  letters.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
  return letters
}

export async function deleteLetter(id) {
  const letter = await getLetter(id)
  if (letter && letter.replyId) {
    await del(replyKey(letter.replyId), store)
  }
  await del(letterKey(id), store)
}

export async function togglePin(id) {
  const letter = await getLetter(id)
  if (!letter) return
  await updateLetter(id, { isPinned: !letter.isPinned })
}

export async function toggleFavorite(id) {
  const letter = await getLetter(id)
  if (!letter) return
  await updateLetter(id, { isFavorite: !letter.isFavorite })
}

export async function createReply({ content, mood, letterId }) {
  const id = uid('r')
  const now = Date.now()
  const reply = {
    id,
    content,
    mood,
    letterId,
    createdAt: now,
  }
  await set(replyKey(id), reply, store)
  return reply
}

export async function getReply(id) {
  return (await get(replyKey(id), store)) || null
}

export async function setSetting(key, value) {
  await set(settingsKey(key), value, store)
}

export async function getSetting(key, fallback = null) {
  const v = await get(settingsKey(key), store)
  return v ?? fallback
}

export async function ensureDefaultSettings() {
  const existing = await getSetting('replyDelayMode', null)
  if (!existing) {
    await setSetting('replyDelayMode', 'dev')
    await setSetting('devReplyDelayMinMs', 10_000)
    await setSetting('devReplyDelayMaxMs', 30_000)
  }
}

export function formatDateTime(ts) {
  if (!ts) return ''
  return new Date(ts).toLocaleString()
}

export function moodLabel(mood) {
  switch (mood) {
    case Mood.anxiety:
      return '焦虑'
    case Mood.sad:
      return '难过'
    case Mood.tired:
      return '疲惫'
    case Mood.lonely:
      return '孤独'
    case Mood.stress:
      return '压力'
    case Mood.confused:
      return '迷茫'
    case Mood.angry:
      return '委屈'
    case Mood.happy:
      return '开心'
    default:
      return '心情'
  }
}

export async function getAllData() {
  const allKeys = await keys(store)
  const data = {}
  for (const k of allKeys) {
    // eslint-disable-next-line no-await-in-loop
    data[k] = await get(k, store)
  }
  return data
}

export async function importAllData(data) {
  if (!data || typeof data !== 'object') return
  for (const [k, v] of Object.entries(data)) {
    // eslint-disable-next-line no-await-in-loop
    await set(k, v, store)
  }
}

