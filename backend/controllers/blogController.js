const Blog = require("../models/Blog");
const cloudinary = require("../config/cloudinary");

// GET all blogs
exports.getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: "Failed to load blogs", error: error.message });
  }
};

// CREATE blog (Cloudinary enabled)
// exports.createBlog = async (req, res) => {
//   try {
//     let imageUrl = null;
//     let imagePublicId = null;

//     // ✅ If image uploaded via multer-cloudinary
//     if (req.file) {
//       imageUrl = req.file.path;        // Cloudinary URL
//       imagePublicId = req.file.filename; // IMPORTANT
//     }

//     const blogData = {
//       ...req.body,
//       image: imageUrl,
//       imagePublicId: imagePublicId
//     };

//     console.log("BODY:", req.body);
//     console.log("FILE:", req.file);
//     const blog = await Blog.create(blogData);

//     res.status(201).json(blog);
    

//   } catch (error) {
//     console.error("🔥 CREATE BLOG ERROR:", error); // VERY IMPORTANT
//     res.status(500).json({
//       message: "Failed to save blog",
//       error: error.message,
//       stack: error.stack
//     });
//   }
// };

exports.createBlog = async (req, res) => {
  try {
    console.log("👉 STEP 1: Request received");

    // ---------------- BODY ----------------
    console.log("👉 STEP 2: Checking body");
    console.log("BODY:", req.body);

    // ---------------- FILE ----------------
    console.log("👉 STEP 3: Checking file");
    console.log("FILE:", req.file);

    let imageUrl = null;
    let imagePublicId = null;

    // ---------------- IMAGE PROCESS ----------------
    console.log("👉 STEP 4: Processing image");

    if (req.file) {
      try {
        imageUrl = req.file.path;
        imagePublicId = req.file.filename;

        console.log("✅ Image URL:", imageUrl);
        console.log("✅ Image Public ID:", imagePublicId);
      } catch (err) {
        console.error("❌ ERROR in image processing:", err);
        throw new Error("Image processing failed");
      }
    } else {
      console.log("⚠️ No file uploaded");
    }

    // ---------------- DATA PREP ----------------
    console.log("👉 STEP 5: Preparing blog data");

    const blogData = {
      ...req.body,
      image: imageUrl,
      imagePublicId
    };

    console.log("Blog Data:", blogData);

    // ---------------- DB SAVE ----------------
    console.log("👉 STEP 6: Saving to MongoDB");

    let blog;
    try {
      blog = await Blog.create(blogData);
      console.log("✅ Blog saved:", blog._id);
    } catch (err) {
      console.error("❌ ERROR in MongoDB save:", err);
      throw new Error("Database save failed: " + err.message);
    }

    // ---------------- RESPONSE ----------------
    console.log("👉 STEP 7: Sending response");

    res.status(201).json(blog);

  } catch (error) {
    console.error("🔥 FINAL ERROR:", error);

    res.status(500).json({
      message: error.message,
      step: "Check logs above 👆"
    });
  }
};

// DELETE blog + Cloudinary image
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // 🔥 Delete image from Cloudinary
    if (blog.imagePublicId) {
      await cloudinary.uploader.destroy(blog.imagePublicId);
    }

    await Blog.findByIdAndDelete(req.params.id);

    res.json({ message: "Blog and image deleted successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting blog" });
  }
};