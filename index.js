import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;
const db= new pg.Client({
  host: "localhost",
  port: 5433,
  password:"Jun23135",
  user:"postgres",
  database:"secrets"
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.post("/register", async (req, res) => {
  const email= req.body.username;
  const password = req.body.password;
  try{
    const checkResult= await db.query("SELECT * FROM users WHERE email= $1", [email]);
    if (checkResult.rows.length>0){
      res.render("register.ejs", {error: "Email already exists"});
    }else{
      const result= await db.query("INSERT INTO users(email, password) VALUES($1,$2)",[email,password]);
      res.render("secrets.ejs");
    }
  }catch(error){
    console.log(error);
  }
  
  
});

app.post("/login", async (req, res) => {
  const username= req.body.username;
  const password = req.body.password;
  try{
    const checkResult= await db.query("SELECT * FROM users WHERE email= $1", [username,]);
    if (checkResult.rows.length >0){
      const user= checkResult.rows[0];
      const storedPass= user.password;
      if (storedPass===password){
        res.render("secrets.ejs");
      }else{
        res.render("login.ejs", {error: "Incorrect password"});
      }
    }else{
      res.render("login.ejs", {error: "You haven't registered"});
    }
  }catch(error){
    console.log(error);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
