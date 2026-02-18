const express = require("express");
const app = express();
const path = require("path");

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

let users = [];

app.post("/api/register", (req, res) => {
  const { username, password } = req.body;
  users.push({ username, password });
  res.json({ message: "User registered successfully" });
});

app.get("/api/users", (req, res) => {
  res.json(users);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
