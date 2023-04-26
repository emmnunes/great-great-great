const openai = require('openai');
const apiKey = process.env.OPENAI_API_KEY;
const apiEndpoint = 'https://api.openai.com';

const openaiApi = openai.create(apiKey, { apiEndpoint });

export default openaiApi;
