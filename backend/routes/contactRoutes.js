const express = require("express");
const router = express.Router();

const {
  getContact,
  saveContact
} = require("../controllers/contactController");

// GET
router.get("/", getContact);

// CREATE / UPDATE
router.put("/", saveContact);

module.exports = router;