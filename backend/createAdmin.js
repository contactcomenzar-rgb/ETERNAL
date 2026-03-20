const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const Admin = require("./models/Admin");

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("DB Connected"))
  .catch(err => console.log(err));

async function createAdmin() {
  try {
    const email = "admin@gmail.com";   // change this
    const password = "123456";       // change this

    // check if admin already exists
    const existing = await Admin.findOne({ email });
    if (existing) {
      console.log("Admin already exists");
      process.exit();
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    await Admin.create({
      email,
      password: hashedPassword
    });

    console.log("✅ Admin created successfully");
    process.exit();

  } catch (err) {
    console.log(err);
    process.exit();
  }
}

createAdmin();