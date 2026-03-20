const express = require("express");
const router = express.Router();

const {
  createMessage,
  getMessages,
  deleteMessage
} = require("../controllers/messageController");

router.post("/", createMessage);
router.get("/", getMessages);
router.delete("/:id", deleteMessage);

module.exports = router;