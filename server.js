const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

// Home Route
app.get("/", (req, res) => {
  res.send("Website Live Ho Gayi 🚀");
});

// Start Server
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
