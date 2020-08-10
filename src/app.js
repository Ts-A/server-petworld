//Packages
const express = require('express'),
      cors    = require('cors')
//Variables
const app           = express(),
      userRouter    = require('./router/userRouter')
      petTradeRouter     = require('./router/petTradeRouter')
//Middlewares
app.use(express.json())
app.use(cors())
//Routes
app.get('/',(req,res)=>{
    try{
        res.send('Welcome')
    } catch(e){
        res.status(400).send({e:e.message})
    }
})
app.use(userRouter)
app.use(petTradeRouter)
//Port
app.listen(process.env.PORT||5000,(req,res)=>{
    console.log('Server started at PORT:',process.env.PORT)
})