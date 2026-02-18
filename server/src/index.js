import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import OpenAI from 'openai';

const app = express();
const port = process.env.PORT || 5000;
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.post('/api/generate', upload.single('image'), async (req, res) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: 'Missing OPENAI_API_KEY in server/.env' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Please upload a source image.' });
    }

    const { prompt } = req.body;
    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ error: 'Prompt is required.' });
    }

    const basePrompt = `${prompt.trim()}\n\nCreate 10 distinct, professional variations using different camera angles, composition, and lighting while respecting the supplied image as reference only.`;

    const response = await openai.images.edit({
      model: 'gpt-image-1',
      image: req.file.buffer,
      prompt: basePrompt,
      size: '1024x1280',
      n: 10
    });

    const images = (response.data || []).map((item, index) => ({
      id: index + 1,
      url: `data:image/png;base64,${item.b64_json}`
    }));

    res.json({ images });
  } catch (error) {
    console.error('Image generation failed:', error);
    res.status(500).json({
      error: error?.message || 'Failed to generate images.'
    });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
