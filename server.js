app.post("/login", (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.json({ success: false, message: "Enter username" });
  }

  let user = users.find(u => u.username === username);

  if (!user) {
    // 👇 user automatic create
    user = { username, wallet: 1000 };
    users.push(user);
  }

  res.json({ success: true, wallet: user.wallet });
});
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/dashboard.html");
});
