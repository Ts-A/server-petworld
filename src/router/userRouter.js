//Packages
require('../database/mongodb')
const express = require('express')

//Variables
const router                                    = express.Router(),
      User                                      = require('../database/models/userModel'),
      auth                                      = require('../middleware/authorization'),
      { sendWelcomeMail, sendCancellationMail } = require('../middleware/email')      
//Routes
router.get('/user/:id',auth,async (req,res)=>{
    try{
        const user = await User.findOne({_id:req.params.id})
        await user.save()
        res.send({user})
    } catch(e){
        res.status(400).send({error:e.message})
    }
})

router.get('/users',async(req,res)=>{
    try {
        const users = await User.find({})
        res.send({users})
    } catch (e) {
        res.status(400).send({error:e.message})
    }
})

router.post('/user', async (req,res)=>{
    try{
        const user  = new User( req.body.user )
        await user.save()
        const token = await user.genAuthToken()
        sendWelcomeMail(user)
        res.status(201).send({user,token})
    } catch(e){
        res.status(400).send({error:e.message})
    }
})

router.put('/user/:id',auth,async (req,res)=>{
    try{
        const user = await User.findOneAndUpdate({_id:req.params.id},req.body,{
            new : true
        })
        await user.save()
        res.send({user})
    } catch(e){
        res.status(400).send({error:e.message})
    }
})

router.delete('/user/:id',auth,async (req,res)=>{
    try{
       const user = await User.findByIdAndRemove(req.params.id)
       sendCancellationMail(user)
       res.send({user})
    } catch(e){
        res.status(400).send({error:e.message})
    }
})

router.post('/user/login',async (req,res)=>{
    try{
        const user  = await User.findCredentials(req.body),
              token = await user.genAuthToken()
        res.send({user,token})
    } catch(e){
        res.status(400).send({error:e.message})
    }
})

router.post('/user/logout',auth,async(req,res)=>{
    try{
        console.log(req.body)
        req.user.tokens = req.user.tokens.filter(token => token.token!==req.token)
        await req.user.save()
        res.send({success:'Logged Out'})
    } catch(e){
        res.status(400).send({error:e.message})
    }
})

module.exports = router