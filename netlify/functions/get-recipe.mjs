import { InferenceClient } from '@huggingface/inference';

const SYSTEM_PROMPT = `
You are an assistant that receives a list of ingredients that a user has and suggests a recipe.
Return a short, practical recipe with steps. Format your response in markdown.
`;

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Method Not Allowed'
    };
  }

  try {
    const { ingredients } = JSON.parse(event.body || '{}');
    if (!Array.isArray(ingredients) || ingredients.length === 0) {
      return { statusCode: 400, body: 'Invalid payload: "ingredients" must be a non-empty array' };
    }
    const hf = new InferenceClient(process.env.HF_ACCESS_TOKEN);

    const response = await hf.chatCompletion({
      model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `I have ${ingredients.join(', ')}. Please suggest a recipe.` },
      ],
      max_tokens: 1024,
      temperature: 0.7
    });

    const content = response?.choices?.[0]?.message?.content ?? '';

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content })
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: err?.message ?? String(err) })
    };
  }
}
