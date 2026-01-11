const express = require("express");
const cors = require("cors");
const path = require("path");
const sequelize = require("./utils/database");
const userRoutes = require("./routes/userRoute");

const app = express();

app.use(cors());
app.use(express.json());

// --- FRONTEND STATIC FILES ---
app.use(express.static(path.join(__dirname, "public"))); 

// API routes
app.use("/api/users", userRoutes);

// DB sync + server start
sequelize.sync().then(() => {
    app.listen(3000, () => console.log("Server running on http://localhost:3000"));
});
