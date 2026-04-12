const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, {
  dbName: 'E-Election',
  serverSelectionTimeoutMS: 5000,
})
.then(() => {
  console.log("💾 MongoDB Connected Successfully 🚀");
})
.catch((err) => {
  console.error("❌ MongoDB connection error:", err);
  process.exit(1);  // Stop server if DB fails
});

