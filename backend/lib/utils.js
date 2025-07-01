import jwt from "jsonwebtoken";

// function to generate a token for a User
export const generateToken = (userId)=> {
    console.log("JWT_SECRET in generateToken:", process.env.JWT_SECRET);
    const token = jwt.sign({userId}, process.env.JWT_SECRET);
    return token;
}