import "dotenv/config" ;
import { PrismaClient } from "./generated/prisma/client.js";
import { PrismaPg} from "@prisma/adapter-pg";
const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
  }); 

const client = new PrismaClient({adapter});
export async function createOrder(userId : number,side:string , type :string, market : string , price : number, qty : number , filledqty :number = 0 ):Promise<number>{
    let status :string;
    if(filledqty===qty){
        status = "filled";
    }
    else if(filledqty===0){
        status= "not filled"
    }
    else{
        status = "partially filled"
    }
    let temp = await client.order.create({
        data:{
            userid :userId,
            market ,
            price, 
            qty ,
            type ,
            side ,
            filled_qty :filledqty,
            Status :status,
        }
    });
    return temp.id ;
}