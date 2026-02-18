# AI Image Variations Studio

React + Node.js app that lets you upload one reference image, add a detailed prompt, and generate **10 new image variations** via OpenAI image APIs.

## Tech Stack
- Frontend: React + Vite
- Backend: Express + Multer
- AI API: OpenAI `gpt-image-1` (`images.edit`)

## Setup

```bash
npm install
cp server/.env.example server/.env
# put your OpenAI key in server/.env
npm run dev
```

- Frontend runs on `http://localhost:5173`
- Backend runs on `http://localhost:5000`

## How it works
1. Upload an image.
2. Paste your prompt (preloaded with your provided template).
3. Click **Generate 10 Variations**.
4. Download any generated output card.

## Notes
- This app sends image + prompt to OpenAI and returns base64 images.
- Generation cost depends on OpenAI model pricing.
