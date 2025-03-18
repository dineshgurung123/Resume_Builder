const router = require("express").Router();
const userController = require("./user.controller")

router.post("/login", async(req, res, next) => {
  try {
   
  } catch (error) {
    next(error);
  }
});

router.post("/register", async(req, res, next) => {
  try {

   const result = await userController.register(req.body)
  res.json({data : "User Registered successfully"})
} catch (error) {
    next(error);
  }
});

router.post("/email/verify", async(req, res, next) => {
  try {

   const result = await userController.verifyEmail(req.body)
  res.json({data : "User verified successfully"})
} catch (error) {
    next(error);
  }
});



router.post("/email/resend", async(req, res, next) => {
  try {

   const result = await userController.resendEmailOtp(req.body)
  res.json({data : "OTP resent  successfully"})
} catch (error) {
    next(error);
  }
});






module.exports = router;
