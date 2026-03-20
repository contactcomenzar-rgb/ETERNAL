const Message = require("../models/Message");

// CREATE MESSAGE
exports.createMessage = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    const newMessage = new Message({
      name,
      email,
      phone,
      message
    });

    await newMessage.save();

    res.status(201).json({
      success: true,
      message: "Message saved successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error saving message"
    });
  }
};

// GET ALL MESSAGES (for admin)
exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Error fetching messages" });
  }
};

// DELETE MESSAGE
exports.deleteMessage = async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.json({ message: "Message deleted" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
};