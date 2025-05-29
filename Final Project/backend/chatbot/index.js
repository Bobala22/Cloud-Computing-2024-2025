// index.js  (single back‑end for both features)
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import { OpenAIClient, AzureKeyCredential } from '@azure/openai';

dotenv.config();
const app = express();

/* ---- CORS ---- */
app.use(cors({
  origin: [
    'http://localhost:5173',                 // dev front‑end
    'https://drive-sync-frontend.vercel.app' // prod front‑end
  ],
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.static('public'));

/* ---- Azure OpenAI ---- */
const openai = new OpenAIClient(
  process.env.AZURE_OPENAI_ENDPOINT,
  new AzureKeyCredential(process.env.AZURE_OPENAI_KEY)
);
const deployment = process.env.AZURE_OPENAI_DEPLOYMENT || 'gpt-35-turbo';

/* ---- 1. Mechanic chatbot ---- */
app.post('/api/mechanic-chat', async (req, res) => {
  const { question } = req.body;
  if (!question) return res.status(400).json({ error: 'Question is required.' });

  const messages = [
    { role: 'system', content: 'You are an experienced mechanic. Answer in ≤50 words.' },
    { role: 'user', content: question },
  ];

  try {
    const response = await openai.getChatCompletions(deployment, {
      messages,
      maxTokens: 100,
      temperature: 0.7,
    });

    const answer = response.choices?.[0]?.message?.content?.trim();
    res.json({ answer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'OpenAI error' });
  }
});


/* ---- 2. Weather ---- */
app.post('/api/weather', async (req, res) => {
  const { lat, lon } = req.body;
  if (lat == null || lon == null) return res.status(400).json({ error: 'lat & lon required' });

  const url = `https://atlas.microsoft.com/weather/currentConditions/json` +
              `?api-version=1.1&query=${lat},${lon}` +
              `&subscription-key=${process.env.AZURE_MAPS_KEY}`;
  try {
    const { data } = await axios.get(url);
    res.json({ weather: data.results?.[0] ?? data });
  } catch (err) {
    console.error(err.response?.data || err);
    res.status(500).json({ error: 'Weather API error' });
  }
});

/* ---- start ---- */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));