const express = require("express");
const User = require("../models/User");

console.log("USER ROUTES FILE LOADED");


const router = express.Router();

router.post("/", async (req,res)=>{
    console.log("POST /users HIT");
      console.log("BODY:", req.body);
  const user = await User.create(req.body);
  res.json(user)
});

router.get("/", async (req,res)=>{
  const user = await User.findAll();
  res.json(user)
});

router.put("/:id", async (req,res)=>{
  const {id} = req.params;
  const user = await User.update(req.body,{where : {id}});
  res.json({message:"User Updated"})
});

try {
router.delete("/:id", async (req,res)=>{
  const {id} = req.params;
  const user = await User.destroy({where : {id}});
  res.json({message:"User Deleted"})
})
 }
 catch(err){
  console.error("Error deleting user:",err.message)
  res.status(500).json({message:"Failed to delete user. Please try again."})
 }

module.exports = router;