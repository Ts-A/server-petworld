require('../mongodb')
const mongoose = require('mongoose'),
      bcrypt   = require('bcryptjs'),
      jwt      = require('jsonwebtoken')

const userSchema = mongoose.Schema({
    firstname   :{
      type      :String,
      required  :true
    },
    lastname    :{
      type      :String,
      required  :true
    },
    username    :{
        type    :String,
        requied :true,
        unique  :true
    },
    email       :{
      type      : String,
      required  : true,
      unique    : true,
    },
    password    :{
        type    :String,
        requied :true
    },
    tokens      :[{ 
        token : {
        type    :String
        }
    }],
    terms       : Boolean,
    updates     : Boolean,
    surveys     : Boolean,
    description : {
      type    : String,
      default : `Hey pals and paws. Add me and give me paw-fi` 
    },
    image       : Buffer
},{
  timestamps : true
})

userSchema.statics.findCredentials = async ({email,password})=>{
  const user = await User.findOne({email})
  if(!user){
      throw new Error('Invalid Credentials')
  }
  if(!await bcrypt.compare(password,user.password)){
      throw new Error('Invalid Credentials')
  }
  return user
}

userSchema.methods.toJSON = function(){
  const userObject = this.toObject()
  delete userObject.password
  delete userObject.tokens
  delete userObject.__v
  return userObject
}

userSchema.methods.genAuthToken = async function(){
  const token = await jwt.sign({_id:this._id.toString()},process.env.JWT)
  this.tokens = this.tokens.concat({token})
  this.save()
  return token
}

userSchema.pre('save',async function(next){
    const user = this;
    if(user.isModified('password')){
      user.password = await bcrypt.hash(user.password,8);
    }
    next();
})

const User = mongoose.model('User',userSchema)

module.exports = User