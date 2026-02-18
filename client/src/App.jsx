import { useMemo, useState } from 'react';

const starterPrompt = `Make image on ✅ UPDATED YOUR SAVED POLITICAL IMAGE FORMAT
📐 1. Size & Layout

4:5 vertical ratio
Clean framing
No distortion
No blur
Full clear HD image
No crop cut in center subject

🎯 2. Main Central Image (MOST IMPORTANT)

100% completely NEW image
Different angle every time
Slight side angle (dynamic look)
Dramatic lighting
Cinematic clarity
NOT copied from reference
Background must be different
Clothes / pose slightly different
Should not look reused

🟢 3. Headline Style (UPDATED COLORS)

Big bold GREEN text
Important words inside YELLOW highlight bars
Clean black lower section for text
Easy English (slightly simplified)
10–20% rewritten version of caption

⭕ 4. Circle Inset (if used)

Opposite side placement
Different angle from main image
Also 100% new
No same background
No copy look

🚫 5. Strict Rules

NO logo
NO watermark
NO branding
NO social media handles
NO blur in center
No weird crop
No compression look

🎬 6. Overall Look

Breaking news style
High contrast
Sharp
Dramatic
Professional
Clean separation between image & text
Important words always in YELLOW highlight bars`;

export default function App() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [prompt, setPrompt] = useState(starterPrompt);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');

  const disabled = useMemo(() => loading || !image || !prompt.trim(), [loading, image, prompt]);

  const onImageChange = (event) => {
    const file = event.target.files?.[0];
    setImage(file || null);
    setResults([]);
    setError('');

    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview('');
    }
  };

  const onGenerate = async (event) => {
    event.preventDefault();
    if (!image) return;

    const formData = new FormData();
    formData.append('image', image);
    formData.append('prompt', prompt);

    try {
      setLoading(true);
      setError('');
      setResults([]);

      const response = await fetch('/api/generate', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Generation failed');
      }

      setResults(data.images || []);
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page">
      <section className="card form-card">
        <h1>AI Image Variations Studio</h1>
        <p>Upload one source image + prompt, then generate 10 new image variations using AI APIs.</p>

        <form onSubmit={onGenerate}>
          <label>
            Source Image
            <input type="file" accept="image/*" onChange={onImageChange} required />
          </label>

          <label>
            AI Prompt
            <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={16} required />
          </label>

          <button type="submit" disabled={disabled}>
            {loading ? 'Generating 10 images...' : 'Generate 10 Variations'}
          </button>
        </form>

        {preview && (
          <div className="preview">
            <h3>Source Preview</h3>
            <img src={preview} alt="Source preview" />
          </div>
        )}

        {error && <p className="error">{error}</p>}
      </section>

      <section className="card results-card">
        <h2>Generated Images</h2>
        {results.length === 0 ? (
          <p className="hint">Your generated images will appear here.</p>
        ) : (
          <div className="grid">
            {results.map((img) => (
              <article key={img.id} className="tile">
                <img src={img.url} alt={`Generated variation ${img.id}`} />
                <a href={img.url} download={`variation-${img.id}.png`}>
                  Download #{img.id}
                </a>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
