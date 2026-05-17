import "dotenv/config" ;
import express from "express";
import { PrismaClient } from "./generated/prisma/client.js";
import { PrismaPg} from "@prisma/adapter-pg";
const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
  }); 
import { createOrder } from "./database.js";
import jwt from "jsonwebtoken";
import {authmiddleware} from "./middleware.js";
const client = new PrismaClient({adapter});
import { getSortedAsks,getSortedBids,orderbook , balances ,addToOrderBook,type Order,type PriceLevel,type Stock,type Side,type OrderBook,type UserStock,type UserBalances, type Balances} from "./orderbook.js";
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

app.post("/order",authmiddleware,async (req, res) => {

    const username:string = req.username ?? "";

    const user =await client.user.findFirst({
        where: {
                username: username
        }
    })
    if (!user) {
        res.status(404).json({ message: "user not found" });
        return;
    }
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
    // checking if user has enough balance to buy limit order 
    if (type=="limit" && side=="buy"){
            let temp1:number = price*qty ;
            if(!balances[userid]){
                return;
            }
            let temp2:number = balances[userid]["INR"]?.total ?? 0;
            if(temp1>temp2 || qty==0){
            return res.status(403).json({

            'message':'please enter valid quantity'

            })
        }

    }
    //handle the cases where asks is null or bids is null
    //try to finish limit orders with fully filled as well as partially fill
    const orderId = await createOrder(userid,side,type,market_id,price,qty);
    if(type=="limit"){
        if(side=="buy"){
            let asks = getSortedAsks(market_id);
            if(!asks){return;}   // directly the bid goes into bids
            let remainingQty : number = qty ;
            for(const [price,PriceLevel] of asks){
                if(Number(price)<=Number(price)){
                    for(const order of PriceLevel.orders){
                        const fillednow = Math.min(order.qty-order.filledQty,remainingQty);
                        order.filledQty+=fillednow;
                        order.qty -= fillednow ;
                        remainingQty-= fillednow;
                        if (remainingQty===0){
                            break;
                        }
                    }
                }
                if (remainingQty===0){
                    break;
                }
            }
            if(remainingQty!==0 ){
                //add the price and qty to the in memory values
                let order:Order={
                    userId:userid,
                    qty,
                    filledQty:qty-remainingQty,
                    orderId:orderId,                                                                // get the orderid from the db when an order is created
                    createdAt:new Date(),
                };
                addToOrderBook(market_id,"BIDS",price,order);
            }
        }
        if(side=="sell"){

        }
        

    }





})
app.listen(3000);
