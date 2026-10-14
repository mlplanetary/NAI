# NAI 🚫🤖

**Say "nay" to AI posts on LinkedIn.**

NAI is a tiny Chrome/Chromium extension that hides LinkedIn feed posts about AI. It's plain JavaScript in a single small file. There's no tracking, no network requests and no settings to fiddle with.

## What gets hidden

NAI reads **only the post itself**, plus the original post if it's a reshare. Comments, the author's name and headline, and "X liked this" lines are ignored. A post is hidden if it mentions:

- **Uppercase `AI`** as a word (`AI`, `AI-powered`, `AI-agenter`, `AIs`, `GenAI`, `A.I.`), plus `AGI`, `LLM(s)` and `GPT`. Matching is case-sensitive, so words like *said*, *Thai*, *aid* or *fair* are never touched.
- **AI companies:** OpenAI, Anthropic, DeepMind, Mistral, xAI, Hugging Face, Midjourney, DeepSeek, Cohere, Perplexity, ElevenLabs, Cursor, Lovable, Replit, Groq, Cerebras and many more.
- **AI products and models:** ChatGPT, GPT-5, Claude Code, Gemini, Copilot, Llama, Grok, DALL-E, Stable Diffusion, NotebookLM and others.
- **AI people:** Sam Altman, Dario Amodei, Demis Hassabis and others.
- **AI concepts:** machine learning, LLMs, agentic, AI agents, prompt engineering, vibe coding, chatbots, generative and others, plus Danish terms like *kunstig intelligens*, *maskinlæring* and *sprogmodel*.

Everything else stays. To tweak the lists, edit `CASED_TERMS` and `TERMS` at the top of [`content.js`](content.js).

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
