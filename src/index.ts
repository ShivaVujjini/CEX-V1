import express from "express";

const app=express();

app.use(express.json());

app.post('/signup',(req,res)=>{
    let username:String = req.body.username;
    let password:String = req.body.password;
    res.json({
        'message':'signup done'
    })
})

app.listen(3000);
