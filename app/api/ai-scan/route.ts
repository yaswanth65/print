import { NextRequest, NextResponse } from 'next/server';

const KIE_API_KEY = '56819c9e41bb541d96432d04e2c5324f';
const KIE_API_URL = 'https://api.kie.ai/gemini/v1/models/gemini-3-8-flash:generateContent';

export async function POST(req: NextRequest) {
  try {
    const { files } = await req.json(); // Array of { base64, mimeType }

    if (!files || files.length === 0) {
      return NextResponse.json({ success: false, error: 'No files provided' }, { status: 400 });
    }

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

    const parts: any[] = [{ text: prompt }];

    for (const f of files) {
      parts.push({
        inlineData: {
          mimeType: f.mimeType || 'image/jpeg',
          data: f.base64,
        },
      });
    }

    const body = {
      contents: [
        {
          role: 'user',
          parts: parts,
        },
      ],
    };

    const response = await fetch(KIE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${KIE_API_KEY}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Kie API error:', errText);
      return NextResponse.json({ success: false, error: 'API Error: ' + response.statusText }, { status: response.status });
    }

    const data = await response.json();
    let resultText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // Extract only the clean transcription
    const cleanMatch = resultText.match(/## Clean transcription\s*([\s\S]*)/i);
    if (cleanMatch) {
      resultText = cleanMatch[1].trim();
      // Optionally strip any trailing "## Uncertain portions" if present
      const uncertainMatch = resultText.match(/([\s\S]*?)## Uncertain portions/i);
      if (uncertainMatch) {
        resultText = uncertainMatch[1].trim();
      }
    } else {
      resultText = resultText.trim();
    }

    return NextResponse.json({ success: true, text: resultText });
  } catch (error: any) {
    console.error('AI Scan Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
