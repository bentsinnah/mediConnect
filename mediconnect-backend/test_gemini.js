require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const key = process.env.GEMINI_API_KEY;
console.log('API Key present:', !!key);
console.log('Key starts with:', key ? key.substring(0, 10) + '...' : 'MISSING');

const genAI = new GoogleGenerativeAI(key);

async function test() {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model.generateContent('Say HELLO in a single word, no formatting');
    console.log('SUCCESS:', result.response.text());
  } catch (err) {
    console.error('FAIL:', err.message || err);
  }
}

test();
