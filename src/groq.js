const GROQ_API = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama3-70b-8192";

export async function generateSnapshot(groqApiKey, { title, author, description, skills }) {
  const prompt = `You are a scientific workflow AI for K-Dense Web — a platform that turns research runs into reproducible, auditable capsules for peer review.

A scientist just completed a workflow. Generate a complete, realistic research snapshot JSON for it.

Workflow input:
- Title: ${title}
- Author: ${author}
- Description: ${description}
- Skills/tools used: ${skills.join(", ")}

Rules:
- reproducibilityScore: integer 0-100. Penalize live APIs (-15 each), versioned static DBs score higher. Be realistic.
- Each step must have: id (int), skill (string), detail (string describing what was done), db (database/tool + version), timestamp (ISO string near now), static (boolean — true if versioned/frozen, false if live)
- methodsText: journal-ready paragraph describing the workflow in past tense, naming exact DB versions and timestamps, ready to paste into a manuscript
- tags: 3-5 lowercase hyphenated research domain tags
- reviewerLink: "https://rrs.kdenseweb.io/review/<id>-<6 random chars>"
- outputs: object with 2-3 numeric metrics relevant to the workflow (e.g. compoundsScreened, genesFound, cellsClustered, reportPages etc)
- databases: array of DB/tool names with versions used

Respond ONLY with raw valid JSON. No markdown. No backticks. No explanation. Just the JSON object.

{
  "id": "snap-xxxxxx",
  "title": "...",
  "author": "...",
  "description": "...",
  "created": "2026-04-09T...",
  "status": "complete",
  "reproducibilityScore": 87,
  "steps": [
    { "id": 1, "skill": "...", "detail": "...", "db": "... v...", "timestamp": "...", "static": true }
  ],
  "databases": ["..."],
  "tags": ["..."],
  "reviewerLink": "https://rrs.kdenseweb.io/review/snap-xxxxxx-yyyyyy",
  "methodsText": "...",
  "outputs": { "metric1": 123, "metric2": 456 }
}`;

  const res = await fetch(GROQ_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${groqApiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 2000,
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err?.error?.message || `Groq API error: ${res.status}`);
  }

  const data = await res.json();
  const raw = data.choices[0].message.content.trim();

  // Strip any accidental markdown fences
  const clean = raw.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```$/i, "").trim();
  return JSON.parse(clean);
}

export async function improveSnapshot(groqApiKey, snapshot) {
  const prompt = `You are a scientific reproducibility expert for K-Dense Web.

Here is an existing research snapshot:
${JSON.stringify(snapshot, null, 2)}

Suggest 3 concrete, actionable improvements to increase its reproducibility score. Each suggestion should be specific to the databases and tools actually used.

Respond ONLY with raw JSON array, no markdown:
[
  { "title": "...", "detail": "...", "scoreImpact": "+N pts" },
  { "title": "...", "detail": "...", "scoreImpact": "+N pts" },
  { "title": "...", "detail": "...", "scoreImpact": "+N pts" }
]`;

  const res = await fetch(GROQ_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${groqApiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.5,
      max_tokens: 800,
    }),
  });

  if (!res.ok) throw new Error(`Groq API error: ${res.status}`);
  const data = await res.json();
  const raw = data.choices[0].message.content.trim();
  const clean = raw.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```$/i, "").trim();
  return JSON.parse(clean);
}
