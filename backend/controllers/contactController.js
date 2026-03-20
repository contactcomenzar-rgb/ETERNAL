const Contact = require("../models/Contact");

// ✅ GET contact info
exports.getContact = async (req, res) => {
  try {
    let contact = await Contact.findOne();

    if (!contact) {
      return res.json({
        phone: "",
        email: "",
        address: ""
      });
    }

    res.json(contact);
  } catch (err) {
    res.status(500).json({ message: "Error fetching contact info" });
  }
};

// ✅ CREATE or UPDATE contact (single document)
exports.saveContact = async (req, res) => {
  try {
    const { phone, email, address } = req.body;

    let contact = await Contact.findOne();

    if (contact) {
      // update
      contact.phone = phone;
      contact.email = email;
      contact.address = address;
      await contact.save();
    } else {
      // create first time
      contact = await Contact.create({ phone, email, address });
    }

    res.json({ message: "Contact info saved", contact });

  } catch (err) {
    res.status(500).json({ message: "Error saving contact info" });
  }
};