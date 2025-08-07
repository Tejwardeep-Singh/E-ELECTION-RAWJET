require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const mongoose = require("mongoose");

// Connect to DB
require("./config/mongooseConnection");

// ✅ Correct CORS (only once and before routes)
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Routes
const headLoginRoutes = require("./routes/headLogin");
const adminLoginRoutes = require("./routes/adminLogin");
const adminRoute = require("./routes/admin");
const headRoute = require("./routes/head");
const voterRoutes = require('./routes/voter');
const electionRoutes = require('./routes/election');
const resultsRouter = require('./routes/results');

app.use("/api/headLogin", headLoginRoutes);
app.use("/api/adminLogin", adminLoginRoutes);
app.use("/api/admin", adminRoute);
app.use("/api/head", headRoute);
app.use("/api/voter", voterRoutes);
app.use("/api/election",electionRoutes);
app.use("/api/results",resultsRouter);


// Start server
app.listen(3000, () => console.log("Server started on http://localhost:3000"));
