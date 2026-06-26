require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const aiRoutes = require("./routes/aiRoutes");
const bookRoutes = require("./routes/bookRoutes");
const exportRoutes = require("./routes/exportRoutes");

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

connectDB();

app.use(express.json());

//upload folder is private so this express.static makes it public accessible, so that frontend can use it.
app.use("/backend/uploads", express.static(path.join(__dirname, "uploads")));

//Routes here
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/ai", aiRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`server running on port ${PORT}`));
