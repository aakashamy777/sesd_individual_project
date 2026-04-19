import express from "express";
import cors from "cors";
import routes from "./routes";
import { errorHandler } from "./middleware/error-handler";
import { notFoundHandler } from "./middleware/not-found";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/v1", routes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
