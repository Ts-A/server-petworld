const User = require('../database/models/userModel'),
      jwt  = require('jsonwebtoken')

const auth = async (req,res,next)=>{
    try{
        const token = req.header('Authorization').replace('Bearer ','')
        const verified = await jwt.verify(token,process.env.JWT)
        const user = await User.findOne({_id:verified._id,'tokens.token':token})
        if(!user){
            throw new Error()
        }
        req.user  = user
        req.token = token
        next()
    } catch(e){
        res.status(401).send({error:'Unauthorized'})
    }
}

module.exports = auth