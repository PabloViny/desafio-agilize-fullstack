import "dotenv/config";
import express from "express";
import cors from "cors";
import accountRoutes from "./routes/accountRoutes";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();
const PORT = process.env.PORT ?? 3000;
const FRONTEND_URL = process.env.FRONTEND_URL ?? "http://localhost:5173";

// Middlewares globais
app.use(cors({ origin: FRONTEND_URL }));
app.use(express.json());

// Rota de health check / índice
app.get("/", (_, res) => {
  res.json({
    status: "ok",
    endpoints: [
      "GET  /accounts",
      "GET  /accounts/:id",
      "POST /accounts/:id/withdraw",
      "POST /transfer",
    ],
  });
});

// Rotas
app.use("/", accountRoutes);

// Tratamento de erros (deve ser o último middleware)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
