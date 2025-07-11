const express = require("express");
const mongoose = require('mongoose');
const dotenv = require("dotenv");
const cors = require("cors");

const { GoogleGenAI } = require("@google/genai");

// routes --
const transcriptRoutes = require("./routes/transcript.routes")

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const genAI = new GoogleGenAI({ apiKey: GEMINI_API_KEY }); // Initialize GoogleGenAI with the API key

mongoose.connect('mongodb://localhost:27017/myx');


app.post("/api/generate", async (req, res) => {
  try {
    // Ensure req.body.prompt exists and is a string
    if (!req.body.prompt || typeof req.body.prompt !== 'string') {``
      return res.status(400).json({ error: "Prompt is required and must be a string." });
    }

    const result = await genAI.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: req.body.prompt }],
        },
      ],
    });

    const text = result.text;

    res.json({ text });
  } catch (err) {
    console.error("Error generating content:", err);
  
    const statusCode = err?.status || 500;
    const message = err?.error?.message || err?.message || "Unknown error occurred";
  
    res.status(statusCode).json({
      error: {
        message,
        code: statusCode,
        details: err?.error || {},
      },
    });
  }
});
app.use('/api/transcripts', transcriptRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));