require("dotenv").config();
const express = require("express");
require("./db");
var cors = require("cors");

const app = express();

app.use(cors({ origin: "http://localhost:3000" }));

// add middleware for sending json
app.use(express.json());

//Available routes
app.use("/api/auth", require("./routes/auth"));

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).json({ error: err.message });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Port is listining on " + PORT);
});
