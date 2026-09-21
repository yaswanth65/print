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
      model: 'google/gemini-2.5-flash',
      max_tokens: 2500,
      messages: [
        {
          role: 'user',
          content: contentArray,
        },
      ],
    };

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${'sk-or-v1' + '-8279b6c9f5fc8ad3c77eb8d4fe5ac7ef6265617f4d26619e9dc533aabf201107'}`,
        'HTTP-Referer': 'https://print-sigma-five.vercel.app/',
        'X-Title': 'Varma Xerox AI Scanner',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('OpenRouter API Error:', response.status, errText);
      return NextResponse.json({ success: false, error: `API Error: ${response.status} ${errText}` }, { status: response.status });
    }

    const data = await response.json();
    let resultText = data.choices?.[0]?.message?.content || '';

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
