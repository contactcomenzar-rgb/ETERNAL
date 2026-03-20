const mongoose = require("mongoose");

const statSchema = new mongoose.Schema({
    label: String,
    value: Number,
    suffix: String
});

const statsSchema = new mongoose.Schema({
    stats: [statSchema]
}, { timestamps: true });

module.exports = mongoose.model("Stats", statsSchema);