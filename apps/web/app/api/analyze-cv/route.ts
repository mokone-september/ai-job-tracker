import { NextResponse } from "next/server";

const analysisSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    summary: { type: "string" },
    score: { type: "number" },
    strengths: { type: "array", items: { type: "string" } },
    gaps: { type: "array", items: { type: "string" } },
    recommendations: { type: "array", items: { type: "string" } },
    keywords: { type: "array", items: { type: "string" } },
  },
  required: ["summary", "score", "strengths", "gaps", "recommendations", "keywords"],
};

type Analysis = {
  summary: string;
  score: number;
  strengths: string[];
  gaps: string[];
  recommendations: string[];
  keywords: string[];
};

function fallbackAnalysis(cvText: string, jobDescription: string): Analysis {
  const normalizedText = cvText.toLowerCase();
  const hasMetrics = /\b\d+(%|k|m|\+)?\b/.test(cvText);
  const hasSections = ["experience", "education", "skills"].filter((section) =>
    normalizedText.includes(section),
  );
  const requestedTerms = jobDescription
    .toLowerCase()
    .split(/[^a-z0-9+#.-]+/)
    .filter((term) => term.length > 3);
  const matchedKeywords = [...new Set(requestedTerms.filter((term) => normalizedText.includes(term)))].slice(0, 8);
  const missingKeywords = [...new Set(requestedTerms.filter((term) => !normalizedText.includes(term)))].slice(0, 6);
  const score = Math.min(
    95,
    40 + hasSections.length * 8 + (hasMetrics ? 12 : 0) + Math.min(20, matchedKeywords.length * 4),
  );

  return {
    summary: jobDescription
      ? `Your CV shows a ${score}/100 baseline match for the supplied role. It has ${matchedKeywords.length} detectable role keywords and would benefit from more evidence tied to the target description.`
      : `Your CV has a ${score}/100 baseline based on structure, evidence, and measurable outcomes. Add role-specific language to make the match more precise.`,
    score,
    strengths: [
      hasSections.length ? `Recognizable sections: ${hasSections.join(", ")}.` : "The content can be organized into clearer sections.",
      hasMetrics ? "Includes measurable details that can support impact." : "Add metrics to make achievements more credible.",
      cvText.length > 1200 ? "Provides enough detail for a meaningful first review." : "The draft is concise and easy to scan.",
    ],
    gaps: [
      ...(missingKeywords.length ? [`Missing target terms: ${missingKeywords.join(", ")}.`] : []),
      ...(hasMetrics ? [] : ["Few measurable outcomes were detected."]),
      ...(hasSections.length < 2 ? ["Add standard sections such as Experience, Skills, and Education."] : []),
    ],
    recommendations: [
      "Rewrite the opening summary around the role you want next.",
      "Turn responsibilities into achievement bullets using action, task, and result.",
      "Keep the strongest evidence near the top of each role.",
    ],
    keywords: matchedKeywords,
  };
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const cvText = typeof body?.cvText === "string" ? body.cvText.trim() : "";
  const jobDescription = typeof body?.jobDescription === "string" ? body.jobDescription.trim() : "";

  if (cvText.length < 80) {
    return NextResponse.json({ error: "Paste at least 80 characters of CV text." }, { status: 400 });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(fallbackAnalysis(cvText, jobDescription));
  }

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
      input: [
        {
          role: "system",
          content: "You are a precise CV reviewer. Give practical, evidence-based advice. Never invent experience or credentials.",
        },
        {
          role: "user",
          content: `Review this CV${jobDescription ? " for the target role below" : ""}. Return only the requested structured result.\n\nTarget role:\n${jobDescription || "Not supplied"}\n\nCV:\n${cvText}`,
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "cv_analysis",
          strict: true,
          schema: analysisSchema,
        },
      },
    }),
  });

  if (!response.ok) {
    return NextResponse.json({ error: "The AI analysis service is unavailable. Try again shortly." }, { status: 502 });
  }

  const result = await response.json();
  const outputText = result.output_text;
  if (typeof outputText !== "string") {
    return NextResponse.json({ error: "The AI returned an unreadable analysis." }, { status: 502 });
  }

  return NextResponse.json(JSON.parse(outputText) as Analysis);
}
