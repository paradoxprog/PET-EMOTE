export default async function handler(req, res) {
  // 1. Check for the secret key in the environment
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    return res.status(500).json({ error: 'Server configuration error: API Key missing' });
  }

  // 2. Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 3. Forward the request to Google Gemini
    // We use the model specified in your original code: gemini-2.0-flash
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req.body), // Pass the data from the frontend
      }
    );

    const data = await response.json();

    // 4. Handle Google API errors
    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    // 5. Return the clean data to your frontend
    return res.status(200).json(data);

  } catch (error) {
    console.error('Proxy Error:', error);
    return res.status(500).json({ error: 'Failed to communicate with AI service' });
  }
}
