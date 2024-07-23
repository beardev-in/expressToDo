import "./utils/loadEnv.js";
import "./utils/dbConnect.js";
import express from "express";
import { sessionsMiddleware } from "./utils/sessions.js";
import homeRouter from "./routes/homeRouter.js";
import tasksRouter from "./routes/tasksRouter.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from 'url';
const app = express();
const port = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/user-profiles', express.static(path.join(__dirname, 'uploads')));
app.use(cors());
app.use(sessionsMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get('/', (req, res) => {
    res.send('dummy express app');
});
app.use('/api/user', homeRouter);
app.use('/api/tasks', tasksRouter);
app.listen(port, () => {
    console.log(`server running on port ${port} `);
});
