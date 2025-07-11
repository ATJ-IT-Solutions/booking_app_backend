import nodemailer from 'nodemailer'


const sendEmail = async (to, subject, text, html) => {
    try{

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth:{
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD

            }
        })

        const mailOptions = {
            from : process.env.EMAIL_USER,
            to,
            subject,
            text,
            html
        }

        const info = await transporter.sendMail(mailOptions)
        console.log('Email sent:', info.response)
    }
    catch(error){
        console.log(error)

    }
}

export default sendEmail