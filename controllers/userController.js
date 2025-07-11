import validator from 'validator'
import bcrypt from 'bcrypt'
import userModel from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import doctorModel from '../models/doctorModel.js'
import appointmentModel from '../models/appointmentModel.js'
import sendMail from './emailController.js'
import fast2sms from 'fast-two-sms';


// API to register user

const registerUser = async (req,res) =>{
    try{
        const {name,phone} =req.body

        if(!name || !phone){
          return res.json({success:false,message:"Missing details!"})
        }

        const userData = {
            name, phone 
        }

        const newUser= new userModel(userData)
        const user = await newUser.save()

        const token = jwt.sign({id: user._id},process.env.TOKEN_SECRET)

        res.json({success:true,token})

    }
    catch(error){
        console.log(error)
        res.json({success:false,message:error.message})

    }
}

// API for user login
const loginUser = async(req,res) => {
  try {
    const {phone} = req.body
    const cleanedPhone = phone.trim().replace(/\D/g, '');
    const user = await userModel.findOne({phone:cleanedPhone})
   
    if(!user){
      return res.json({success:false,message:"User does not exist!"})
    }

    // const isMatch = await bcrypt.compare(password,user.password)
    if(user){
      const token = jwt.sign({id:user._id},process.env.TOKEN_SECRET)
      res.json({success:true,token})
    }else{
      res.json({success:false,message:"Invalid Phone Number!"})
    }
  }
  catch(error){
    console.log(error)
    res.json({success:false,message:error.message})
  }
}

// API to get user profile data
const getProfile = async (req,res)=>{
  try{
       
    const {userId} = req.body
    const userData = await userModel.findById(userId).select('-password')
    res.json({success:true,userData})

  }
  catch(error){
     console.log(error)
     res.json({success:false,message:error.message})
  }
}

// API to update user profile
const updateProfile = async (req,res)=>{
  try{

    const {userId, name, email, phone,gender, dob} = req.body
    console.log(req.body)
    if (!name || !email || !phone || !gender || !dob){
      return res.json({success:false,message:"Please fill all the details!"})
    }

    await userModel.findByIdAndUpdate(userId, {name,email,phone,gender,dob})

    res.json({success:true,message:"Profile updated successfully"})
  }
  catch(error){
    console.log(error)
    res.json({success:false,message:error.message})
  }
}

const bookAppointment = async (req,res)=> {
const fastAPI = 'ujByv0zpaa3I8SMEOuKxaPUzIbzzZkG9kqi9I7dC65KprIGAhpaXuWYBDw3L';
  try{

    const {userId, docId, slotDate, slotTime} = req.body
    const docData = await doctorModel.findById(docId).select('-password')
 
    let slots_booked = docData.slots_booked
    if (slots_booked[slotDate]){
      if (slots_booked[slotDate].includes(slotTime)){
          return res.json({success:false,message:"Slot not available. Please try another slot!"})
      }
      else{
        slots_booked[slotDate].push(slotTime)

      }
    
    }else{
      slots_booked[slotDate] = []
      slots_booked[slotDate].push(slotTime)
    }

    const userData = await userModel.findById(userId).select('-password')

    delete docData.slots_booked

    const appointmentData = {
      userId,
      docId,
      userData,
      docData,
      slotTime,
      slotDate,
      date: Date.now()
    }

    const newAppointment = new appointmentModel(appointmentData)
    newAppointment.save()

    //send email to user

  //   const emailSubject = "Appointment Confirmation"
  //   const emailText = `Hi {userData.name}, your appointment with Dr. Sibi is confirmed for {slotDate} at {slotTime}`
  //   const emailHtml = `
  // <h2>Appointment Confirmed</h2>
  // <p>Hello <strong>${userData.name}</strong>,</p>
  // <p>Your appointment with <strong>Dr. ${docData.name}</strong> has been confirmed.</p>
  // <ul>
  //   <li><strong>Date:</strong> ${slotDate}</li>
  //   <li><strong>Time:</strong> ${slotTime}</li>
  // </ul>
  // <p>Thank you for using our service.</p> `;

  // await sendMail(userData.email,emailSubject,emailText,emailHtml)

  //send email to doctor
     const emailSubjectDoc = "Appointment Request"
    const emailTextDoc = `Hi {docData.name}, new appointment request for {slotDate} at {slotTime}`
    const emailHtmlDoc = `
  <h2>Appointment Request</h2>
  <p>Request from <strong>${userData.name}</strong>,</p>
  <ul>
    <li><strong>Date:</strong> ${slotDate}</li>
    <li><strong>Time:</strong> ${slotTime}</li>
  </ul>
  <p>Please take necessary action.</p> `;

  await sendMail(docData.email,emailSubjectDoc,emailTextDoc,emailHtmlDoc)

  // client.messages
  //   .create({
  //               from: 'whatsapp:+14155238886',
     
  //    body: `Hi ${docData.name}, new appointment request for ${slotDate} at ${slotTime}. Patient name : ${userData.name}`,
  //       to: 'whatsapp:+919539539764'
  //   })

  //    .then(message => console.log(message.sid))
  // .catch(err => console.error(err));

  var options = {authorization : 'ujByv0zpaa3I8SMEOuKxaPUzIbzzZkG9kqi9I7dC65KprIGAhpaXuWYBDw3L' , message : 'Hi' ,  numbers : ['9539539764']} 
  // Function to send SMS
  const smsSend = async ()=> {
  try {
    console.log('Sending SMS with options:', options);
    const response = await fast2sms.sendMessage(options);
    console.log('Fast2SMS Response:', response);
  } catch (error) {
    console.error('Error sending SMS:', error.response || error.message || error);
  }
}
smsSend();
    //save new slot in doctor data
    await doctorModel.findByIdAndUpdate(docId,{slots_booked})

    res.json({success:true,message:"Appointment Booked"})

  }catch(error){
    console.log(error)
    res.json({success:false,message:error.message})
  }
} 

const listAppointment = async (req,res)=>{
  try {

    const {userId} = req.body
    const appointments = await appointmentModel.find({userId})

    res.json({success:true,appointments})

  }
  catch(error){
    console.log(error)
    res.json({success:false,message:error.message})
  }
}

const cancelAppointment = async(req,res) =>{

  try{

    const {userId, appointmentId} = req.body

    const appointmentData = await appointmentModel.findById(appointmentId)

    //verify appointment user
    if(appointmentData.userId !== userId){
      return res.json({success:false,message:"Unauthorized action!"})
    }

    await appointmentModel.findByIdAndUpdate(appointmentId,{isCancelled:true})

    //releasing doctor slot
    const {docId, slotDate, slotTime} = appointmentData
    const doctordata =  await doctorModel.findById(docId)
    let slots_booked = doctordata.slots_booked

    slots_booked[slotDate] = slots_booked[slotDate].filter(e=> e !== slotTime)
    await doctorModel.findByIdAndUpdate(docId,{slots_booked})
    
    res.json({success:true,messgae:"Appointment Cancelled"})
  }
  catch(error){
    console.log(error)
    res.json({success:false,message:error.message})
  }
}

export {registerUser, loginUser, getProfile, updateProfile, bookAppointment, listAppointment, cancelAppointment}