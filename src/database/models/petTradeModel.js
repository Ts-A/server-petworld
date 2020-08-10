const mongoose  = require('mongoose')
    //   validator = require('validator')

allowed_pets = ['dog','cat','aquarium','horse','bird','rabbit','hamster']

const petTradeSchema = mongoose.Schema({
    name  :String,
    type  :{
        type : String,
        validate(value){
            if(!allowed_pets.includes(value)){
                throw new Error("Cannot trade this animal")
            }
        }
    },
    owner:{
        type : mongoose.Schema.Types.ObjectId,
        ref  : 'User'
    },
    description : {
        type    : String,
        default : "Hey Paws and Pals.This is my cute pet. Let me know if you are interested in buying."
    },
    age   :{
        type:Number
    },
    image :{
        type: Buffer
    },
    likes : [{
        type : mongoose.Schema.Types.ObjectId,
        ref  : 'User'
    }],
    comments : [{
        user    : {
            type : mongoose.Schema.Types.ObjectId,
            ref  : 'User'
        },
        comment : String,
        date    : Date
    }
    ],
    gender:String,
    price  : {
        type : Number
    }
},{
    timestamps : true
})

const Pet = mongoose.model('Trade',petTradeSchema)

module.exports = Pet