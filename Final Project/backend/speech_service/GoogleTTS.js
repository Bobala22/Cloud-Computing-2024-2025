import dotenv from 'dotenv';
dotenv.config();
import textToSpeech from '@google-cloud/text-to-speech';

export default class GoogleTTS {
    constructor() {
        this.client = new textToSpeech.TextToSpeechClient({
            keyFilename: process.env.TEXT_APPLICATION_CREDENTIALS
        });
    }

    async textToSpeech(text) {
        if (!text || text.trim() === '') {
            throw new Error("Text cannot be empty");
        }

        const request = {
            input: { text },
            voice: {
                languageCode: 'en-US',
                name: 'en-US-Neural2-D', // Neural English voice
            },
            audioConfig: {
                audioEncoding: 'MP3',
                speakingRate: 1.0,
            },
        };

        try {
            console.log('Sending request to Google TTS API...');
            const [response] = await this.client.synthesizeSpeech(request);
            
            const buffer = response.audioContent;
            if (!buffer || buffer.length === 0) {
                throw new Error("Generated audio is empty");
            }

            console.log(`Audio generated successfully, buffer size: ${buffer.length} bytes`);
            return buffer;
        } catch (error) {
            console.error('Google TTS API Error:', error);
            throw new Error(`TTS generation failed: ${error.message}`);
        }
    }
}