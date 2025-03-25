import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
app.use(express.json({ limit: '50mb' })); 
app.use(cors());

const genAI = new GoogleGenerativeAI("REQUEST_API_KEY");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

function fileToGenerativePart(base64Image, mimeType) {
  return {
    inlineData: {
      data: base64Image,
      mimeType
    }
  };
}

app.post('/api/generate-caption', async (req, res) => {
  const { imageBase64 } = req.body;

  if (!imageBase64) {
    return res.status(400).json({ error: 'Image data is required' });
  }

  try {
    const prompt = "Generate an Instagram-style caption for this image. Give me just one caption. Make it simple and fan-focused.";
    const imagePart = fileToGenerativePart(imageBase64, "image/jpeg");

    const result = await model.generateContent([prompt, imagePart]);
    const caption = result.response.text();

    return res.status(200).json({ caption });
  } catch (error) {
    console.error('Error generating caption:', error);
    return res.status(500).json({ error: 'Failed to generate caption' });
  }
});

const PORT = process.env.AI_PORT || 5002; 
app.listen(PORT, () => {
  console.log(`AI Caption Generator Service running on port ${PORT}`);
});