const express = require("express");
const cors = require("cors")
const sequelize = require("./config/database");
const User = require("./models/User");
const userRoutes = require("./routes/userRoutes");

console.log("index file is running");

const app = express();
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log("REQUEST:", req.method, req.url);
  next();
});


app.use("/users",userRoutes);

app.get("/",(req,res)=>{
  res.send("Backend is running")
});

// sequelize.authenticate()
// .then(()=>console.log("MySQL connected successfully"))
// .catch(err => console.error("Error connecting to MySQL",err));

sequelize.authenticate()
.then(()=>sequelize.sync())
.then(()=>console.log("Database is synced successfully"))
.catch(err => console.error("Error creating tables",err));

app.listen(5001,()=>console.log("Server is running on port 5001"))