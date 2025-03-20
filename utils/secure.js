const userModel = require('../modules/users/user.model')
const {verifyJWT} = require('../utils/token')

const secureAPI = 
     (roles = []) =>
    async(req, res, next) =>{
    try {
          
        const {access_token} = req.headers
       
        if(!access_token) throw new Error ("Token missing")
        if(roles.length === 0) next()
           else{
           const isValidToken = verifyJWT(access_token)
           const {data} = isValidToken
           const {email} = data
           const user = await userModel.findOne({email, isEmailVerified: true, isBlocked : false} )
           const {roles: userRoles} = user

           const isValidRole = userRoles.some((role)=> roles.includes(role))
          if(!isValidRole) throw new Error("Access Denied")
           next()
        }
         
    } catch (error) {
        
        next(error)
    }
}



module.exports = secureAPI