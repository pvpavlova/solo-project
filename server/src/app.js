require("dotenv").config();
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();

const cors = require("cors");
const usersRouter = require("../src/router/users.router");
const notesRouter = require("../src/router/notes.router");
const metersRouter = require("../src/router/meters.router");
const incomesRouter = require("../src/router/incomes.router");
const expensesRouter = require("../src/router/expenses.router");
const paymentsRouter = require("../src/router/payments.router");
const { getTime, removeXPoweredBy } = require("../src/middleware/common");
const tokenRouter = require("./router/token.router");
const authRouter = require("./router/auth.router");

const corsConfig = {
  origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
  credentials: true,
};
app.use(cors(corsConfig));
const { PORT } = process.env;
app.use(cookieParser());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(getTime);
app.use(removeXPoweredBy);

app.get("/api/tokens/refresh", (req, res) => {
  res.send({ message: "Token refreshed!" });
});
app.use("/api/tokens", tokenRouter);
app.use("/api/auth", authRouter);
app.use("/api/v1.0/users", usersRouter);
app.use("/api/v1.0/notes", notesRouter);
app.use("/api/v1.0/meters", metersRouter);
app.use("/api/v1.0/incomes", incomesRouter);
app.use("/api/v1.0/expenses", expensesRouter);
app.use("/api/v1.0/payments", paymentsRouter);
app.get("*", (req, res) => {
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log(`Server started at ${PORT} port`);
});
