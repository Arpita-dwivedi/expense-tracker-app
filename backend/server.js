const express = require("express");
const cors = require("cors");
const path = require("path");
const sequelize = require("./utils/database");
const userRoutes = require("./routes/userRoute");
const expenseRoutes = require("./routes/expenseRoute");
const orderRoutes = require("./routes/orderRoutes");
const leaderboardRoutes = require("./routes/leaderboardRoute");
const aiRoutes = require("./routes/aiRoute");
require("./models/association");
require('dotenv').config({path: path.join(__dirname, '.env')});

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "../public"))); 



app.use("/api/users", userRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/ai", aiRoutes);

sequelize.sync().then(() => {
    app.listen(3000, () => console.log("Server running on http://localhost:3000"));
});
