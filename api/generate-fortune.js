// API route for generating fortunes using OpenAI
import { OpenAI } from "openai";

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,POST");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a fortune teller with a silly, sarcastic sense of humor. Generate a short, funny, somewhat absurd prediction about the user's future. Your prediction should be in the style of a very mundane, slightly disappointing, but humorous fortune. Keep it under 150 characters. Don't include any introductions like 'Here's your fortune' or similar phrases.",
        },
        {
          role: "user",
          content: "Tell me my future.",
        },
      ],
      max_tokens: 100,
      temperature: 0.8,
    });

    const fortune = completion.choices[0].message.content.trim();

    res.status(200).json({ fortune });
  } catch (error) {
    console.error("Error generating fortune:", error);
    res.status(500).json({
      error: "Failed to generate fortune",
      fallbackFortune:
        "The crystal ball is foggy today. Perhaps Mercury is in retrograde, or perhaps the API key is missing.",
    });
  }
}
