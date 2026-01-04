import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Default model - gpt-4o-mini is fast, cheap, and great for structured output
const DEFAULT_MODEL = 'gpt-4o-mini';

// Generate content with OpenAI
export const generateContent = async (prompt, modelName = DEFAULT_MODEL) => {
  try {
    const response = await openai.chat.completions.create({
      model: modelName,
      messages: [
        {
          role: 'system',
          content: 'You are an expert HR and recruitment AI assistant. Provide helpful, accurate, and professional responses.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI error:', error.message);
    throw new Error('Failed to generate AI content');
  }
};

// Generate structured JSON response
export const generateJSONContent = async (prompt, modelName = DEFAULT_MODEL) => {
  console.log('🤖 OpenAI generateJSONContent called');
  console.log('📊 API Key configured:', !!process.env.OPENAI_API_KEY);
  console.log('🔧 Model:', modelName);
  
  try {
    const response = await openai.chat.completions.create({
      model: modelName,
      messages: [
        {
          role: 'system',
          content: 'You are an expert HR and recruitment AI assistant. Always respond with valid JSON only. No markdown, no code blocks, just raw JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3, // Lower temperature for more consistent JSON output
      max_tokens: 2000,
      response_format: { type: "json_object" } // Force JSON output
    });

    const text = response.choices[0].message.content;
    console.log('✅ OpenAI response received, length:', text.length);
    
    // Parse and return JSON
    const parsedResult = JSON.parse(text);
    console.log('✅ JSON parsed successfully, keys:', Object.keys(parsedResult));
    
    return parsedResult;
  } catch (error) {
    console.error('❌ OpenAI JSON error:', error.message);
    if (error.response) {
      console.error('Error status:', error.response.status);
      console.error('Error data:', error.response.data);
    }
    throw new Error('Failed to generate structured AI content: ' + error.message);
  }
};

// Chat with history
export const chatWithHistory = async (messages, modelName = DEFAULT_MODEL) => {
  try {
    // Convert messages to OpenAI format
    const formattedMessages = messages.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content
    }));

    // Add system message at the beginning
    formattedMessages.unshift({
      role: 'system',
      content: 'You are an AI recruitment assistant. Help users with job search, applications, CV tips, interview prep, and career advice. Be professional, helpful, and concise.'
    });

    const response = await openai.chat.completions.create({
      model: modelName,
      messages: formattedMessages,
      temperature: 0.7,
      max_tokens: 1000
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI chat error:', error.message);
    throw new Error('Failed to chat with AI');
  }
};

export default openai;

