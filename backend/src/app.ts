import express, { json } from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "~/swagger.json";

const app = express();

app.use(json());
app.use(cors());

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen("3333", () => {
  console.log("API rodando na porta 3333");
});
