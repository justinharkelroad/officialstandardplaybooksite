// Keep one stored turn and one feedback target while displaying separate texts.
// Group excess paragraphs in the last bubble; never truncate a saved answer.
export function replyBubbles(text) {
  const paragraphs = text.trim().split(/\r?\n\s*\r?\n/).map(part => part.trim()).filter(Boolean);
  return paragraphs.length <= 3 ? paragraphs : [...paragraphs.slice(0, 2), paragraphs.slice(2).join('\n\n')];
}
// Render destinations from the current catalog so older chats benefit from
// corrected links without rewriting the historical transcript or its hash.
export function resolveActions(saved = [], catalog = []) {
  return [...new Set(saved.map(action => action.id))]
    .map(id => catalog.find(action => action.id === id)).filter(Boolean);
}


// Pause between incoming texts, long enough to read without simulating typing
// every character. The full response is already saved before playback starts.
export function bubblePause(text) {
  return Math.min(2600, Math.max(1400, 800 + text.length * 14));
}
export function waitForBubble(ms, signal) {
  return new Promise(resolve => {
    if (signal.aborted) return resolve();
    const finish = () => { clearTimeout(timer); signal.removeEventListener('abort', finish); resolve(); };
    const timer = setTimeout(finish, ms);
    signal.addEventListener('abort', finish, { once: true });
  });
}
