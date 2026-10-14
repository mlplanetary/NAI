// NAI – hides LinkedIn feed posts that talk about AI.

// Case-sensitive: these are only AI when capitalised like this
// ("AI" but never "said"/"Thai"/"aid"; "Claude Code" but not a person called Claude).
const CASED_TERMS = [
  'AI', 'AIs', 'A\\.I', 'AGI', 'GenAI', 'LLMs?', 'GPTs?',
  'Claude(?: Code| Opus| Sonnet| Haiku| Cowork| \\d)', 'Gemini(?: \\d| Pro| Ultra| Flash| Nano)',
  'Google Gemini', 'Llama ?\\d', 'Grok', 'Mistral', 'Mixtral', 'Cohere', 'Perplexity',
  'Cursor', 'Lovable', 'Qwen', 'Codex',
];
// Any case: unambiguous AI companies, products, people and concepts.
const TERMS = [
  // Companies (almost) exclusively about AI
  'openai', 'anthropic', 'deepmind', 'google deepmind', 'mistral ai', 'xai', 'hugging ?face',
  'stability ai', 'midjourney', 'deepseek', 'moonshot ai', 'zhipu', 'minimax', 'inflection ai',
  'character\\.ai', 'scale ai', 'safe superintelligence', 'thinking machines lab', 'anysphere',
  'cognition labs', 'replit', 'elevenlabs', 'eleven labs', 'synthesia', 'suno', 'runway ?ml',
  'pika labs', 'jasper ai', 'harvey ai', 'groq', 'cerebras', 'sambanova', 'poolside ai',
  'aleph alpha', 'sakana ai', 'liquid ai', 'adept ai', 'codeium', 'tabnine', 'langchain',
  'llamaindex', 'crewai', 'n8n',
  // Products & models
  'chat ?gpt', 'gpt-?\\d\\w*', 'gpt-?4o', 'copilot', 'github copilot', 'claude ai', 'claude\\.ai',
  'dall-?e', 'stable diffusion', 'notebooklm', 'gemini ai', 'meta ai', 'autogpt', 'agentforce',
  'bolt\\.new', 'v0\\.dev', 'tensorflow', 'pytorch',
  // People
  'sam altman', 'dario amodei', 'demis hassabis', 'ilya sutskever', 'mustafa suleyman',
  'andrej karpathy', 'yann lecun', 'geoffrey hinton', 'mira murati',
  // Concepts
  'artificial (?:general )?intelligence', 'superintelligence', 'machine learning', 'deep learning',
  'neural networks?', 'generative', 'gen ai', 'large language models?', 'language models?',
  'foundation models?', 'frontier models?', 'diffusion models?', 'transformer models?',
  'prompt engineer(?:ing)?', 'context engineering', 'vibe ?cod(?:e|ed|ing|er)',
  'agentic', 'ai agents?', 'chatbots?', 'computer vision', 'natural language processing',
  'retrieval[- ]augmented', 'model context protocol', 'hallucinat\\w*',
  // Danish
  'kunstig intelligens', 'maskinlæring', 'sprogmodel\\w*', 'generativ',
];
const CASED = new RegExp(`\\b(?:${CASED_TERMS.join('|')})(?![a-z])`);
const ANYCASE = new RegExp(`\\b(?:${TERMS.join('|')})(?![a-zæøå])`, 'i');

// Classic LinkedIn markup, plus the newer layout with randomised class names
// where each post is a listitem in the main feed.
const POST = '[data-urn*="urn:li:activity"],[data-id*="urn:li:activity"],[data-urn*="urn:li:aggregate"],.feed-shared-update-v2,[data-view-name="feed-full-update"],[data-testid="mainFeed"] [role="listitem"],[role="listitem"][componentkey*="FeedType_"]';
// Parts of a post that aren't the post itself: comments, author name/headline,
// "X liked this" header and reaction counts. Reshared posts are still read.
const SKIP = '[class*="comments-"],[data-view-name*="comment"],[componentkey*="comment" i],[data-testid*="comment" i],.update-components-actor,.update-components-header,.social-details-social-counts,.social-details-social-activity';

let enabled = true;

function isAI(text) {
  return CASED.test(text) || ANYCASE.test(text);
}

// The post's own text (incl. any reshared original), without the SKIP parts.
function postText(post) {
  // New layout: post bodies (and reshared originals) are expandable text boxes.
  const boxes = [...post.querySelectorAll('[data-testid="expandable-text-box"]')].filter((b) => !b.closest(SKIP));
  if (boxes.length) return boxes.map((b) => b.textContent).join(' ');
  let text = '';
  const walker = document.createTreeWalker(post, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, {
    acceptNode: (n) => n.nodeType === 1
      ? (n.matches(SKIP) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_SKIP)
      : NodeFilter.FILTER_ACCEPT,
  });
  while (walker.nextNode()) text += walker.currentNode.data + ' ';
  return text;
}

function scan() {
  if (!enabled) return;
  let hidden = 0;
  for (const post of document.querySelectorAll(POST)) {
    if (post.parentElement?.closest(POST)) continue; // only outermost
    const len = post.textContent.length;
    if (post.dataset.naiLen == len) continue; // unchanged since last check
    post.dataset.naiLen = len;
    if (isAI(postText(post))) {
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
