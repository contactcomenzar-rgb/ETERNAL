const Stats = require("../models/Stats");

// GET stats
exports.getStats = async (req, res) => {
    try {
        let stats = await Stats.findOne();

        if (!stats) {
            stats = new Stats({
                stats: [
                    { value: 300, suffix: "+", label: "Projects" },
                    { value: 20, suffix: "K+", label: "Hours" },
                    { value: 30, suffix: "+", label: "Team Size Professionals" },
                    { value: 1000, suffix: "+", label: "Amazon Listings" }
                ]
            });
            await stats.save();
        }

        res.json(stats);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// UPDATE stats
exports.updateStats = async (req, res) => {
    try {
        const { stats } = req.body;

        let existing = await Stats.findOne();

        if (!existing) {
            existing = new Stats();
        }

        existing.stats = stats;

        await existing.save();

        res.json({ message: "Stats updated", stats: existing });
        
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};