import "dotenv/config";
import express from "express";
import cors from "cors";

const app = express();

const PORT = process.env.PORT ?? 3000;
const FRONTEND_URL = process.env.FRONTEND_URL ?? "http://localhost:5173";

app.use(cors({ origin: FRONTEND_URL }));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Bank API running"
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
