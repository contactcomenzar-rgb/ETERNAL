const express = require("express");
const upload = require("../middleware/upload");
const router = express.Router();

const {
  getBlogs,
  createBlog,
  deleteBlog
} = require("../controllers/blogController");

// ✅ GET all blogs
router.get("/", getBlogs);

// ✅ CREATE blog (FIXED)
router.post("/", upload.single("image"), createBlog);

// ✅ DELETE blog
router.delete("/:id", deleteBlog);

module.exports = router;