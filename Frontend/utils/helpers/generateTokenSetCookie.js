import jwt  from "jsonwebtoken"

const generateTokenANdSetTOken = (userId,res)=>{

    const token = jwt.sign ({userId},process.env.JWT_SECRET)
    
    res.cookie('jwt',token)
    return token


}

export default generateTokenANdSetTOken