import "dotenv/config";
import express, { json } from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "~/swagger.json";
import routes from "./routes";
import errorHandler from "./shared/exceptions/errorHandler";
import middlewares from "./shared/middlewares";

const app = express();

app.use(json());
app.use(cors());

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/user", routes.userRouter);
app.use("/auth", routes.authRouter);
app.use("/service", middlewares.authMiddleware, routes.serviceRouter);

app.use(errorHandler);

app.listen("3333", () => {
  console.log("API rodando na porta 3333");
});
