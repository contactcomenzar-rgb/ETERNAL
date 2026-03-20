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
exports.createBlog = async (req, res) => {
  try {
    let imageUrl = null;
    let imagePublicId = null;

    // ✅ If image uploaded via multer-cloudinary
    if (req.file) {
      imageUrl = req.file.path;        // Cloudinary URL
      imagePublicId = req.file.filename; // IMPORTANT
    }

    const blogData = {
      ...req.body,
      image: imageUrl,
      imagePublicId: imagePublicId
    };

    const blog = await Blog.create(blogData);

    res.status(201).json(blog);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to save blog", error: error.message });
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