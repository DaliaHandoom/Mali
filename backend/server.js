const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", function (req, res) {
  res.send("Mali backend is running");
});

app.listen(3000, function () {
  console.log("Server is running on http://localhost:3000");
});