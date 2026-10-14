// NAI – hides LinkedIn feed posts that talk about AI.

// Uppercase "AI" only, so words like "said", "Thai" or "aid" never match.
const CASED = /\b(?:AI|AGI|GenAI|OpenAI|xAI|LLMs?)\b|\bAI(?=[a-z])|\bA\.I\./;
// Unambiguous AI terms, any case.
const ANYCASE = /\b(?:artificial intelligence|kunstig intelligens|machine learning|deep learning|generative|gen ai|chat ?gpt|gpt-?\d|openai|anthropic|copilot|midjourney|deepseek|agentic|prompt engineering|vibe ?cod(?:e|ing)|large language models?|sam altman|neural networks?)\b/i;

const POST = '[data-urn*="urn:li:activity"],[data-id*="urn:li:activity"],[data-urn*="urn:li:aggregate"],.feed-shared-update-v2,[data-view-name="feed-full-update"]';

let enabled = true;

function isAI(text) {
  return CASED.test(text) || ANYCASE.test(text);
}

function scan() {
  if (!enabled) return;
  let hidden = 0;
  for (const post of document.querySelectorAll(POST)) {
    if (post.parentElement?.closest(POST)) continue; // only outermost
    const text = post.textContent;
    if (post.dataset.naiLen == text.length) continue; // unchanged since last check
    post.dataset.naiLen = text.length;
    if (isAI(text)) {
      post.dataset.nai = '1';
      post.style.display = 'none';
      hidden++;
    }
  }
  if (hidden) {
    chrome.storage.local.get({ count: 0 }, ({ count }) =>
      chrome.storage.local.set({ count: count + hidden }));
  }
}

function reset() {
  for (const el of document.querySelectorAll('[data-nai-len]')) {
    delete el.dataset.naiLen;
    if (el.dataset.nai) { delete el.dataset.nai; el.style.display = ''; }
  }
}

let queued = false;
new MutationObserver(() => {
  if (queued) return;
  queued = true;
  setTimeout(() => { queued = false; scan(); }, 150);
}).observe(document.documentElement, { childList: true, subtree: true, characterData: true });

chrome.storage.local.get({ enabled: true }, (s) => { enabled = s.enabled; scan(); });
chrome.storage.onChanged.addListener((c) => {
  if (!c.enabled) return;
  enabled = c.enabled.newValue;
  reset();
  scan();
});
