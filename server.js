const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config();

const { OpenAI } = require("openai");

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/generate", async (req, res) => {
  const { name, recipient, theme } = req.body;

  try {
    const prompt = `
You are an AI that helps people leave emotional farewell messages for their loved ones after they pass away.
Write a heartfelt, thoughtful message from "${name}" to "${recipient}" about the theme: "${theme}".
Keep it personal, touching, and life-affirming.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    const message = completion.choices[0].message.content;
    res.json({ message });
  } catch (error) {
    console.error("OpenAI API error:", error);
    res.status(500).json({ message: "Failed to generate message." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`LegacyGPT running at http://localhost:${PORT}`));
