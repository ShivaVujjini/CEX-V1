import "dotenv/config";
import express from "express";
import { PrismaClient } from "./generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
});
import jwt from "jsonwebtoken";
import { authmiddleware } from "./middleware.js";
const client = new PrismaClient({ adapter });
const app = express();
app.use(express.json());
app.post('/signup', async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    let userExists = await client.user.findFirst({
        where: {
            username
        },
    });
    if (userExists) {
        res.status(403).json({
            'message': 'username already exists'
        });
    }
    else {
        await client.user.create({
            data: {
                username: username,
                password: password
            },
        });
        res.json({
            'message': 'signup done'
        });
    }
});
app.post('/signin', async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    let userExists = client.user.findFirst({
        where: {
            username,
            password
        }
    });
    if (!userExists) {
        res.status(403).json({
            "message": "incorrect credentials"
        });
    }
    else {
        const token = jwt.sign({
            username: username
        }, "cex-v1");
        res.json({
            token
        });
    }
});
app.listen(3000);
//# sourceMappingURL=index.js.map