const express = require('express')
const { ensureAuth, ensureGuest } = require('../middleware/auth')
const router = express.Router()
const Story = require('../models/Story')
// login page
router.get('/', ensureGuest, (req,res)=>{
    res.render('login', {
        layout:'login',
    })
})

// dashboard page

router.get('/dashboard', ensureAuth, async (req,res)=>{
    console.log(req.user)

    try {
        const stories = await Story.find({user: req.user.id}).lean()
        res.render('dashboard', {
            displayName: req.user.displayName,
            stories
        })
    } catch (error) {
       console.log(error) 
       res.render('error/500')
    }
   
})
module.exports  = router