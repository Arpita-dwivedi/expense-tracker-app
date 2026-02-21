const path = require("path");
require('dotenv').config({path: path.join(__dirname, '.env')});

const express = require("express");
const cors = require("cors");
const compression = require("compression");
const morgan = require("morgan");
const fs = require("fs");
const sequelize = require("./utils/database");
const userRoutes = require("./routes/userRoute");
const expenseRoutes = require("./routes/expenseRoute");
const orderRoutes = require("./routes/orderRoutes");
const leaderboardRoutes = require("./routes/leaderboardRoute");
const aiRoutes = require("./routes/aiRoute");
require("./models/association");
const app = express();

const logsDir = path.join(__dirname, "logs");
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
}

const MAX_LOG_SIZE = 5 * 1024 * 1024; 
const accessLogPath = path.join(logsDir, "access.log");

function rotateLogIfNeeded() {
    try {
        const stats = fs.statSync(accessLogPath);
        if (stats.size > MAX_LOG_SIZE) {
            const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
            const archivedLogPath = path.join(logsDir, `access-${timestamp}.log`);
            fs.renameSync(accessLogPath, archivedLogPath);
            console.log(`Log rotated to: ${archivedLogPath}`);
            
            accessLogStream.end();
            accessLogStream = fs.createWriteStream(accessLogPath, { flags: 'a' });
        }
    } catch (err) {
        console.error("Log rotation error:", err.message);
    }
}

setInterval(rotateLogIfNeeded, 60 * 60 * 1000);

let accessLogStream = fs.createWriteStream(accessLogPath, { flags: 'a' });

const loggerStream = {
    write: (message) => {
        accessLogStream.write(message);
        process.stdout.write(message);
    }
};

app.use(compression());
app.use(morgan("combined", { stream: loggerStream }));
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "../public"))); 

app.use("/api/users", userRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/ai", aiRoutes);

sequelize.sync().then(() => {
    app.listen(process.env.PORT, () => console.log(`server is running on http://localhost:${process.env.PORT}`));
});
