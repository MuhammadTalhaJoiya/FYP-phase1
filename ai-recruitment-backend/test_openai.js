import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function testAPI() {
  try {
    console.log('🔍 Testing OpenAI API connection...');
    console.log('API Key configured:', !!process.env.OPENAI_API_KEY);

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: 'Hello, test message' }],
      max_tokens: 10
    });

    console.log('✅ OpenAI API is working!');
    console.log('Response:', response.choices[0].message.content);
    console.log('Usage:', response.usage);

  } catch (error) {
    console.log('❌ OpenAI API Error:', error.message);

    if (error.response) {
      console.log('Status Code:', error.response.status);
      console.log('Error Type:', error.response.data?.error?.type);
      console.log('Error Message:', error.response.data?.error?.message);
    }

    if (error.message.includes('quota') || error.message.includes('limit')) {
      console.log('🚨 This appears to be a rate limit or quota exceeded error!');
    }
  }
}

testAPI();
