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

router.get("/", secureAPI(),  async (req, res, next) => {
  try {
    res.json({
      data: "i am admin route, and i need at least access token to access",
    });
  } catch (error) {
    next(error);
  }
})

router.patch("/block/:id", secureAPI(["admin"]), async (req, res, next) => {
  try {
    res.json({ data: "i am admin route, and i need admin role to access" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
