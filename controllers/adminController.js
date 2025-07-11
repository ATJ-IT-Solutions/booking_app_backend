import validator from 'validator'
import bcrypt from 'bcrypt'
import {v2 as cloudinary} from 'cloudinary'
import doctorModel from '../models/doctorModel.js'
import jwt from 'jsonwebtoken'

const addDoctor = async (req,res)=>{

    try{
      const {name,email,password, speciality,degree,experience,about} = req.body
      const imageFile = req.file 

      if (!name || !email || !password){
        return res.json({success:false,message:"Missing Details"})
      }

      if (!validator.isEmail(email)){
        return res.json({success:false,message:"Please enter a valid email"})
      }

      if (password.length < 8){
        return res.json({success:false,message:"Please enter a strong password"})
      }

      //hashing password
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password,salt)

      //upload image to cloudinary
      // const imageUpload = await cloudinary.uploader.upload(imageFile.path,{resource_type:'image'})
      // const imageUrl = imageUpload.secure_url

      const doctorData = {
         name,
         email,
         password:hashedPassword,
         image: "./src/assets/img/landing/profile.png",
         speciality,
         degree,
         experience,
         about,
         status:true,
         date: new Date().toISOString()
      }
      console.log(doctorData)

      const newDoctor = new doctorModel(doctorData)
      await newDoctor.save()

      res.json({success:true,message:"Doctor Added"})

    }
    catch(error) {
      console.log(error)
      res.json({success:false,message:error.message})
    }
}

const loginAdmin = async(req,res)=>{
  try{

     const {email,password} = req.body
     if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
 
       const token = jwt.sign(email+password,process.env.TOKEN_SECRET)
       res.json({success:true,token})

     }else{
      res.json({success:false,message:"Invalid Credentials"})
     }
  }
  catch(error){
    console.log(error)
    res.json({success:false,message:error.message})
  }
}

export {addDoctor, loginAdmin}