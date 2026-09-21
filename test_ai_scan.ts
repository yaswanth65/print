import fs from 'fs';
import path from 'path';

const KIE_API_KEY = '56819c9e41bb541d96432d04e2c5324f';
const KIE_API_URL = 'https://api.kie.ai/gemini/v1/models/gemini-3-8-flash:generateContent';

const prompt = `Rules:
1. Preserve the original meaning, wording, names, dates, numbers, blanks, punctuation, and document structure.
2. Do not invent, guess, or silently complete text that is unclear.
3. Correct obvious OCR errors only when the correction is strongly supported by context or the image.
4. For uncertain text, use [unclear] or [possible: ...].
5. Preserve handwritten or blank fields using placeholders such as: [date], [number of days], [name], [signature].
6. Do not translate unless explicitly requested. Keep Telugu text in Telugu script.
7. Preserve headings, paragraphs, lists, tables, and line breaks as much as possible.
8. Separate transcription from interpretation. Do not summarize.
9. Never fabricate personal information or document fields.

Return ONLY the transcribed document content. Do not include introductory text like "Here is the transcription".
Start your output EXACTLY with the text:
## Clean transcription

followed by the document text.`;

async function testScan(filePath: string, mimeType: string) {
  console.log(`\n--- Testing ${filePath} ---`);
  const imageBase64 = fs.readFileSync(filePath, { encoding: 'base64' });

  const body = {
    contents: [
      {
        role: 'user',
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType: mimeType,
              data: imageBase64,
            },
          },
        ],
      },
    ],
  };

  try {
    const response = await fetch(KIE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${KIE_API_KEY}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      console.error('API Error:', response.status, await response.text());
      return;
    }

    const data = await response.json();
    let resultText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    console.log('\n--- RAW API RESPONSE ---');
    console.log(resultText);
    
    console.log('\n--- PARSED OUTPUT (What user will see) ---');
    const cleanMatch = resultText.match(/## Clean transcription\s*([\s\S]*)/i);
    if (cleanMatch) {
      let parsed = cleanMatch[1].trim();
      const uncertainMatch = parsed.match(/([\s\S]*?)## Uncertain portions/i);
      if (uncertainMatch) {
        parsed = uncertainMatch[1].trim();
      }
      console.log(parsed);
    } else {
      console.log(resultText.trim());
    }

  } catch (err) {
    console.error('Error:', err);
  }
}

async function run() {
  await testScan(path.join(process.cwd(), 'test_images', 'img1.jpg'), 'image/jpeg');
  await testScan(path.join(process.cwd(), 'test_images', 'img2.png'), 'image/png');
}

run();
