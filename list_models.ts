import fs from 'fs';

const KIE_API_KEY = '56819c9e41bb541d96432d04e2c5324f';
const KIE_API_URL = 'https://api.kie.ai/v1/models';

async function listModels() {
  try {
    const response = await fetch(KIE_API_URL, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${KIE_API_KEY}`,
      }
    });

    const data = await response.json();
    console.log(JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error:', err);
  }
}

listModels();
