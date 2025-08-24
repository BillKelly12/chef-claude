
export async function getRecipeFromMistral(ingredientsArr) {
  const res = await fetch('/.netlify/functions/get-recipe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ingredients: ingredientsArr })
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Server error (${res.status}): ${text}`);
  }

  const { content } = await res.json();
  return content; // markdown string
}
