const express = require("express");
const router = express.Router();
const Transcript = require("../models/transcript.model");

router.post("/", async (req, res) => {
  const { text } = req.body;
  try {
    const newTranscript = new Transcript({ text });
    await newTranscript.save();
    res.status(201).json({ message: "Transcript saved" });
  } catch (error) {
    res.status(500).json({ error: "Failed to save transcript" });
  }
});

module.exports = router;
