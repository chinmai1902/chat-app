import jwt from "jsonwebtoken";

// function to generate a token for user
export const generateToken = (userId)=>{
    const token = jwt.sign({_id:userId}, process.env.JWT_SECRET);
    return token;
}