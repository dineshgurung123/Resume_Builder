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

module.exports = router;
