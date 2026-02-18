const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));

let users = [];
let admin = { username: "admin", password: "1234" };

// Register
app.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (users.find(u => u.username === username)) {
    return res.json({ message: "User already exists" });
  }

  users.push({ username, password, wallet: 1000 });
  res.json({ message: "Registered", wallet: 1000 });
});

// Login
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const user = users.find(
    u => u.username === username && u.password === password
  );

  if (!user) return res.json({ message: "Invalid login" });

  res.json({ message: "Login success", wallet: user.wallet });
});

// Play Game
app.post("/play", (req, res) => {
  const { username, bet, number } = req.body;
  const user = users.find(u => u.username === username);

  if (!user) return res.json({ message: "User not found" });
  if (user.wallet < bet) return res.json({ message: "Not enough balance" });

  const random = Math.floor(Math.random() * 5) + 1;

  if (random === number) {
    user.wallet += bet;
    res.json({ message: "You Win!", wallet: user.wallet });
  } else {
    user.wallet -= bet;
    res.json({ message: "You Lose!", wallet: user.wallet });
  }
});

// Admin Login
app.post("/admin-login", (req, res) => {
  const { username, password } = req.body;

  if (username === admin.username && password === admin.password) {
    res.json({ message: "Admin login success", users });
  } else {
    res.json({ message: "Wrong admin login" });
  }
});

app.listen(PORT, () => console.log("Server running"));
// Get all users
app.get("/users", (req, res) => {
  res.json(users);
});

// Update wallet
app.post("/update-wallet", (req, res) => {
  const { username, amount } = req.body;

  const user = users.find(u => u.username === username);
  if (!user) return res.json({ message: "User not found" });

  user.wallet += Number(amount);
  res.json({ message: "Wallet updated", wallet: user.wallet });
});
let admin = { username: "admin", password: "1234" };
let adminLoggedIn = false;

// Admin login
app.post("/admin-login", (req, res) => {
  const { username, password } = req.body;

  if (username === admin.username && password === admin.password) {
    adminLoggedIn = true;
    res.json({ message: "Admin login success" });
  } else {
    res.json({ message: "Invalid admin login" });
  }
});
