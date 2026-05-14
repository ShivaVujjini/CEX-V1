interface Order{
    userId:number;
    qty:number;
    filledQty:number;
    orderId : number;
    createdAt : Date;
}
interface PriceLevel{
    totalQty : number;
    orders:Order[];
}
interface Side{
    [price:number]:PriceLevel;
}
interface Stock{
    BIDS:Side;
    ASKS:Side;
}
interface OrderBook{
    [stock:string]:Stock;
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


export function getSortedBids(stock:string):[string,PriceLevel][] | null{
    if (!orderbook[stock]){
        return null;
    }
    return Object.entries(orderbook[stock].BIDS)
        .sort((a,b)=>Number(a[0])-Number(b[0])) ;
}
export function getSortedAsks(stock:string):[string,PriceLevel][] | null{
    if (!orderbook[stock]){
        return null;
    }
    return Object.entries(orderbook[stock].ASKS)
        .sort((a,b)=>Number(a[0])-Number(b[0]));
}