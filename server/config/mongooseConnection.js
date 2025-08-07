const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, {
  dbName: 'E-Election', // 👈 NEW DATABASE NAME
})
.then(() => console.log(""))
.catch((err) => console.error("MongoDB connection error:", err));
