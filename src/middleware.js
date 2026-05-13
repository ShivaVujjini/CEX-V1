import jwt from "jsonwebtoken";

function authmiddleware(req,res,next){
    const token = req.headers.token ;
    const decoded = jwt.verify(token,"cex-v1");
    const username = decoded.username ;
    if(username){
        req.username = username;
        next();
    }
    else{
        res.status(403).json({
            "message":"invalid token"
        })
    }
}

module.exports ={
    authmiddleware : authmiddleware
}