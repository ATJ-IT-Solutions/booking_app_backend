import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    name : {type:String, required:true},
    email: {type:String,default:""},
    password:{type:String,default:""},
    image: {type:String,default:""},
    gender: {type:String,default:"Not selected"},
    dob: {type:String,default:"Not selected"},
    phone: {type:String,required:true,unique:true}
})

const userModel = mongoose.models.userModel || mongoose.model('users',userSchema)

export default userModel