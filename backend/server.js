const express = require("express");
const cors = require("cors");
const path = require("path");
const sequelize = require("./utils/database");
const userRoutes = require("./routes/userRoute");
const expenseRoutes = require("./routes/expenseRoute");
require("./models/association"); // Require associations to set them up

const app = express();

app.use(cors());
app.use(express.json());

// --- FRONTEND STATIC FILES ---
app.use(express.static(path.join(__dirname, "../public"))); 


// API routes
app.use("/api/users", userRoutes);
app.use("/api/expenses", expenseRoutes);

// DB sync + server start
sequelize.sync().then(() => {
    app.listen(3000, () => console.log("Server running on http://localhost:3000"));
});
