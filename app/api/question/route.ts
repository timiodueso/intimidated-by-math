import { NextResponse } from "next/server";
import { PROBLEM_GENERATION } from "@/lib/prompts";

const DOMAINS = [
  { domain: "Arithmetic",    topics: ["Percentages", "Fractions", "Ratios", "Number Properties"] },
  { domain: "Algebra",       topics: ["Linear Equations", "Quadratics", "Inequalities", "Functions"] },
  { domain: "Geometry",      topics: ["Area & Perimeter", "Angles", "Coordinate Geometry", "Triangles"] },
  { domain: "Data Analysis", topics: ["Statistics", "Probability", "Data Interpretation"] },
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
      "x-api-key":         apiKey,
      "anthropic-version": "2023-06-01",
      "content-type":      "application/json",
    },
    body: JSON.stringify({
      model:      "claude-haiku-4-5-20251001",
      max_tokens: 2048,
      system:     PROBLEM_GENERATION.system,
      messages: [{
        role:    "user",
        content: PROBLEM_GENERATION.userMessage(topic, d.domain, city),
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
