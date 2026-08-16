import type { PlantAnalysis } from "./plant-types";

const GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MODEL = "google/gemini-3.6-flash";

export const DEMO_ANALYSIS: PlantAnalysis = {
  plantName: "Tomato",
  scientificName: "Solanum lycopersicum",
  confidence: 0.86,
  tags: ["Crop", "Edible", "Flowering"],
  healthStatus: "Warning",
  problem: "Possible early blight symptoms",
  noticed: "Dark spots with faint rings on the lower leaves and some yellowing around them.",
  description:
    "Tomato is a widely cultivated warm-season crop. It grows best in full sun with steady moisture and fertile, well-drained soil.",
  recommendations: [
    "Remove and discard badly affected leaves.",
    "Water at the base of the plant, not on the leaves.",
    "Improve airflow by spacing or staking plants.",
    "Monitor the plant daily for spreading spots.",
  ],
  care: {
    sunlight: "Full sun, 6-8 hours daily",
    water: "Keep soil consistently moist",
    soil: "Fertile, well-drained soil",
    temperature: "18-29°C",
  },
  demo: true,
};

const SYSTEM = `You are PlantAI, a careful agricultural assistant for farmers.
You look at a photo of a plant and identify it and any VISIBLE health problems.
Never invent a diagnosis. If you cannot confidently identify the plant, set plantName to "Not identified", confidence low, and explain in description.
Use cautious wording like "Possible" or "Signs may indicate". Keep language simple, short, and farmer friendly.
Reply with ONLY a JSON object (no markdown fences) shaped exactly:
{"plantName":string,"scientificName":string,"confidence":number 0-1,"tags":string[] (0-3 short chips like "Crop","Edible","Flowering"),"healthStatus":"Healthy"|"Warning"|"Diseased"|"Unknown","problem":string (empty if healthy),"noticed":string (visible symptoms, empty if healthy),"description":string (2 sentences about the plant),"recommendations":string[] (3-5 short actions),"care":{"sunlight":string,"water":string,"soil":string,"temperature":string}}`;

async function gateway(body: unknown, key: string) {
  const res = await fetch(GATEWAY, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Lovable-API-Key": key },
    body: JSON.stringify(body),
  });
  if (res.status === 429) throw new Error("PlantAI is busy right now. Please try again in a moment.");
  if (res.status === 402) throw new Error("AI credits are exhausted. Add credits to continue.");
  if (!res.ok) throw new Error(`AI request failed (${res.status}).`);
  const json = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  return json.choices?.[0]?.message?.content ?? "";
}

function parseJson(text: string): PlantAnalysis {
  const cleaned = text.replace(/```json|```/g, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  const parsed = JSON.parse(cleaned.slice(start, end + 1)) as Partial<PlantAnalysis>;
  return {
    plantName: parsed.plantName || "Not identified",
    scientificName: parsed.scientificName || "",
    confidence: typeof parsed.confidence === "number" ? parsed.confidence : 0,
    tags: Array.isArray(parsed.tags) ? parsed.tags.slice(0, 3) : [],
    healthStatus: parsed.healthStatus ?? "Unknown",
    problem: parsed.problem || "",
    noticed: parsed.noticed || "",
    description: parsed.description || "",
    recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations.slice(0, 5) : [],
    care: {
      sunlight: parsed.care?.sunlight || "—",
      water: parsed.care?.water || "—",
      soil: parsed.care?.soil || "—",
      temperature: parsed.care?.temperature || "—",
    },
  };
}

export async function analyzeImage(image: string, key: string | undefined): Promise<PlantAnalysis> {
  if (!key) {
    await new Promise((r) => setTimeout(r, 900));
    return DEMO_ANALYSIS;
  }
  const content = await gateway(
    {
      model: MODEL,
      messages: [
        { role: "system", content: SYSTEM },
        {
          role: "user",
          content: [
            { type: "text", text: "Identify this plant and assess its visible health." },
            { type: "image_url", image_url: { url: image } },
          ],
        },
      ],
    },
    key,
  );
  return parseJson(content);
}

export async function chatAboutPlant(
  context: string,
  messages: { role: "user" | "assistant"; content: string }[],
  key: string | undefined,
): Promise<string> {
  if (!key) {
    await new Promise((r) => setTimeout(r, 600));
    return "Demo Mode: PlantAI would answer this using the scanned plant's context. Add an AI key to get real answers.";
  }
  return gateway(
    {
      model: MODEL,
      messages: [
        {
          role: "system",
          content: `You are PlantAI, helping a farmer with the plant they just scanned.\n${context}\nAnswer in 2-4 short, simple sentences. Give practical general guidance, never a guaranteed diagnosis.`,
        },
        ...messages,
      ],
    },
    key,
  );
}
