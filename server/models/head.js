const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const headSchema = mongoose.Schema({
    userId:{
        type:String,
        required: true,
        unique: true
    },
    name:{
        type:String,
    },
    password:{
        type:String,
        required: true
    },
});

const Head = mongoose.model("head", headSchema);

// Optional: Insert default head if not present
(async () => {
  try {
    const existingHead = await Head.findOne({ userId: "001" });

    if (!existingHead) {
      const hashedPassword = await bcrypt.hash("rakesh@123", 10);
      await Head.create({
        userId: "001",
        name: "Rakesh Kumar",
        password: hashedPassword,
      });
      console.log("✅ Default head user created.");
    } else {
      console.log("");
    }
  } catch (err) {
    console.error("❌ Error inserting head user:", err);
  }
})();

module.exports = Head;


