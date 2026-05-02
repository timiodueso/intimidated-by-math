import { NextResponse } from "next/server";

const DOMAINS = [
  { domain: "Arithmetic",     topics: ["Percentages", "Fractions", "Ratios", "Number Properties"] },
  { domain: "Algebra",        topics: ["Linear Equations", "Quadratics", "Inequalities", "Functions"] },
  { domain: "Geometry",       topics: ["Area & Perimeter", "Angles", "Coordinate Geometry", "Triangles"] },
  { domain: "Data Analysis",  topics: ["Statistics", "Probability", "Data Interpretation"] },
];

const CITIES = ["Lagos", "Nairobi", "Accra", "Abuja", "Kampala", "Johannesburg"];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export async function POST() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY not configured" }, { status: 500 });
  }

  const d     = pick(DOMAINS);
  const topic = pick(d.topics);
  const city  = pick(CITIES);

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key":          apiKey,
      "anthropic-version":  "2023-06-01",
      "content-type":       "application/json",
    },
    body: JSON.stringify({
      model:      "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      system:     "You generate GRE Quantitative Reasoning practice questions. Respond with valid JSON only — no markdown fences, no prose.",
      messages: [{
        role: "user",
        content: `Generate one GRE-level multiple-choice question on the topic "${topic}" (domain: ${d.domain}).
Set it in a real-world scenario from ${city}.
Return exactly this JSON shape and nothing else:
{
  "topic": "${topic}",
  "domain": "${d.domain}",
  "city": "${city}",
  "prompt": "<question text>",
  "options": [
    {"k": "A", "text": "<choice>", "correct": false},
    {"k": "B", "text": "<choice>", "correct": true},
    {"k": "C", "text": "<choice>", "correct": false},
    {"k": "D", "text": "<choice>", "correct": false}
  ],
  "hint": "<one-sentence hint that helps without giving the answer>",
  "trap": {"k": "A", "note": "<why this wrong option is tempting>"},
  "steps": [
    {"line": "<label>:", "v": "<value>"},
    {"line": "<label>:", "v": "<value>"}
  ]
}
Rules:
- Exactly one option must have "correct": true.
- "trap.k" must be the letter of one of the incorrect options.
- Steps should show the full worked solution (2–4 steps).`,
      }],
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error("Anthropic error:", body);
    return NextResponse.json({ error: "Anthropic API error" }, { status: 502 });
  }

  const data = await res.json();
  const raw: string = data.content?.[0]?.text ?? "";

  // Strip markdown fences if the model wrapped the JSON
  const text = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/, "").trim();

  try {
    const question = JSON.parse(text);
    return NextResponse.json(question);
  } catch {
    console.error("JSON parse failed:", raw);
    return NextResponse.json({ error: "Failed to parse question from API" }, { status: 500 });
  }
}
