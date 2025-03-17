const userModel = require("./user.model");
const { generateHash } = require("../../utils/bcrypt");

const {sendEmail} = require("../../services/mailer")
 const login = async (email, password) => {};

const register = async (payload) => {
  const { password, ...rest } = payload;

  const existingUser = await userModel.findOne({ email: rest?.email });
  rest.password = generateHash(password);
  if (existingUser) throw new Error("Email already exists");
   const newUser =  userModel.create(rest);


   if(newUser){
    await sendEmail({to : rest?.email, subject: "Welcome to Proresume AI", message : "Thank you for signing up"} )

   }
};

module.exports = { login, register };
