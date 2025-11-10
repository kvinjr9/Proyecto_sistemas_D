"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const data_source_1 = require("./data-source");
const auth_1 = __importDefault(require("./routes/auth"));
const weather_1 = __importDefault(require("./routes/weather"));
dotenv_1.default.config();
const PORT = Number(process.env.PORT || 3001);
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
data_source_1.AppDataSource.initialize()
    .then(() => {
    console.log("DataSource initialized");
    app.use("/api", auth_1.default);
    app.use("/api", weather_1.default);
    app.get("/health", (req, res) => res.json({ ok: true }));
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
    .catch((err) => {
    console.error("Error initializing DataSource", err);
    process.exit(1);
});
