const jwt = require('jsonwebtoken')
const User = require('../models/user')

const userAuth = async(req,res,next) => {
    try {
        const token = req.headers.authorization
        if(!token){
            return res.json({
                error : 'User Authentication Failed',
                message : 'Login to continue'
            })
        }
        const payload = await jwt.verify(token, 'SGDHEYRIUPQOWBNXZ')
        const id = payload._id
        if(!id){
            return res.json({
                error : 'Invalid token'
            })
        }
        const user = await User.findById(id)
        req.user = user
        next() 
    } catch (error) {
        return res.json({
            status: 'failed',
            error: error.message
        })
    }
}

module.exports = userAuth