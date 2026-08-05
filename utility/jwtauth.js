import jwt from "jsonwebtoken";

export const createaccesstoken=function(id){
    return jwt.sign({_id:id},process.env.ACCESSTOKEN_SECRET,{expiresIn:process.env.ACCESSTOKEN_EXP})
}
export const createrefreshtoken=function(id){
    return jwt.sign({_id:id},process.env.REFRESHTOKEN_SECRET,{expiresIn:process.env.REFRESHTOKEN_EXP})
}

export const createaccesandrefreshtoken=function(id){
    const accesstoken=createaccesstoken(id);
    const refreshtoken=createrefreshtoken(id);
    return {accesstoken,refreshtoken}
}

export const verifyaccesstoken=function(token){
    try {
        const decoded=jwt.verify(token,process.env.ACCESSTOKEN_SECRET);
        return decoded._id;
    } catch (error) {
        return null;
    }
}