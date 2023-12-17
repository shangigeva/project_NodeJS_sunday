import configDotEnv from "./config";
import express, { json } from "express";
import { logger } from "./middleware/logger";
import { notFound } from "./middleware/not-found";
import { usersRouter } from "./routes/users";
import { connect } from "./database/connection";
import { errorHandler } from "./middleware/error-handler";

configDotEnv();
connect();

const app = express();

//localhost:8080/foo.html
app.use(express.static("public"));
// middleware chain:
app.use(json());
app.use(logger);
app.use("/api/v1/users", usersRouter); //next(err)
app.use(errorHandler);
app.use(notFound);

app.listen(8080);
