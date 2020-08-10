const express = require('express'),
      multer  = require('multer'),
      sharp   = require('sharp')

const User              = require('../database/models/userModel'),
      { sendOrderMail } = require('../middleware/email')


const router  = express.Router(),
      Pet     = require('../database/models/petTradeModel'),
      auth    = require('../middleware/authorization'),
      upload  = multer({
        fileSize : 1000000,
        fileFilter(req,file,cb){
          if(!file.originalname.match(/\.(jpeg|jpg|png)$/))
            cb(new Error('Wrong file type'))
            cb(undefined,true)
        }
      })

router.post('/pet',auth,upload.single('file'),async(req,res)=>{
    try{
        const image = await sharp(req.file.buffer).resize({height:200,width:200}).png().toBuffer()
        const pet = new Pet({
            ...req.body,
            owner : req.user._id,
            image
        })
        await pet.save()
        res.status(201).send({pet})
    } catch(e){
        res.status(400).send({error:e.message})
    }
})

router.get('/pets',async(req,res)=>{
    try{
        const pets = await Pet.find({}).skip(Number(req.query.skip)).limit(Number(req.query.limit)).sort(req.query.sort).populate('owner likes')
        res.send({pets})
    } catch(e){
        res.status(401).send({error:e.message})
    }
})

router.get('/pet/:pet_id',async(req,res)=>{
    try{
        const pet = await Pet.findById(req.params.pet_id).populate('owner comments.user')
        res.send({pet})
    } catch(e){
        res.status(400).send({error:e.message})
    }
})

router.put('/pet',auth,async(req,res)=>{
    try{
        const pet = await Pet.findOneAndUpdate({_id:req.body._id},req.body,{new:true}).populate('owner')
        res.send({pet})
    } catch(e){
        res.status(400).send({error:e.message})
    }
})

router.delete('/pet/:id',auth,async(req,res)=>{
    try{
        const pet = await Pet.findByIdAndDelete(req.params.id)
        res.send({pet,success:"Removed pet"})
    } catch(e){
        res.status(400).send({error:e.message})
    }
})

router.put('/pet/:id/like',auth,async(req,res)=>{
    try{
        const pet = await Pet.findByIdAndUpdate(req.params.id,{
            $push : { likes : req.user._id }
        },{
            new : true
        })
        res.send({success:`Liked ${pet.name} by ${req.user.username}`})
    } catch(e){
        res.status(400).send({error:e.message})
    }
})

router.put('/pet/:id/unlike',auth,async(req,res)=>{
    try{
        const pet = await Pet.findByIdAndUpdate(req.params.id,{
            $pull : { likes : req.user._id }
        },{
            new : true
        })
        res.send({success:`Unliked ${pet.name} by ${req.user.username}`})
    } catch(e){
        res.status(400).send({error:e.message})
    }
})

router.put('/pet/:id/comment',auth,async(req,res)=>{
    try{
        const comment = {
            comment : req.body.comment,
            user    : req.user._id,
            date    : Date.now()
        }, 
        pet = await Pet.findByIdAndUpdate(req.params.id,{
            $push : {  comments : comment }
        },{
            new : true
        }).populate('comments.user')
        res.send({pet,success:`Added to ${pet.name} by ${req.user.username}`})
    } catch(e){
        res.status(400).send({error:e.message})
    }
})

router.get('/pet/:id/image',async(req,res)=>{
    try {
        const pet = await Pet.findById(req.params.id)
        res.set('Content-Type','image/png')
        res.send(pet.image)
    } catch (e) {
        res.status(400).send({error:e.message})
    }
})

router.post('/pet/:user_id',async(req,res)=>{
    try{
        const user = await User.findById(req.params.user_id)
        sendOrderMail(user.email,req.body.message)
    } catch(e){
        res.status(400).send({error:e.message})
    }
})

module.exports = router