import type { User } from "./generated/prisma/client.js";

export interface Order{
    userId:number;
    qty:number;
    filledQty:number;
    orderId : number;
    createdAt : Date;
}
export interface PriceLevel{
    totalQty : number;
    orders:Order[];
}
export interface Side{
    [price:number]:PriceLevel;
}
export interface Stock{
    BIDS:Side;
    ASKS:Side;
}
export interface OrderBook{
    [stock:string]:Stock;
}
export interface UserStock{
    total:number;
    locked:number;
}
export interface UserBalances{
    [stockSymbol:string]:UserStock;
}
export interface Balances{
    [userId:number]:UserBalances
}
export let balances:Balances={
    1:{
        "INR":{
            total:20000,
            locked:2000
        }
    },
    2:{
        "SOL":{
            total:5,
            locked:2
        }
    }
}
export let orderbook : OrderBook ={
    AXIS:{
        BIDS:{
            299:{
                totalQty:10,
                orders:[
                    {
                        userId:1,
                        qty:10,
                        filledQty:0,
                        orderId : 22,
                        createdAt : new Date("2026-05-10")
                    }
                ]
            }
        },
        ASKS:{
            298:{
                totalQty:5,
                orders:[
                    {
                        userId:5,
                        qty:5,
                        filledQty:0,
                        orderId : 12,
                        createdAt :new Date('2026-05-11')
                    }
                ]
            }
        }
    }
}

// gives all sorted bids high to low for a particular stock symbol
export function getSortedBids(stock:string):[string,PriceLevel][] | null{
    if (!orderbook[stock]){
        return null;
    }
    return Object.entries(orderbook[stock].BIDS)
        .sort((a,b)=>Number(a[0])-Number(b[0])) ;
}
// gives all sorted asks low to high for a particular stock symbol
export function getSortedAsks(stock:string):[string,PriceLevel][] | null{
    if (!orderbook[stock]){
        return null;
    }
    return Object.entries(orderbook[stock].ASKS)
        .sort((a,b)=>Number(a[0])-Number(b[0]));
}

export function addToOrderBook(stock:string,side: "BIDS" | "ASKS" , price : number , order : Order){
    if(!orderbook[stock]){
        orderbook[stock]={ BIDS :{},ASKS:{} } ;
    }
    if(!orderbook[stock][side][price]){
        orderbook[stock][side][price]={totalQty:0,orders:[]};
    }
    orderbook[stock][side][price].orders.push(order);
    orderbook[stock][side][price].totalQty+=(order.qty-order.filledQty);

}


