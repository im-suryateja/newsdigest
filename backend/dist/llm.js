// ── LLM Provider Adapter ─────────────────────────────────────────────────────
// Change LLM_PROVIDER in .env to switch between Claude, OpenAI, or Gemini.
// No other code changes needed.
import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import axios from 'axios';
import logger from './utils/logger';
const app = express();
const PORT = process.env.PORT || 8080;
app.use(express.json());
// 1. Keeps Railway health checks happy
app.get('/', (req, res) => {
    res.json({ message: "NewsDigest Backend API is running smoothly!" });
});
// 2. The pipeline execution controller
async function runNewsPipeline() {
    console.log("Starting the data refresh pipeline...");
    // TODO: Add your NewsAPI fetch loops and Firestore writing logic here later!
    console.log("Fetching articles from NewsAPI...");
    console.log("Pipeline processing complete!");
}
// 3. Expose the refresh trigger endpoint
app.post('/api/admin/refresh', async (req, res) => {
    try {
        runNewsPipeline();
        res.json({ status: "success", message: "News refresh pipeline triggered in the background!" });
    }
    catch (error) {
        res.status(500).json({ status: "error", error: String(error) });
    }
});
app.listen(PORT, () => {
    console.log(`Server is actively running on port ${PORT}`);
});
// ── Claude adapter ────────────────────────────────────────────────────────────
async function summarizeWithClaude(opts) {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const prompt = buildPrompt(opts);
    const response = await client.messages.create({
        model: 'claude-haiku-4-5-20251001', // cheapest model, still high quality
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }],
    });
    const text = response.content[0].type === 'text' ? response.content[0].text : '';
    return parseResponse(text, opts);
}
// ── OpenAI adapter ────────────────────────────────────────────────────────────
async function summarizeWithOpenAI(opts) {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const prompt = buildPrompt(opts);
    const response = await client.chat.completions.create({
        model: 'gpt-4o-mini',
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }],
    });
    const text = response.choices[0]?.message?.content ?? '';
    return parseResponse(text, opts);
}
// ── Gemini adapter ────────────────────────────────────────────────────────────
async function summarizeWithGemini(opts) {
    const apiKey = process.env.GEMINI_API_KEY;
    const prompt = buildPrompt(opts);
    const response = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: 1024 },
    });
    const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    return parseResponse(text, opts);
}
// ── Shared helpers ────────────────────────────────────────────────────────────
function buildPrompt(opts) {
    return `You are a professional news editor. Summarize the following article for a busy professional reader.

Article title: ${opts.title}
Source: ${opts.source}
URL: ${opts.url}

Article text:
${opts.articleText.slice(0, 4000)}

Return your response in this exact JSON format:
{
  "headline": "A clear, punchy headline in under 12 words",
  "tagline": "A single sentence that tells the reader the core takeaway",
  "summary": "Three to four paragraphs summarizing the article. Each paragraph should be 3–5 sentences. Be factual, balanced, and clear. Do not editorialize."
}

Return only valid JSON. No markdown fences.`;
}
function parseResponse(text, opts) {
    try {
        // Strip possible markdown fences
        const clean = text.replace(/```json|```/g, '').trim();
        const parsed = JSON.parse(clean);
        return {
            headline: parsed.headline ?? opts.title,
            tagline: parsed.tagline ?? '',
            summary: parsed.summary ?? '',
            sourceUrl: opts.url,
            sourceName: opts.source,
        };
    }
    catch (err) {
        logger.error('Failed to parse LLM response', { err, text });
        // Fallback: return raw text as summary
        return {
            headline: opts.title,
            tagline: '',
            summary: text,
            sourceUrl: opts.url,
            sourceName: opts.source,
        };
    }
}
// ── Main export ───────────────────────────────────────────────────────────────
export async function summarizeArticle(opts) {
    const provider = (process.env.LLM_PROVIDER ?? 'claude');
    logger.info(`Summarizing with provider: ${provider}`, { title: opts.title });
    switch (provider) {
        case 'claude':
            return summarizeWithClaude(opts);
        case 'openai':
            return summarizeWithOpenAI(opts);
        case 'gemini':
            return summarizeWithGemini(opts);
        default:
            throw new Error(`Unknown LLM provider: ${provider}`);
    }
}
