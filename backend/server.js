const connectDB = require("./config/db");
const cors = require("cors");
const express = require("express");
const app = require("express")();
const PORT = process.env.PORT || 5000;
app.use(express.json({ extended: false }));
app.use(cors({ credentials: true, origin: "*" }));

connectDB();

app.get("/", (req, res) => {
  res.send("API running");
});

app.use("/api/auth", require("./routes/api/auth"));

app.listen(PORT, () => {
  console.log(`Server started on ${PORT}`);
});
