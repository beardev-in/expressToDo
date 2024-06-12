import "./utils/loadEnv.js" 
import "./utils/dbConnect.js"
import express from "express"
import {sessionsMiddleware} from "./utils/sessions.js";
import homeRouter from "./routes/homeRouter.js"
import tasksRouter from "./routes/tasksRouter.js"

const app = express();

const port = process.env.PORT || 3000;

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
