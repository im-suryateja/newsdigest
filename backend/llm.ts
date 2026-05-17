// ── LLM Provider Adapter ─────────────────────────────────────────────────────
// Change LLM_PROVIDER in .env to switch between Claude, OpenAI, or Gemini.
// No other code changes needed.

import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import axios from 'axios';
import logger from '../utils/logger';

export type LLMProvider = 'claude' | 'openai' | 'gemini';

export interface SummarizeOptions {
  articleText: string;
  title: string;
  source: string;
  url: string;
}

export interface SummarizeResult {
  headline: string;
  tagline: string;
  summary: string;    // 3–4 paragraphs
  sourceUrl: string;
  sourceName: string;
}

// ── Claude adapter ────────────────────────────────────────────────────────────
async function summarizeWithClaude(opts: SummarizeOptions): Promise<SummarizeResult> {
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
async function summarizeWithOpenAI(opts: SummarizeOptions): Promise<SummarizeResult> {
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
async function summarizeWithGemini(opts: SummarizeOptions): Promise<SummarizeResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  const prompt = buildPrompt(opts);

  const response = await axios.post(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { maxOutputTokens: 1024 },
    }
  );

  const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
  return parseResponse(text, opts);
}

// ── Shared helpers ────────────────────────────────────────────────────────────
function buildPrompt(opts: SummarizeOptions): string {
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

function parseResponse(text: string, opts: SummarizeOptions): SummarizeResult {
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
  } catch (err) {
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
export async function summarizeArticle(opts: SummarizeOptions): Promise<SummarizeResult> {
  const provider = (process.env.LLM_PROVIDER ?? 'claude') as LLMProvider;

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
