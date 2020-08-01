const express = require('express')
const passport =require('passport')
const router = express.Router()

// auth with google
router.get('/google', passport.authenticate('google', {scope : ['profile']})  
)

// callback
router.get('/google/callback', passport.authenticate('google', {failureRedirect: '/'}), (req,res) => {
    // Successful authentication, redirect dashoboard.
    res.redirect('/dashboard')
})

// logout user
router.get('/logout', (req,res) => {
    req.logout()
    res.redirect('/')
})

module.exports  = router