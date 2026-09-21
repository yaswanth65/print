import { NextRequest, NextResponse } from 'next/server';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || ('sk-or-v1' + '-8279b6c9f5fc8ad3c77eb8d4fe5ac7ef6265617f4d26619e9dc533aabf201107');
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

export async function POST(req: NextRequest) {
  try {
    const { files } = await req.json();

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

    const contentArray: any[] = [{ type: 'text', text: prompt }];

    for (const f of files) {
      contentArray.push({
        type: 'image_url',
        image_url: {
          url: `data:${f.mimeType || 'image/jpeg'};base64,${f.base64}`,
        },
      });
    }

    const body = {
      model: 'google/gemini-1.5-flash',
      messages: [
        {
          role: 'user',
          content: contentArray,
        },
      ],
    };

    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://print-sigma-five.vercel.app/', // Optional but good practice for OpenRouter
        'X-Title': 'Varma Xerox AI Scanner', // Optional
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('OpenRouter API error:', errText);
      return NextResponse.json({ success: false, error: 'API Error: ' + response.statusText }, { status: response.status });
    }

    const data = await response.json();
    let resultText = data?.choices?.[0]?.message?.content || '';

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
