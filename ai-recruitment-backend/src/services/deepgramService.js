import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const DEEPGRAM_API_KEY = process.env.DEEPGRAM_API_KEY;
const DEEPGRAM_API_URL = 'https://api.deepgram.com/v1/listen';

/**
 * Transcribe audio file using Deepgram STT
 * @param {string} audioUrl - Public URL to audio file
 * @param {object} options - Deepgram options
 * @returns {Promise<object>} Transcription result
 */
export const transcribeAudio = async (audioUrl, options = {}) => {
  try {
    console.log('🎤 Transcribing audio with Deepgram...', audioUrl);
    
    const config = {
      model: options.model || 'nova-2',
      language: options.language || 'en-US',
      punctuate: true,
      diarize: false,
      utterances: true,
      smart_format: true,
      filler_words: false
    };

    const response = await axios.post(
      DEEPGRAM_API_URL,
      { url: audioUrl },
      {
        headers: {
          'Authorization': `Token ${DEEPGRAM_API_KEY}`,
          'Content-Type': 'application/json'
        },
        params: config
      }
    );

    const result = response.data.results;
    const transcript = result.channels[0].alternatives[0].transcript;
    const confidence = result.channels[0].alternatives[0].confidence;
    const words = result.channels[0].alternatives[0].words;

    console.log('✅ Transcription complete:', transcript.substring(0, 100) + '...');

    return {
      success: true,
      transcript: transcript.trim(),
      confidence: (confidence * 100).toFixed(2),
      wordCount: words.length,
      duration: words.length > 0 ? words[words.length - 1]?.end || 0 : 0,
      words: words
    };
  } catch (error) {
    console.error('❌ Deepgram transcription error:', error.response?.data || error.message);
    throw new Error(`Transcription failed: ${error.message}`);
  }
};

/**
 * Transcribe audio from buffer/stream
 * @param {Buffer} audioBuffer - Audio file buffer
 * @param {string} mimeType - Audio MIME type
 * @returns {Promise<object>} Transcription result
 */
export const transcribeAudioBuffer = async (audioBuffer, mimeType = 'audio/webm', options = {}) => {
  try {
    console.log('🎤 Transcribing audio buffer with Deepgram...');
    
    const config = {
      model: options.model || 'nova-2',
      language: options.language || 'en-US',
      punctuate: true,
      utterances: true,
      smart_format: true
    };

    const response = await axios.post(
      DEEPGRAM_API_URL,
      audioBuffer,
      {
        headers: {
          'Authorization': `Token ${DEEPGRAM_API_KEY}`,
          'Content-Type': mimeType
        },
        params: config
      }
    );

    const result = response.data.results;
    const transcript = result.channels[0].alternatives[0].transcript;
    const confidence = result.channels[0].alternatives[0].confidence;

    console.log('✅ Buffer transcription complete');

    return {
      success: true,
      transcript: transcript.trim(),
      confidence: (confidence * 100).toFixed(2)
    };
  } catch (error) {
    console.error('❌ Deepgram buffer transcription error:', error.response?.data || error.message);
    throw new Error(`Transcription failed: ${error.message}`);
  }
};

/**
 * Get usage statistics from Deepgram
 * @returns {Promise<object>} Usage stats
 */
export const getUsageStats = async () => {
  try {
    const response = await axios.get('https://api.deepgram.com/v1/projects', {
      headers: {
        'Authorization': `Token ${DEEPGRAM_API_KEY}`
      }
    });

    return {
      success: true,
      projects: response.data.projects
    };
  } catch (error) {
    console.error('❌ Deepgram usage stats error:', error.message);
    return { success: false, error: error.message };
  }
};

