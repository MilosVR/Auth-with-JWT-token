const express = require('express')
const router = express.Router()
const auth = require('../middleware/middleware')

const { check, validationResult } = require('express-validator');

const Profile = require('../models/Profile')
const User = require('../models/Users')

// @route       GET api/profile/me
// @dec         Get current user profile
// @access      Private
router.get('/me', auth , ( req, res ) => {

    Profile.findOne({user: req.user.id})
        .populate('user',['name','avatar'])
        .then(profile => {
            if (!profile) {
                return res.status(400).send({ msg: "There is no profile for this user" })
            }
            res.json(profile)
        })
        .catch(err => {
            return res.status(500).send('Server Error')
        })
})

// @route       POST api/profile
// @dec         Create and Update user profile
// @access      Private
router.post('/', [ auth, [
    check('status', "Status is required").not().isEmpty(),
    check('skills', "Skills is required").not().isEmpty(),
]], 
    (req,res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }  
    const profileFields = {}
    profileFields.user = req.user.id;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.location) profileFields.location = req.body.location
    if (req.body.status) profileFields.status = req.body.status
    if (req.body.githubusername) profileFields.githubusername = req.body.githubusername
    if (req.body.bio) profileFields.bio = req.body.bio

    if (req.body.skills) {
        profileFields.skills = req.body.skills.split(',').map(skill => skill.trim())
    }

    //social newtworks object 
    profileFields.social = {} //If we dont init social obj, it throw an error
    if (req.body.youtube) profileFields.youtube = req.body.youtube;
    if (req.body.instagram) profileFields.instagram = req.body.instagram;
    if (req.body.facebook) profileFields.facebook = req.body.facebook;
    if (req.body.twitter) profileFields.twitter = req.body.twitter;
    if (req.body.linkedin) profileFields.linkedin = req.body.linkedin;

    Profile.findOne({user : req.user.id})
        .then(profile => {
            //Update Profile
            if (profile) {
                Profile.findOneAndUpdate(
                    { user : req.user.id },
                    { $set:profileFields },
                    { new : true }
                )
                .then(updateProfile => {
                    return res.json(updateProfile)
                })
            }
            //Create new Profile
            else{
                profile = new Profile(profileFields)
                profile.save()
            }
        })
        .catch(err => {
            console.log(err.message)
            res.status(500).send('Server error')
        })

})

// @route       GET api/profile
// @dec         Get all user profiles
// @access      Public
router.get('/', ( req, res )=> {
    Profile.find()
    .populate('user',['name','avatar'])
        .then(profiles => {
            res.json(profiles)
        })
        .catch(err => {
            console.log(err.message)
            res.status(500).send('Server error')
        })
})

// @route       GET api/profile/user/:user_id
// @dec         Get profile by user ID
// @access      Public
router.get('/user/:user_id', ( req, res )=> {
    Profile.findOne({user:req.params.user_id})
    .populate('user',['name','avatar'])
        .then(profile => {
            if (!profile) {
                return res.status(400).json({ msg:"Profile not found" })
            }
            res.json(profile)
        })
        .catch(err => {
            if (err.kind == "ObjectId"){
                return res.status(400).json({
                    msg:"Profile not found"
                })
            }
            res.status(500).send('Server error')
        })
})

// @route       DELETE api/profile
// @dec         Delete profile, user & post
// @access      Private
    router.delete('/', auth, ( req, res )=> {
    //Remove profile
    Profile.findOneAndRemove({user:req.user.id})
        .then(() => {
            return res.json({ msg: 'User removed' })
        })
        .catch(err => {
            console.log(err.message)
            return res.status(500).send('Server error')
        })
    //Remove user    
    User.findOneAndRemove({_id:req.user.id})
        .then(() => {
            return res.json({ msg: 'User removed' })
        })
        .catch(err => {
            console.log(err.message)
            return res.status(500).send('Server error')
        })
})

// @route       PUT api/profile/experience
// @dec         Add Profile experience
// @access      Private
router.put('/experience', [ auth, [
    check('company', "Company is required").not().isEmpty(),
    check('title', "Title is required").not().isEmpty(),
    check('location', "Location is required").not().isEmpty(),
    check('from', "From date is required").not().isEmpty(),
]], 
    (req,res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
    const newExp = {
        title : req.body.title,
        company : req.body.company,
        location : req.body.location,
        from : req.body.from,
        to : req.body.to,
        current : req.body.current,
        description : req.body.description
    }
    Profile.findOne({ user:req.user.id })
        .then((profile) => {
            profile.experience.push(newExp)
            profile.save()
            res.json(profile)
        })
        .catch(err => {
            console.log(err.message)
            return res.status(500).send('Server error')
        })
})


module.exports = router