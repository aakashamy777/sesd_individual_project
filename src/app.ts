import express from "express";
import cors from "cors";
import routes from "./routes";
import { errorHandler } from "./middleware/error-handler";
import { notFoundHandler } from "./middleware/not-found";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/test", (req, res) => {
    res.json({ message: "Backend is running!", time: new Date().toISOString() });
});

app.use((req, res, next) => {
    console.log(`[BACKEND-LOG] ${req.method} ${req.url}`);
    next();
});

app.use("/api/v1", routes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
