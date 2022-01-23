const req = require("express/lib/request");
const res = require("express/lib/response");
let jwt=require("jsonwebtoken");
const JWT_SECRET="hereismysecret"
const userData={};

const fetchuser = (req, res, next) => {
    // Get the user from the jwt token and add id to req object
    const token = req.header('auth-token');
    if (!token) {
        res.status(401).send({ error: "Please authenticate using a valid token" })
    }
    try {
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user;
        // userData=req.user;
        // console.log(req.user);
        next();
    } catch (error) {
        res.status(401).send({ error: "Please authenticate using a valid token" })
    }
}

 
  
    function authRole(role) {
        // console.log(userData)
        return (req, res, next) => {
          if (req.user.role !== role) {
            res.status(401)
            return res.send('Not allowed')
          }
      
          next()
        }
      }
      






module.exports = {fetchuser,authRole};