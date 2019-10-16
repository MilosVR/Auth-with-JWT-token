const express = require('express')
const router = express.Router()
const auth = require('../middleware/middleware')
const UserModel = require('../models/Users')
const { check, validationResult } = require('express-validator/check')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// @route       api/users
// @dec         test
// @access      Public
router.get('/', auth ,( req, res ) => {
    
    UserModel.findById(req.user.id)
        .then(user => res.json(user))
        .catch (err => {
            console.log(err.message)
            res.status(500).send('Serve Error')
        })
})

// @route       api/auth
// @dec         Authentication user and get token
// @access      Public

router.post('/', 
[   
  check('email','Please enter your email').isEmail(),
  check('password','Password is required').exists()
], 
(req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  UserModel.findOne({email : req.body.email})
    .then((user)=> {
      
      if(!user) {
        return res.status(400).json({ errors : [{ msg : "Invalid credentials" }] });
      }
      
      bcrypt.compare(req.body.password, user.password)
        .then(isMatch => {
            if (isMatch) {
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
            }else{
                return res.status(400).json({ 
                    errors: [{ msg : "Invalid credentials" }]
                })
            }
        })

      
    })
    .catch(err => {
      console.log(err.message)
      res.status(500).send('Server error')
    })

    
})

module.exports = router