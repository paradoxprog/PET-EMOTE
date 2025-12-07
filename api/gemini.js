export default async function handler(req, res) {
  // 1. Get the key from Vercel Environment Variables
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Server Error: API Key missing' });
  }

  // 2. Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 3. Call Google Gemini
    // Note: ensure req.body has the structure { contents: [...] } as expected by Gemini
    // Or if your frontend sends { prompt: "..." }, construct the Gemini body here.
    // Based on your main.html logic, you are sending { prompt: "..." }, so we map it:
    
    const userPrompt = req.body.prompt;
    
    // Construct the payload expected by Gemini 2.0 Flash
    const geminiPayload = {
      contents: [{
        parts: [{ text: userPrompt }]
      }]
    };

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(geminiPayload),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    return res.status(200).json(data);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to communicate with AI service' });
  }
}
