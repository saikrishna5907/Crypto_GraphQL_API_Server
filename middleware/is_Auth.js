import jwt from 'jsonwebtoken';
require('dotenv').config({ path: '../values.env' });
// const requiresLogin =  resolver => (parent, args, context, info) => {
//     if(context.user){
//         return resolver(parent, args, context, info);
//     }else{
//         throw new AuthenticationError('Unauthorized...!')
//     }
// }
module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        req.isAuth = false;
        return next();
    }
    const token = authHeader.split(' ')[1];

    if (!token || token === '') {
        req.isAuth = false;
        return next();
    }
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.JWT_HASH_SECRET);
    } catch (err) {
        req.isAuth = false;
        return next();
    }
    if(!decodedToken){
        req.isAuth = false;
        return next();
    }
    req.isAuth = true; 
    req.userId = decodedToken.userId;
    next();
}
