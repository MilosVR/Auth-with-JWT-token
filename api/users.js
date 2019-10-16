const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator/check')
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserModel = require('../models/Users')

// @route       api/users
// @dec         Register user
// @access      Public
router.post('/', 
[  
  check('name', 'Name is required').not().isEmpty(),    
  check('email','Please enter your email').isEmail(),
  check('password','Please enter your password').isLength({ min: 6 })
], 
(req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  UserModel.findOne({email : req.body.email})
    .then((user)=> {
  
      if(user) {
        return res.status(400).json({ errors : [{ msg : "User already exists" }] });
      }
      const avatar = gravatar.url(req.body.email,{
        s:'200',
        r:'pg',
        d:'mm'
      })
      //Creating user instance
      user = new UserModel({
        name:req.body.name,
        email:req.body.email,
        password:req.body.password,
        avatar
      })
      bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(user.password, salt, function(err, hash) {
            if(err) throw err;
            user.password = hash;
            user.save()
        });
      });
      //get monggo id for user
      const payload = {user:{id:user.id}};
      jwt.sign(
        payload, 
        require('../config/secret').jwtSecret, 
        { expiresIn: 360000 }, 
        (err, token) => {
        if(err) throw err;
        res.json({ token })
      });
    })
    .catch(err => {
      console.log(err.message)
      res.status(500).send('Server error')
    })

    
})

module.exports = router