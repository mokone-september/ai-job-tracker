import { NextResponse } from "next/server";

const preparationSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    overview: { type: "string" },
    questions: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          question: { type: "string" },
          whyItMatters: { type: "string" },
          answerGuidance: { type: "string" },
        },
        required: ["question", "whyItMatters", "answerGuidance"],
      },
    },
    talkingPoints: { type: "array", items: { type: "string" } },
  },
  required: ["overview", "questions", "talkingPoints"],
};

type Preparation = {
  overview: string;
  questions: {
    question: string;
    whyItMatters: string;
    answerGuidance: string;
  }[];
  talkingPoints: string[];
};

function fallbackPreparation(cvText: string, jobDescription: string): Preparation {
  const normalizedCv = cvText.toLowerCase();
  const role = jobDescription || "your target role";
  const hasMetrics = /\b\d+(%|k|m|\+)?\b/.test(cvText);
  const skills = ["javascript", "typescript", "react", "python", "sql", "leadership"]
    .filter((skill) => normalizedCv.includes(skill));
  const skillPrompt = skills.length ? skills.join(", ") : "the tools and skills named in your CV";

  return {
    overview: `Use these prompts to prepare concise, evidence-based answers for ${role}. Keep each response focused on the situation, your actions, and the result.`,
    questions: [
      {
        question: `Tell me about yourself and why you are interested in ${role}.`,
        whyItMatters: "This tests whether you can connect your experience to the role clearly.",
        answerGuidance: `Prepare a 60-90 second introduction that connects your strongest experience to ${skillPrompt} and ends with what you want to contribute next.`,
      },
      {
        question: "Tell me about a challenging problem you solved.",
        whyItMatters: "Interviewers look for structured problem-solving and ownership.",
        answerGuidance: "Use the STAR structure. Explain the constraint, the options you considered, the action you owned, and the measurable or observable result.",
      },
      {
        question: "Describe a time you received difficult feedback or had a disagreement.",
        whyItMatters: "This reveals how you collaborate, communicate, and learn.",
        answerGuidance: "Choose a real example. Focus on how you listened, what changed in your approach, and how the working relationship or outcome improved.",
      },
      {
        question: "What would you improve in your current CV or skill set for this role?",
        whyItMatters: "A thoughtful gap shows self-awareness without undermining your candidacy.",
        answerGuidance: hasMetrics
          ? "Name one capability to deepen, then explain the concrete steps you are taking to improve it."
          : "Prepare an example with a measurable outcome, and identify one capability you are actively strengthening.",
      },
      {
        question: "What questions do you have for us?",
        whyItMatters: "Your questions show how you evaluate the role and team.",
        answerGuidance: "Ask about success in the first 90 days, the team's current challenge, and how feedback or growth works in practice.",
      },
    ],
    talkingPoints: [
      hasMetrics ? "Be ready to explain the context behind every metric on your CV." : "Add a concrete result or scale to each story you plan to tell.",
      `Connect your experience with ${skillPrompt} to the needs of ${role}.`,
      "Prepare two examples of ownership and one example of learning from a setback.",
    ],
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
    return NextResponse.json(fallbackPreparation(cvText, jobDescription));
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
          content: "You are a practical interview coach. Ground every suggestion in the supplied CV and role description. Never invent experience or credentials.",
        },
        {
          role: "user",
          content: `Create interview preparation for this candidate${jobDescription ? " and target role" : ""}. Return only the requested structured result.\n\nTarget role:\n${jobDescription || "Not supplied"}\n\nCV:\n${cvText}`,
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "interview_preparation",
          strict: true,
          schema: preparationSchema,
        },
      },
    }),
  });

  if (!response.ok) {
    return NextResponse.json({ error: "The AI preparation service is unavailable. Try again shortly." }, { status: 502 });
  }

  const result = await response.json();
  if (typeof result.output_text !== "string") {
    return NextResponse.json({ error: "The AI returned an unreadable preparation guide." }, { status: 502 });
  }

  return NextResponse.json(JSON.parse(result.output_text) as Preparation);
}