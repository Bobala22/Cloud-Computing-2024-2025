import express from "express";
import bodyParser from "body-parser";
import GoogleTTS from "./GoogleTTS.js";
import dotenv from "dotenv";
import cors from 'cors';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

console.log('Initializing Google TTS service...');
const ttsService = new GoogleTTS();

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (HTML test pages)
app.use(express.static('./'));

// Testing endpoint to verify server is running
app.get("/", (req, res) => {
    res.send("TTS Server is running. Send POST requests to /api/text-to-speech/audio");
});

app.get("/api/text-to-speech/audio", async (req, res) => {
    handleTTSRequest(req, res);
});

app.post("/api/text-to-speech/audio", async (req, res) => {
    handleTTSRequest(req, res);
});

async function handleTTSRequest(req, res) {
    let text;
    
    if (req.method === 'GET') {
        text = req.query.text;
        console.log("GET request with text:", text);
    } else {
        console.log("POST request body:", req.body);
        if (typeof req.body === 'object' && req.body.text) {
            text = req.body.text;
        } else if (typeof req.body === 'string') {
            text = req.body;
        }
    }
    
    console.log("Extracted text:", text);
    
    if (!text) {
        return res.status(400).json({ error: "Nu a fost furnizat niciun text" });
    }
    
    try {
        console.log(`Processing TTS request for text: "${text}"`);
        const audioBuffer = await ttsService.textToSpeech(text);
        
        console.log(`Audio generated successfully, size: ${audioBuffer.length} bytes`);
        
        res.set({
            "Content-Type": "audio/mpeg",
            "Content-Length": audioBuffer.length,
            "Content-Disposition": "attachment; filename=speech.mp3"
        });
        res.send(audioBuffer);
    } catch (error) {
        console.error("EROARE TTS:", error);
        res.status(500).json({ error: error.message || "Eroare la generare audio" });
    }
}

app.listen(port, () => {
    console.log(`Serverul rulează pe http://localhost:${port}`);
    console.log(`Test the server at: http://localhost:${port}`);
});