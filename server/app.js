require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 3000;


const connectDB = require("./config/mongooseConnection");

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174','https://voterrawjet.onrender.com','https://adminrawjet.onrender.com'],
  credentials: true
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));




const headLoginRoutes = require("./routes/headLogin");
const adminLoginRoutes = require("./routes/adminLogin");
const adminRoute = require("./routes/candidate");
const headRoute = require("./routes/head");
const voterRoutes = require('./routes/voter');
const electionRoutes = require('./routes/election');
const resultsRouter = require('./routes/results');
const electionManagementRoutes = require('./routes/electionManagement');
const constituencyRoutes = require('./routes/constituencies');

app.use("/api/headLogin", headLoginRoutes);
app.use("/api/adminLogin", adminLoginRoutes);
app.use("/api/admin", adminRoute);
app.use("/api/head", headRoute);
app.use("/api/voter", voterRoutes);
app.use("/api/election",electionRoutes);
app.use("/api/results",resultsRouter);
app.use('/api/head/elections', electionManagementRoutes);
app.use(['/api/constituencies', '/constituencies'], constituencyRoutes);


connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on PORT ${PORT}`);
  });
});

// app.get('/*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
// });
// Start server


