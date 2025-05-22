require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");

const userRoutes = require("./routes/userRoutes.js");
const transactionRoutes = require("./routes/transactionRoutes.js");

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000", 
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use("/api/users", userRoutes);
app.use("/api/transactions", transactionRoutes);

module.exports = app;
