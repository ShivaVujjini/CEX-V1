import jwt from "jsonwebtoken";
import  type {Request,Response,NextFunction} from "express";

export function authmiddleware(req:Request,res:Response,next:NextFunction):void {
    const token = req.headers.token ;
    if (!token || Array.isArray(token)){
        res.status(403).json({
            "message":"token missing or invalid"
        });
        return ;
    }
    try{
        const decoded = jwt.verify(token,"cex-v1") as {username:string};
        if(decoded.username){
            (req as Request & {username:string}).username = decoded.username;
            next();
        }
        else{
            res.status(403).json({
                'message': "invalid token"
            });
            return ;
        }
    }
    catch(e){
        res.status(403).json({
            'message': "invalid token"
        })
    }
}

