const mongoose = require("mongoose");

const transcriptSchema = new mongoose.Schema({
    text: String,
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('Transcript', transcriptSchema);