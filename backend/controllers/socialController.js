const Social = require('../models/Social')

exports.getSocial = async (req, res) => {
    try {
        let social = await Social.findOne();

        // ✅ If not exists, create one
        if (!social) {
            social = await Social.create({});
        }

        // ✅ Always return
        res.json(social);

    } catch (err) {
        console.error(err); // helpful debug
        res.status(500).json({ error: err.message });
    }
};

exports.updateSocial = async (req, res) => {
    try {
        const { instagram, pinterest, twitter, facebook } = req.body;

        let social = await Social.findOne();

        if (!social) {
            social = new Social();
        }

        social.instagram = instagram;
        social.pinterest = pinterest;
        social.twitter = twitter;
        social.facebook = facebook;

        await social.save();

        res.json({ message: "Social links updated", social });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


