import express from 'express';
import "dotenv/config";
import cors from "cors";
import { router as apiRouter } from "./routers/index.js";

const app = express();
console.log(process.env.PORT)

app.use(cors("*"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", apiRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 Server started at http://localhost:${port}`);
});
