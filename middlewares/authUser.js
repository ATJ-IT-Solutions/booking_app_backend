import jwt from 'jsonwebtoken'

const authUser = async(req,res,next) => {

    try{
       if (!req.body) {
          req.body = {};
        }
        const {token} = req.headers
        console.log(token)
        if (!token){
            return res.json({success:false,message:"Not Authorized! Please try again"})
        }
        const token_decode = jwt.verify(token,process.env.TOKEN_SECRET)

        req.body.userId = token_decode.id

        next()

    }
    catch (error){
        console.log(error)
        res.send({success:false,message:error.message})
    }
}

export default authUser