const express = require("express");
const connectDB = require("./src/config/db");
const dotenv = require("dotenv");
const errorCodes = require("./src/utils/error-codes");
const userRoutes = require("./src/routes/user.routes");
const {
  ValidationError,
  UnAuthorisedError,
  NotFoundError,
  ConflictError,
} = require("./src/utils/custom-error");

const app = express();
const port = 4000;
dotenv.config();

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", userRoutes);

app.use((err, req, res, next) => {
  if (err instanceof ValidationError) {
    res.status(400).json({ error: err.message, code: err.code });
  } else if (err instanceof UnAuthorisedError) {
    res.status(401).json({ error: err.message, code: err.code });
  } else if (err instanceof NotFoundError) {
    res.status(404).json({ error: err.message, code: err.code });
  } else if (err instanceof ConflictError) {
    res.status(409).json({ error: err.message, code: err.code });
  } else {
    console.log(err, "err");
    res.status(500).json({
      error: "Internal Server Error",
      code: "INTERNAL_SERVER_ERROR",
    });
  }
});

app.use("*", function (req, res) {
  res
    .status(404)
    .json({ error: "Route does not Exist", code: errorCodes.ROUTE_NOT_FOUND });
});

app.listen(port, (err) => {
  if (err) {
    return console.log("Something bad happened", err);
  }
  console.log(`Server is listening on ${port}`);
});
