const express = require("express");
// const res = require("express/lib/response");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const {fetchuser} = require("../middleware/fetchuser");

const JWT_SECRET="hereismysecret"

// creating a user using :POST "/api/auth/createuser". No login required
router.post("/createuser",[body('name',"Name must be atleast 3 character").isLength({ min: 3 }),body('email',"Enter a valid email").isEmail(),body('password',"Password must be atleast 5 characters").isLength({ min: 5 })], async (req, res) => {
// If there are errors, return bad request and the errors
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Check whether the user with this email exists already
    try {
        let user=await  User.findOne({email:req.body.email});
        if(user){
            return res.status(400).json({error:"Sorry user with email already exists"})
        }

      let salt = await bcrypt.genSalt(10);
let secpassword = await bcrypt.hash(req.body.password, salt);
console.log(secpassword)
    
      user= await User.create({
            name: req.body.name,
            email: req.body.email,
            password:secpassword,
            role:'basic'
          })
         const data={
             user:{
                 id:user.id,
                 role:user.role
             }
         }
          const authToken=jwt.sign(data,JWT_SECRET);
        //   console.log(jwtData);
          res.json(authToken);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some internal server error occured");
    }
   
    });

    // Authenticate a user using /api/auth/login .No login required
    router.post("/login",[body("email","Enter a valid email").isEmail(),
        body("password","Passowrd can't be black").exists(),
], async (req,res)=>{
// If there are errors, return bad request and the errors
const errors = validationResult(req);
if (!errors.isEmpty()) {
  return res.status(400).json({ errors: errors.array() });
}
const {email,password}=req.body;
try {
    let user= await User.findOne({email});
    if(!user)
    return res.status(400).json({error:"Please enter valid credentials"});

    const passwordCompare= await bcrypt.compare(password,user.password);
    if(!passwordCompare)
    return res.status(400).json({error:"Please enter valid credentials"});

    const data={
        user:{
            id:user.id,
            role:user.role
        }
    }
     const authToken=jwt.sign(data,JWT_SECRET);
   //   console.log(jwtData);
     res.json(authToken);

} catch (error) {
    console.error(error.message);
    res.status(500).send("Some internal server error occured");
}

})


// Route 3: get login user details using :POST "/api/auth/getuser". Login required

router.post("/getuser",fetchuser, async (req,res)=>{
try {
   const userId=req.user.id;
  //  console.log(userId+" "+req.user);
    const user=await User.findById(userId).select("-password")
    res.send(user);
} catch (error) {
    console.error(error.message);
    res.status(500).send("Some internal server error occured");
}
})

module.exports = router;
