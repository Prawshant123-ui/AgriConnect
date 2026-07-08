const express = require("express");
const cors = require("cors");
const helmet  = require("helmet");
const morgan  = require("morgan");

const authRoutes = require("./routes/authRoute");
const farmRoutes = require("./routes/farmRoute");
const cropRoutes = require("./routes/cropRoute");
const scanRoutes = require("./routes/scanRoute");
const diseaseRoutes = require("./routes/diseaseRoute");

const app = express();
app.use(helmet());

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/farms", farmRoutes);
app.use("/api/crops", cropRoutes);
app.use("/api/scans", scanRoutes);
app.use("/api/diseases", diseaseRoutes);

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

module.exports = app;