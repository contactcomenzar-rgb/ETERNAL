const mongoose = require("mongoose");

const socialSchema = new mongoose.Schema({
    instagram: String,
    pinterest: String,
    twitter: String,
    facebook: String
}, { timestamps: true });

module.exports = mongoose.model("Social", socialSchema);