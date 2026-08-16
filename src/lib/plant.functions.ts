import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const AnalyzeInput = z.object({ image: z.string().min(20) });

const ChatInput = z.object({
  context: z.string(),
  messages: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string() }))
    .min(1)
    .max(20),
});

export const analyzePlant = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => AnalyzeInput.parse(input))
  .handler(async ({ data }) => {
    const { analyzeImage } = await import("./plant-ai.server");
    return analyzeImage(data.image, process.env["LOVABLE_API_KEY"]);
  });

export const askPlantAI = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ChatInput.parse(input))
  .handler(async ({ data }) => {
    const { chatAboutPlant } = await import("./plant-ai.server");
    const reply = await chatAboutPlant(data.context, data.messages, process.env["LOVABLE_API_KEY"]);
    return { reply };
  });
