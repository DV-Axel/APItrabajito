import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "tu_secreto_jwt";



export function generateToken(payload, expiresIn = "2m") {
    return jwt.sign(payload, JWT_SECRET, { expiresIn });
}


export function verifyToken(token) {
    return jwt.verify(token, JWT_SECRET);
} 