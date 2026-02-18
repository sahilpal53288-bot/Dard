const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));

let users = [];
const admin = { username:"admin", password:"1234" };

// Admin login
app.post("/admin-login", (req,res)=>{
  const { username, password } = req.body;
  res.json({ success: username===admin.username && password===admin.password });
});

// Create user
app.post("/create-user", (req,res)=>{
  const { username, password } = req.body;
  if(!username || !password) return res.json({ message:"Enter username & password" });
  if(users.find(u=>u.username===username)) return res.json({ message:"User exists" });
  users.push({ username, password, wallet:1000 });
  res.json({ message:"User created" });
});

// User registration
app.post("/register", (req,res)=>{
  const { username, password } = req.body;
  if(!username || !password) return res.json({ message:"Enter username & password" });
  if(users.find(u=>u.username===username)) return res.json({ message:"User exists" });
  users.push({ username, password, wallet:1000 });
  res.json({ message:"Registered", wallet:1000 });
});

// User login
app.post("/user-login", (req,res)=>{
  const { username, password } = req.body;
  const user = users.find(u=>u.username===username && u.password===password);
  if(user) res.json({ success:true, wallet:user.wallet });
  else res.json({ success:false });
});

// Update wallet
app.post("/update-wallet", (req,res)=>{
  const { username, amount } = req.body;
  const user = users.find(u=>u.username===username);
  if(!user) return res.json({ message:"User not found" });
  user.wallet += Number(amount);
  res.json({ message:"Wallet updated", wallet:user.wallet });
});

// Get all users
app.get("/users", (req,res)=> res.json(users));

/* -------------------------
        Game APIs
------------------------- */

// Wingo
app.post("/api/wingo-play", (req,res)=>{
  const { username, bet, guess } = req.body;
  const user = users.find(u=>u.username===username);
  if(!user) return res.json({ success:false, message:"User not found" });
  if(user.wallet < bet) return res.json({ success:false, message:"Low balance" });

  const result = Math.floor(Math.random()*50)+1;
  let win = false;

  if(guess === result){
    user.wallet += bet*2;
    win = true;
  } else user.wallet -= bet;

  res.json({ success:true, result, win, wallet:user.wallet });
});

// Slot
app.post("/api/slot-play", (req,res)=>{
  const { username, bet } = req.body;
  const user = users.find(u=>u.username===username);
  if(!user) return res.json({ success:false, message:"User not found" });
  if(user.wallet < bet) return res.json({ success:false, message:"Low balance" });

  const spin = Math.floor(Math.random()*100);
  let win = false;
  if(spin > 50){ user.wallet += bet*1.5; win=true; }
  else user.wallet -= bet;

  res.json({ success:true, spin, win, wallet:user.wallet });
});

// Avatar
app.post("/api/avatar-play", (req,res)=>{
  const { username, bet } = req.body;
  const user = users.find(u=>u.username===username);
  if(!user) return res.json({ success:false, message:"User not found" });
  if(user.wallet < bet) return res.json({ success:false, message:"Low balance" });

  const roll = Math.floor(Math.random()*6)+1;
  let win = roll===6;
  if(win) user.wallet += bet*3;
  else user.wallet -= bet;

  res.json({ success:true, roll, win, wallet:user.wallet });
});

app.listen(PORT, ()=>console.log("Server running on port "+PORT));
