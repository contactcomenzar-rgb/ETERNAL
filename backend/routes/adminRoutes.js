const express = require("express");
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const { loginAdmin, changePassword  } = require("../controllers/adminController"); 

// ✅ LOGIN ROUTE (THIS WAS MISSING)
router.post("/login", loginAdmin);
router.put("/change-password", auth, changePassword);

// ✅ Protected route
router.get("/dashboard", auth, (req, res) => {
  res.json({ message: "Protected data" });
});

module.exports = router;