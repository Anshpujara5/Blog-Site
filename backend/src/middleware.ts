import { Hono } from 'hono';
import { verify } from 'hono/jwt'

export function initMiddleware(app:Hono){
    app.use('/api/v1/blog/*',async (c,next)=>{
         const header = c.req.header("authorization") || "";

         const token = header.split(" ")[1];
        // @ts-ignore
         const response = await verify(token,c.env.JWT_SECERET);
        if(response.id){
            next();
        }else{
            c.status(403);
            return c.json({error:"unauthorized"});
        }
    })
}