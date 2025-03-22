const userModel = require("./user.model");
const { generateHash, compareHash } = require("../../utils/bcrypt");
const { mailEvents } = require("../../services/mailer");
const {
  generateOTP,
  signJWT,
  generateRandomToken,
} = require("../../utils/token");
const { generateRTDuration } = require("../../utils/date");
const {generatePassword} = require("../../utils/textUtils")
const { sendEmail } = require("../../services/mailer");



const changePassword = async( currentUser, payload) =>{
  
  const {oldPassword, password} = payload

  const user = await userModel.findOne({
    _id: currentUser
    ,
     isEmailVerified: true, isBlocked: false})
   
  if(!user) throw new Error("User not found")
  const isValidOldPw = compareHash(user?.password, oldPassword)
   if(!isValidOldPw) throw new Error("password did not match")    
  const newPassword = generateHash(password)
      const updatedUser = await userModel.updateOne({_id: currentUser}, {password: newPassword})
         
 if (updatedUser?.acknowledged) {
  mailEvents.emit(
    "sendEmail",
    user?.email,
    "Password changes Successfully",
    `Your password changed successfully .`
  );

}
}


const login = async (payload) => {
  const { email, password } = payload;

  const user = await userModel.findOne({ email });
  if (!user) throw new Error("User not found");

  if (user?.isBlocked)
    throw new Error("User is blocked, Contact Admin for support");

  if (!user?.isEmailVerified) throw new Error("Email verification pending");

  const isValidPassword = await compareHash(user?.password, password);
  if (!isValidPassword) throw new Error("Email or password mismatch");

  const data = {
    name: user?.name,
    email: user?.email,
  };

  const rt = generateRandomToken();
  const rt_duration = generateRTDuration();
  await userModel.updateOne(
    { email: user?.email },
    {
      refresh_token: {
        code: rt,
        duration: rt_duration,
      },
    }
  );
  return {
    access_token: signJWT(data),
    refresh_token: rt,
    data: "User logged in successfully",
  };
};

const register = async (payload) => {
  const { password, ...rest } = payload;

  const existingUser = await userModel.findOne({ email: rest?.email });

  if (existingUser) throw new Error("Email already exists");
  rest.password = generateHash(password);
  rest.otp = generateOTP();
  const newUser = await userModel.create(rest);

  if (newUser) {
    mailEvents.emit(
      "sendEmail",
      rest?.email,
      "Welcome to Proresume AI",
      `Thank you for signing up. 
     please use this code ${rest.otp}to verify your email`
    );
  }
};

const verifyEmail = async (payload) => {
  const { email, otp } = payload;
  if (otp.length !== 6) throw new Error("OTP must be 6 digits");

  const user = await userModel.findOne({ email, isEmailVerified: false });
  if (!user) throw new Error("User not found");

  const isValidOTP = user.otp === String(otp);

  if (!isValidOTP) throw new Error("OTP mismatch");

  const userUpdate = await userModel.updateOne(
    { email },
    { isEmailVerified: true, otp: "" }
  );

  if (userUpdate) {
    return mailEvents.emit(
      "sendEmail",
      email,
      "Email verified successfully",
      `Thank you for verifying your Email `
    );
  }
};

const resendEmailOtp = async (payload) => {
  const { email } = payload;

  const user = await userModel.findOne({ email, isEmailVerified: false });
  if (!user) throw new Error("User not found");

  const otp = generateOTP();
  const userUpdate = await userModel.updateOne({ email }, { otp });

  if (userUpdate) {
    return mailEvents.emit(
      "sendEmail",
      email,
      `Your OTP code for email verification is ${otp}`,
      `please use this ${otp} code for verification  `
    );
  }
};


const refresh = async(payload) =>{

const {refresh_token , email} = payload

const user = await userModel.findOne({email, isEmailVerified : true, isBlocked : false})
if(!user) throw new Error("User not found")

  const {refresh_token : rt_in_db} = user

  if(rt_in_db?.code !== refresh_token) throw new Error("Token mismatch")
const currentTime = new Date()
 const databaseTime = new Date(rt_in_db.duration)
 if (currentTime > databaseTime) throw new Error("Token Expired")

  const data = {
    name: user?.name,
    email: user?.email,
  };

return {access_token : signJWT(data)}

}


const fpTokenGeneration = async(payload) =>{

  const {email} = payload

  const user = await userModel.findOne({email, isEmailVerified : true, isBlocked: false})
  
  if(!user) throw new Error("User not found")
   const fpToken = generateOTP()
 const updatedUser =  await userModel.updateOne({email}, {otp : fpToken})

 if (updatedUser) {
  mailEvents.emit(
    "sendEmail",
    email,
    "Forget Password",
    `
   tour forget password  code ${fpToken}`
  );

}
}

const fpTokenVerification= async(payload) =>{

  const {email, token, password} = payload
  const user = await userModel.findOne({email, isEmailVerified: true, isBlocked: false})
   
  if(!user) throw new Error("User not found")

    const isValidToken = token === user?.otp
     
    if(!isValidToken) throw new Error ("Token mismatch")

      const newPassword = generateHash(password)
      const updatedUser = await userModel.updateOne({email}, {password: newPassword, otp: ""})
         
 if (updatedUser?.acknowledged) {
  mailEvents.emit(
    "sendEmail",
    email,
    "Password changed",
    `Your password changed successfully`
  );

}
}



const resetPassword = async({email}) =>{
  console.log({email})
  const user = await userModel.findOne({email, isEmailVerified: true, isBlocked: false})
   
      if(!user) throw new Error("User not found")
      const password = generatePassword()
      const newPassword = generateHash(password)
      const updatedUser = await userModel.updateOne({email}, {password: newPassword})
         
 if (updatedUser?.acknowledged) {
  mailEvents.emit(
    "sendEmail",
    email,
    "Password reset Successfully",
    `Your password changed successfully . Your new password is ${password}`
  );

}
}

const getProfile = async(currentUser)=>userModel.findOne({_id: currentUser}).select("-password -refresh_token")

const updateProfile = async(currentUser, payload) =>{
 
  const user = await userModel.findOne({_id: currentUser, isEmailVerified: true, isBlocked: false})
   
  if(!user) throw new Error("User not found")
 
    const newPayload = {name : payload?.name}
    
    const updatedUser = await userModel.findOneAndUpdate({_id: currentUser}, newPayload, {
      new:true
    })
     return {name: updatedUser?.name}
  }



  const list = async({page = 1, limit = 1, search}) =>{
   
    const query = [];
    
      if(search ?.name){
       query.push({
        '$match': {
          'name': new RegExp(search?.name, 'gi')
        }
      })

      }
      
      query.push(
         {
          $project: {
            'password': 0
          }
        }, {
          $facet: {
            metadata: [
              {
                $count: 'total'
              }
            ], 
            data: [
              {
                $skip: (page - 1) *  +limit
              }, {
                $limit: +limit
              }
            ]
          }
        }, {
          $addFields: {
            total: {
              $arrayElemAt: [
                '$metadata.total', 0
              ]
            }
          }
        }, {
          $project: {
            metadata: 0
          }
        }
      )


    const result = await userModel.aggregate(query)
    console.log(result)
    return {
    data: result[0].data,
    total : result[0].total || 0,
    page : +page,
     limit : +limit
    }
    
  }


module.exports = {changePassword, fpTokenGeneration, fpTokenVerification, getProfile,login, register,resetPassword, verifyEmail, resendEmailOtp , refresh, updateProfile , list};
