const router = require ('express').Router()
const userRouter = require('../modules/users/user.route')


router.get("/", (req , res , next)=>{

    try {
        res.json({data: "API is working properly "}) 
    } catch (error) {
        next(e)
    }
})

 
router.use("/api/v1/users", userRouter )

module.exports = router