const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));

let users = [];
const admin = { username: "admin", password: "1234" };

app.post("/admin-login", (req, res) => {
  const { username, password } = req.body;
  if (username === admin.username && password === admin.password) res.json({ success: true });
  else res.json({ success: false });
});

app.post("/create-user", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.json({ message: "Enter username & password" });
  if (users.find(u => u.username === username)) return res.json({ message: "User already exists" });
  users.push({ username, password, wallet: 1000 });
  res.json({ message: "User created successfully" });
});

app.get("/users", (req, res) => res.json(users));

app.post("/update-wallet", (req, res) => {
  const { username, amount } = req.body;
  const user = users.find(u => u.username === username);
  if (!user) return res.json({ message: "User not found" });
  user.wallet += Number(amount);
  res.json({ message: "Wallet updated", wallet: user.wallet });
});

app.listen(PORT, () => console.log("Server running on port " + PORT));
// Play Wingo
app.post("/api/wingo-play", (req, res) => {
  const { username, bet, guess } = req.body;

  const user = users.find(u => u.username === username);
  if (!user) return res.json({ success: false, message: "User not found" });
  if (user.wallet < bet) return res.json({ success: false, message: "Insufficient balance" });

  const result = Math.floor(Math.random() * 50) + 1;

  let win = false;
  if (guess === result) {
    user.wallet += bet * 2; // Win multiplier = 2x
    win = true;
  } else {
    user.wallet -= bet;
  }

  res.json({
    success: true,
    result,
    win,
    wallet: user.wallet
  });
});
// Slot Game
app.post("/api/slot-play", (req,res)=>{
  const { username, bet } = req.body;
  const user = users.find(u => u.username === username);
  if(!user) return res.json({success:false, message:"User not found"});
  if(user.wallet < bet) return res.json({success:false, message:"Low balance"});

  const result = Math.floor(Math.random()*100);
  let win = false;

  if(result > 50){ 
    user.wallet += bet*1.5;
    win = true;
  } else {
    user.wallet -= bet;
  }

  res.json({success:true, win, result, wallet:user.wallet});
});
