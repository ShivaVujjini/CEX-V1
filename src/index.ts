import "dotenv/config" ;
import express from "express";
import { PrismaClient } from "./generated/prisma/client.js";
import { PrismaPg} from "@prisma/adapter-pg";
const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
  }); 

import jwt from "jsonwebtoken";
import {authmiddleware} from "./middleware.js";
const client = new PrismaClient({adapter});
import { getSortedAsks,getSortedBids,orderbook } from "./orderbook.js";

const app=express();
app.use(express.json());


app.post('/signup',async (req,res)=>{
    let username:string = req.body.username;
    let password:string = req.body.password;
    let userExists = await client.user.findFirst({
        where : {
            username 
        },
    });
    if (userExists){
        res.status(403).json({
            'message':'username already exists'
        });
    }
    else{
        await client.user.create({
            data:{
                username : username,
                password : password
            },
        })    
        res.json({
            'message':'signup done'
        })
    }
})

app.post('/signin',async (req,res)=>{
    let username:string = req.body.username;
    let password:string = req.body.password;
    let userExists = client.user.findFirst({
        where:{
            username,
            password
        }
    });
    if (!userExists){
        res.status(403).json({
            "message":"incorrect credentials"
        })
    }
    else{
        const token = jwt.sign({
            username:username
        },"cex-v1");
        res.json({
            token
        })
    }
})

app.post("/order",authmiddleware, (req, res) => {

    const username = req.username ;

    const user =client.user.findFirst({

        where:{

            username

        },

    })

    const userid = user.id;

    const type:string = req.body.type;

    const price:number = req.body.price;

    const qty:number = req.body.qty;

    const market_id:string = req.body.market_id;

    const side:string = req.body.side;

    let marketExists = client.stock.findFirst({

        where:{

            symbol:market_id

        },

    })

    if(!marketExists){

        return res.status(403).json({

            'message':'please select valid stock'

        })

    }

    if (type=="limit" && price*qty>BALANCES[userid][market_id]){

            return res.status(403).json({

            'message':'please enter valid quantity'

            })

    }

    //try to finish limit orders with fully filled as well as partially fill

    if(type=="limit"){

        if(side=="buy"){

            // get the asks less than or equal to price

        }

        else{

            //get the bids greater than price

        }

    }





})
app.listen(3000);
