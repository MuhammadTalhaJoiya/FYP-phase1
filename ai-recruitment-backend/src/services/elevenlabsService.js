import axios from 'axios';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1';
const DEFAULT_VOICE_ID = process.env.ELEVENLABS_VOICE_ID || 'EXAVITQu4vr4xnSDxMaL'; // Sarah voice

/**
 * Generate speech from text using ElevenLabs TTS
 * @param {string} text - Text to convert to speech
 * @param {string} voiceId - Voice ID (optional)
 * @param {object} voiceSettings - Voice customization
 * @returns {Promise<Buffer>} Audio buffer
 */
export const generateSpeech = async (text, voiceId = DEFAULT_VOICE_ID, voiceSettings = {}) => {
  try {
    console.log('🔊 Generating speech with ElevenLabs...');
    
    const settings = {
      stability: voiceSettings.stability || 0.5,
      similarity_boost: voiceSettings.similarity_boost || 0.8,
      style: voiceSettings.style || 0,
      use_speaker_boost: voiceSettings.use_speaker_boost || true
    };

    const response = await axios.post(
      `${ELEVENLABS_API_URL}/text-to-speech/${voiceId}`,
      {
        text: text,
        model_id: voiceSettings.model_id || 'eleven_multilingual_v2',
        voice_settings: settings
      },
      {
        headers: {
          'Accept': 'audio/mpeg',
          'xi-api-key': ELEVENLABS_API_KEY,
          'Content-Type': 'application/json'
        },
        responseType: 'arraybuffer'
      }
    );

    console.log('✅ Speech generated successfully');
    return Buffer.from(response.data);
  } catch (error) {
    console.error('❌ ElevenLabs TTS error:', error.response?.data || error.message);
    throw new Error(`TTS generation failed: ${error.message}`);
  }
};

/**
 * Get available voices from ElevenLabs
 * @returns {Promise<Array>} List of voices
 */
export const getVoices = async () => {
  try {
    const response = await axios.get(`${ELEVENLABS_API_URL}/voices`, {
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY
      }
    });

    return {
      success: true,
      voices: response.data.voices.map(v => ({
        id: v.voice_id,
        name: v.name,
        category: v.category,
        description: v.description,
        labels: v.labels
      }))
    };
  } catch (error) {
    console.error('❌ ElevenLabs voices fetch error:', error.message);
    throw new Error(`Failed to fetch voices: ${error.message}`);
  }
};

/**
 * Get character/usage information
 * @returns {Promise<object>} Usage stats
 */
export const getUsageStats = async () => {
  try {
    const response = await axios.get(`${ELEVENLABS_API_URL}/user`, {
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY
      }
    });

    const subscription = response.data.subscription;
    
    return {
      success: true,
      characterCount: subscription.character_count,
      characterLimit: subscription.character_limit,
      remaining: subscription.character_limit - subscription.character_count,
      nextResetDate: subscription.next_character_count_reset_unix
    };
  } catch (error) {
    console.error('❌ ElevenLabs usage stats error:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Generate speech and save to temporary file
 * @param {string} text - Text to convert
 * @param {string} voiceId - Voice ID
 * @returns {Promise<string>} Temp file path
 */
export const generateSpeechToFile = async (text, voiceId = DEFAULT_VOICE_ID, voiceSettings = {}) => {
  try {
    const audioBuffer = await generateSpeech(text, voiceId, voiceSettings);
    
    const tempDir = path.join(__dirname, '../../uploads/temp');
    await fs.mkdir(tempDir, { recursive: true });
    
    const fileName = `tts_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.mp3`;
    const filePath = path.join(tempDir, fileName);
    
    await fs.writeFile(filePath, audioBuffer);
    
    console.log('✅ TTS audio saved to file:', filePath);
    return filePath;
  } catch (error) {
    console.error('❌ TTS file generation error:', error.message);
    throw error;
  }
};

