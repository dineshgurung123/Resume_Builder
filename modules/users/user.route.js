const router = require("express").Router();
const userController = require("./user.controller");
const secureAPI = require("../../utils/secure");

router.post("/login", async (req, res, next) => {
  try {
    const result = await userController.login(req.body);
    res.json({ result });
  } catch (error) {
    next(error);
  }
});

router.post("/register", async (req, res, next) => {
  try {
    const result = await userController.register(req.body);
    res.json({ data: "User Registered successfully" });
  } catch (error) {
    next(error);
  }
});

router.post("/email/verify", async (req, res, next) => {
  try {
    const result = await userController.verifyEmail(req.body);
    res.json({ data: "User verified successfully" });
  } catch (error) {
    next(error);
  }
});

router.post("/email/resend", async (req, res, next) => {
  try {
    const result = await userController.resendEmailOtp(req.body);
    res.json({ data: "OTP resent  successfully" });
  } catch (error) {
    next(error);
  }
});

router.post("/refresh", async (req, res, next) => {
  try {
    const result = await userController.refresh(req.body);
    res.json({ result });
  } catch (error) {
    next(error);
  }
});

//forget password

//Forget password verification

router.post("/forget-password", async (req, res, next) => {
  try {
    await userController.fpTokenGeneration(req.body);
    res.json({ data: "please check your email for further steps" });
  } catch (error) {
    next(error);
  }
});

router.post("/forget-password/verify", async (req, res, next) => {
  try {
    const result = await userController.fpTokenVerification(req.body);
    res.json({ data : "password changed successfully "});
  } catch (error) {
    next(error);
  }
});



//ADMIN SECTIONS

//List all users
//add user
//Get one user
//block User
//update User
//reset-password
//change password


//LoggedIn User

//profile
//profile update


router.post("/change-password", secureAPI(["admin", "user"]),  async (req, res, next) => {
  try {
       
    await userController.changePassword( req.currentUser ,req.body)    
    res.json({
      data: "password changed successfully",
    });
  } catch (error) {
    next(error);
  }
})



router.post("/reset-password", secureAPI(["admin"]),  async (req, res, next) => {
  try {
       
       await userController.resetPassword(req.body)    
    res.json({
      data: "password reset successfully",
    });
  } catch (error) {
    next(error);
  }
})


router.get("/profile", secureAPI(["admin", "user"]),  async (req, res, next) => {
  try {
       
     const result =  await userController.getProfile(req.currentUser)    
    res.json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
})


router.put("/profile", secureAPI(["admin", "user"]),  async (req, res, next) => {
  try {
       
     const result =  await userController.updateProfile(req.currentUser, req.body)    
    res.json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
})


//ADMIN SECTIONS

router.get("/", secureAPI(["admin"]), async (req, res, next) => {
  try {
    const {page, limit, name} = req.query
    const search = {name}
    const result = await userController.list({page , limit, search})
    res.json({ data: result });
  } catch (error) {
    next(error);
  }
});


router.post("/", secureAPI(["admin"]), async (req, res, next) => {
  try {
    res.json({ data: "i am admin route, and i need admin role to access" });
  } catch (error) {
    next(error);
  }
});


router.get("/:id", secureAPI(["admin"]), async (req, res, next) => {
  try {
    res.json({ data: "i am admin route, and i need admin role to access" });
  } catch (error) {
    next(error);
  }
});



router.put("/:id", secureAPI(["admin"]), async (req, res, next) => {
  try {
    res.json({ data: "i am admin route, and i need admin role to access" });
  } catch (error) {
    next(error);
  }
});

router.patch("/block/:id", secureAPI(["admin"]), async (req, res, next) => {
  try {
    res.json({ data: "i am admin route, and i need admin role to access" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
