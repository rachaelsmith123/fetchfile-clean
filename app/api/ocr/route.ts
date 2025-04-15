import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  const { text } = await req.json();

  if (!text) {
    return NextResponse.json({ error: "Missing text" }, { status: 400 });
  }

  const prompt = `
You are a veterinary records assistant. Read this OCR-scanned veterinary record and summarize it in clear, structured format:

Text: ${text}

Respond in this format:

**Pet Info:**  
Name:  
DOB:  
Gender:  

**Vaccines:**  
- Name: Date  
- Name: Date  

**Medications:**  
- Name: Dose, Frequency  

**Diagnoses:**  
- List here  

**Visit Summaries (SOAP format):**  
Date:  
Clinic:  
S:  
O:  
A:  
P:
`;

  const chat = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.4,
  });

  const summary = chat.choices[0]?.message?.content;
  return NextResponse.json({ summary });
}
