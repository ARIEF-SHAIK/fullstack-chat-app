//genrating jwt token
import jwt from "jsonwebtoken"

export const genrateToken = (userid,res) => {
    const token = jwt.sign({id: userid},process.env.JWT_SECRET,{
        expiresIn:"7d"
    })
    res.cookie('jwt',token,{
        httpOnly:true,
        maxAge: 3 * 24 *60*60*1000,//ms
        samesite:"strict",//for cross site request forgery attack
        secure:process.env.NODE_ENV !=="development",//secure cookie only in https
    })
    return token;


}