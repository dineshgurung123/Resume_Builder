const userModel = require("./user.model");
const { generateHash, compareHash } = require("../../utils/bcrypt");
const {mailEvents} = require('../../services/mailer')
const {generateOTP, signJWT, generateRandomToken} = require("../../utils/token")

const {sendEmail} = require("../../services/mailer")
 

const login = async (payload) => {

  const {email, password} = payload
  
  const user = await userModel.findOne({email})
  if(!user) throw new Error ("User not found")
 
   if(user?.isBlocked) throw new Error ("User is blocked, Contact Admin for support")
 
     if(user?.isEmailVerified) throw new Error("Email verification pending")
      
     const isValidPassword = await compareHash(user?.password, password)
     if(!isValidPassword) throw new Error ("Email or password mismatch")

     const data = {
      name : user?.name,
      email : user?.email
     }

      const rt = generateRandomToken()
      await userModel.updateOne({email : user?.email}, {refresh_token: rt})
     return {access_token : signJWT(data), refresh_token :  rt, data : "User logged in successfully"} 
};

const register = async (payload) => {
  const { password, ...rest } = payload;

  const existingUser = await userModel.findOne({ email: rest?.email });
  
  if (existingUser) throw new Error("Email already exists");
  rest.password = generateHash(password);
  rest.otp = generateOTP()
  const newUser =  await userModel.create(rest);


   if(newUser){
   
  mailEvents.emit(
    "sendEmail",
     rest?.email,
    "Welcome to Proresume AI", 
     `Thank you for signing up. 
     please use this code ${rest.otp}to verify your email`
    )

   }
};


const verifyEmail = async(payload) => {
  
  const {email, otp} = payload
  if(otp.length !== 6) throw new Error("OTP must be 6 digits")

  const user = await userModel.findOne({email, isEmailVerified : false})
  if(!user) throw new Error ("User not found")

    const isValidOTP =  user.otp ===  String(otp)

    if(!isValidOTP) throw new Error ("OTP mismatch")

     const userUpdate = await userModel.updateOne({email}, {isEmailVerified: true, otp: ""}) 

        if(userUpdate){
          return mailEvents.emit(
            "sendEmail",
             email,
            "Email verified successfully", 
             `Thank you for verifying your Email `
           
            )
        }
   
}

const resendEmailOtp = async(payload) => {
  
  const {email} = payload
 
  const user = await userModel.findOne({email, isEmailVerified : false})
  if(!user) throw new Error ("User not found")
      
    const otp = generateOTP()
     const userUpdate = await userModel.updateOne({email}, {otp }) 

        if(userUpdate){
          return mailEvents.emit(
            "sendEmail",
             email,
            `Your OTP code for email verification is ${otp}`, 
             `please use this ${otp} code for verification  `
           
            )
        }
   
}




module.exports = { login, register , verifyEmail , resendEmailOtp};
