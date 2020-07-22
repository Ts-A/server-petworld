//packages
const mongoose = require('mongoose')

mongoose.connect(process.env.MONGO_URI,{
    useCreateIndex     : true,
    useNewUrlParser    : true,
    useUnifiedTopology : true,
    useFindAndModify   : true
})

mongoose.connection.on('connected',()=>{
    console.log('Database Connected')
})

mongoose.connection.on('error',()=>{
})

mongoose.connection.on('disconnected',()=>{
})
