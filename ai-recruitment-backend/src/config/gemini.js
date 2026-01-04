import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Get Gemini Pro model
export const getGeminiModel = (modelName = 'gemini-pro') => {
  return genAI.getGenerativeModel({ model: modelName });
};

// Generate content with Gemini
export const generateContent = async (prompt, modelName = 'gemini-pro') => {
  try {
    const model = getGeminiModel(modelName);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini AI error:', error);
    throw new Error('Failed to generate AI content');
  }
};

// Generate structured JSON response
export const generateJSONContent = async (prompt, modelName = 'gemini-pro') => {
  try {
    const model = getGeminiModel(modelName);
    
    // Add instruction to return JSON
    const jsonPrompt = `${prompt}\n\nIMPORTANT: Respond ONLY with valid JSON. No markdown, no code blocks, just raw JSON.`;
    
    const result = await model.generateContent(jsonPrompt);
    const response = await result.response;
    const text = response.text();

    // Clean response and parse JSON
    const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    const parsedResult = JSON.parse(cleanedText);
    return parsedResult;
  } catch (error) {
    console.error('Gemini JSON parsing error:', error);
    throw new Error('Failed to generate structured AI content');
  }
};

// Chat with history
export const chatWithHistory = async (messages, modelName = 'gemini-pro') => {
  try {
    const model = getGeminiModel(modelName);
    const chat = model.startChat({
      history: messages.slice(0, -1).map(msg => ({
        role: msg.role,
        parts: [{ text: msg.content }]
      }))
    });
    
    const lastMessage = messages[messages.length - 1];
    const result = await chat.sendMessage(lastMessage.content);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini chat error:', error);
    throw new Error('Failed to chat with AI');
  }
};

export default genAI;

