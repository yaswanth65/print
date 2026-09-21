import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { files } = await req.json();

    if (!files || files.length === 0) {
      return NextResponse.json({ success: false, error: 'No files provided' }, { status: 400 });
    }

    const prompt = `You are an expert document digitizer. Your task is to extract text from the provided image and output it as cleanly formatted, semantic HTML.

RULES:
1. Preserve the exact original meaning, wording, names, dates, numbers, blanks, and punctuation.
2. Output ONLY raw HTML. Do not use markdown formatting like \`\`\`html.
3. Use structural HTML: <p>, <ul>, <ol>, <li>, <table>, <tr>, <td>.
4. ALIGNMENT IS CRITICAL: 
   - If text is centered (like titles/headings), wrap it in <div style="text-align: center;">
   - If text is right-aligned (like Dates at top right, or Signatures/Names at bottom right), wrap it in <div style="text-align: right;">
   - Do NOT use multiple spaces or &nbsp; for alignment. Use text-align CSS.
5. If there are tables, use <table style="width: 100%; border-collapse: collapse; border: 1px solid black;"> and add borders to <td>.
6. For uncertain text, use [unclear]. For blank lines to be filled, use dots (e.g. .............) or underscores.
7. Do not translate. Keep Telugu text in Telugu script.
8. Never fabricate personal information or document fields.

Start your output EXACTLY with the text:
## Clean transcription

followed by the HTML code.`;

    // Use Kie.ai API as requested
    const KIE_API_KEY = '56819c9e41bb541d96432d04e2c5324f';
    const KIE_API_URL = 'https://api.kie.ai/gemini/v1/models/gemini-3-8-flash:generateContent';

    const parts = [
      { text: prompt },
      ...files.map((f: any) => ({
        inline_data: {
          mime_type: f.mimeType || 'image/jpeg',
          data: f.base64,
        }
      }))
    ];

    const body = {
      contents: [
        {
          role: 'user',
          parts: parts
        }
      ]
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
      console.error('Kie.ai API Error:', response.status, errText);
      return NextResponse.json({ success: false, error: `API Error: ${response.status} ${errText}` }, { status: response.status });
    }

    const data = await response.json();
    let resultText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

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

    // Strip markdown codeblocks if AI added them
    resultText = resultText.replace(/^```html\s*/i, '').replace(/^```\s*/, '').replace(/```\s*$/, '');

    return NextResponse.json({ success: true, text: resultText });
  } catch (error: any) {
    console.error('AI Scan Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
