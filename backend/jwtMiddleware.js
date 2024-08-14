const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY
const jwt = require('jsonwebtoken')

const authMiddleware = (req,res,next)=>{
    const token = req.header('Authentication').replace('Bearer ','')
    try {
        const decoded = jwt.verify(token,JWT_SECRET_KEY);
        req.body.name = decoded.user;
        next();
    } catch (err) {
        res.status(401).send({ message: 'Invalid token' });
    }
}

module.exports = authMiddleware