//Packages
const express = require('express')
//Variables
const app           = express(),
      userRouter    = require('./router/userRouter')
//Middlewares
app.use(express.json())
//Routes
app.get('/',(req,res)=>{
    try{
        res.send('Welcome')
    } catch(e){
        res.status(400).send({e:e.message})
    }
})
app.use(userRouter)
//Port
app.listen(process.env.PORT||5000,(req,res)=>{
    console.log('Server started at PORT:',process.env.PORT)
})