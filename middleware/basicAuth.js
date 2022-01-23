const {userData}=require('./fetchuser')
const {ROLE} =require("../data")
function authUser(req, res, next) {
    if (req.user == null) {
      res.status(403)
      return res.send('You need to sign in')
    }
  
    next()
  }
  
  function authRole(user) {
      console.log(user.role+"=="+ROLE.ADMIN);
      return (
        user.role === ROLE.ADMIN
      )
  }
  
  module.exports = {
    authRole
  }