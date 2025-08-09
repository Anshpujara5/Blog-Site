import { PrismaClient } from '../generated/prisma/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { Hono } from 'hono'
import { sign } from 'hono/jwt'
import { signupInput , signinInput} from "@anshpujara/medium-common"

export const userRouter = new Hono<{
    Bindings:{
        DATABASE_URL:string
        JWT_SECRET:string
    }
}>();

userRouter.post('/signup',async (c)=>{
    console.log("Signup entered");
    const body = await c.req.json();
    const { success } = signupInput.safeParse(body);
    if(!success){
        c.status(411);
        return c.json({
            message:"Inputs not corrct"
        })
    }

    const prisma = new PrismaClient({
        datasourceUrl:c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    console.log(c.env.DATABASE_URL);

    // console.log("prisma",prisma)
    try{
        const user = await prisma.user.create({
            data:{
                email:body.username,
                password:body.password,
            },
        })
        const jwt = await sign({id:user.id},c.env.JWT_SECRET);
        return c.json({jwt});
    }catch(e){
        console.log("signup error",e);
        c.status(403);
        return c.json({error:"error while singing up"})
    }
})

userRouter.post('/signin',async (c)=>{
    const body = await c.req.json();
    const { success } = signinInput.safeParse(body);
    if(!success){
        console.log(body);
        c.status(411);
        return c.json({
            message:"Inputs are not correct"
        })
    }

    const prisma = new PrismaClient({
        datasourceUrl:c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const user = await prisma.user.findUnique({
        where:{
            email:body.email
        }
    });

    if(!user){
        c.status(403);
        return c.json({error:"User not found"});
    }

    const jwt = await sign({id:user.id},c.env.JWT_SECRET);
    return c.json({jwt});
})

