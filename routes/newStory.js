const express = require('express')
const { ensureAuth } = require('../middleware/auth')
const router = express.Router()
const Story = require('../models/Story')


// add story page
router.get('/add', ensureAuth, (req,res)=>{
    res.render('stories/add')
})



router.post('/', ensureAuth, async (req,res) => {
    try {
        req.body.user = req.user.id
        await Story.create(req.body)
        res.redirect('/dashboard')
    } catch (error) {
        console.log(error)
        res.render('error/500')
    }
})

// show stories
router.get('/', ensureAuth, async (req,res)=>{
    try {
        const stories = await Story.find({status: 'public'})
            .populate('user')
            .sort({createdAt: 'desc'})   // how to sort it ascending / descending order
            .lean()   // to display the stories

        res.render('stories/index', {
            stories,
        })
        
    }catch(err){
        console.log(err)
    }
})

// show single story
router.get('/:id', ensureAuth, async (req,res)=>{
    try {
        let story =  await Story.findById(req.params.id)
            .populate('user')
            .lean()
        if(!story){
            return res.render('error/404')
        }
        if (story.user != req.user.id){
            res.redirect('/storiess')
        }else{{
            res.render('stories/show', {
                story,
            })
        }}
    } catch (error) {
        console.error(err)
        return res.render('error/404')
    }
})

// show the edit page
router.get('/edit/:id', ensureAuth,async (req,res)=>{
    try {
        const story = await Story.findOne({
            _id:req.params.id
        }).lean()
    
        if(!story){
            return res.render('error/404')
        }
        if (story.user != req.user.id){
            res.redirect('/stories')
        }else{{
            res.render('stories/edit', {
                story,
            })
        }}
    } catch (error) {
        console.error(err)
        return res.render('error/500')
    }
})

// update story
router.put('/:id', ensureAuth,async (req,res)=>{
    try {
        let story = await Story.findById(req.params.id).lean()

        if(!story){
            return res.render('error/404')
        }
        if (story.user != req.user.id){
            res.redirect('/stories')
        }else{
        story = await Story.findByIdAndUpdate({_id:req.params.id}, req.body,{
            new: true, 
            runValidators: true
        })
        res.redirect('/dashboard')
        }
    } catch (error) {
        console.error(err)
        return res.render('error/500')
    }
})

// delete story
router.delete('/:id', ensureAuth,async (req,res)=>{
    try {
        await Story.remove({_id: req.params.id})
        res.redirect('/dashboard')
    } catch (err) {
        console.error(err)
        return res.render('error/500')
    }
})





module.exports  = router