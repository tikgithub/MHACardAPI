var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
require('dotenv').config();
var userService = require("../Service/userService");


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/sign',async function(req,res){
  const accessTokenSecret = process.env.API_SECERT_KEY;

  //const {email,password} = req.body;
  const user = await userService.findUser(req.body.email, req.body.password);
  console.log(user);
  if(user.length > 0){
    let accessToken = jwt.sign({username:req.body.email},accessTokenSecret,{ expiresIn: '20m' });
    res.send({'token':accessToken});
  }else{
    res.send({"Message":"Username Or Password not correct"});
  }
  
});



module.exports = router;
