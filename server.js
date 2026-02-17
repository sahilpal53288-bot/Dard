const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));

let users = {};

// Register
app.post("/register", (req, res) => {
  const { username } = req.body;
  if (users[username]) {
    return res.json({ message: "User already exists" });
  }
  users[username] = { wallet: 1000 };
  res.json({ message: "Registered", wallet: 1000 });
});

// Play Game (Number Guess 1-5)
app.post("/play", (req, res) => {
  const { username, number, bet } = req.body;

  if (!users[username]) {
    return res.json({ message: "User not found" });
  }

  if (users[username].wallet < bet) {
    return res.json({ message: "Low balance" });
  }

  const result = Math.floor(Math.random() * 5) + 1;

  if (number == result) {
    users[username].wallet += bet;
  } else {
    users[username].wallet -= bet;
  }

  res.json({
    result,
    wallet: users[username].wallet
  });
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
