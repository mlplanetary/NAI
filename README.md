# NAI 🚫🤖

**Say "nay" to AI posts on LinkedIn.**

NAI is a tiny Chrome/Chromium extension that hides LinkedIn feed posts about AI. It's plain JavaScript in a single small file. There's no tracking, no network requests and no settings to fiddle with.

## What gets hidden

A post is hidden if it contains:

- **Uppercase `AI`** as a word (`AI`, `AI-powered`, `AIs`, `GenAI`, `OpenAI`, `A.I.`), plus `AGI` and `LLM(s)`. Matching is case-sensitive, so words like *said*, *Thai*, *aid* or *fair* are never touched.
- **Clear AI terms**, in any case: ChatGPT, GPT-4/5, OpenAI, Anthropic, Copilot, Midjourney, DeepSeek, agentic, prompt engineering, vibe coding, generative, machine/deep learning, artificial intelligence, *kunstig intelligens*, large language model, neural network, Sam Altman.

Everything else stays. Want to tweak the list? Edit the two regexes at the top of [`content.js`](content.js).

## Install

1. [Download the ZIP](../../archive/refs/heads/main.zip) and unzip it, or `git clone` this repo.
2. Open `chrome://extensions` (or `edge://`, `brave://`, `arc://extensions`).
3. Turn on **Developer mode** (top right).
4. Click **Load unpacked** and pick the `NAI` folder.
5. Reload LinkedIn and enjoy the silence.

Click the NAI icon to turn filtering on or off and to see how many posts it has hidden.

## Privacy

NAI only runs on `linkedin.com`. It reads post text locally in your browser and stores nothing except an on/off flag and a counter.

## License

MIT
