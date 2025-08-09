// import { PrismaClient } from '@prisma/client/edge';
// import { PrismaClient } from '../generated/prisma';
import { PrismaClient } from '../generated/prisma/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { Hono } from 'hono' 
import { verify } from 'hono/jwt'
import { createBlogInput, updateBlogInput } from '@anshpujara/medium-common';

export const bookRouter = new Hono<{
    Bindings:{
        DATABASE_URL:string,
        DIRECT_URL:string,
        JWT_SECRET:string
    },
    Variables:{
        userId:string
    }
}>(); 

bookRouter.use(async (c,next)=>{
    const jwt = c.req.header("Authorization");

    if(!jwt){
        c.status(401);
        return c.json({error:"unauthorized"})
    }

    const token = jwt.split(" ")[1];
    const payload = await verify(token,c.env.JWT_SECRET);

    if(!payload){
        c.status(401);
        return c.json({error:"unauthorized"})
    }
    c.set('userId',String(payload.id));
    await next();
})

bookRouter.post('/',async (c)=>{
    console.log("Entered")
    const body = await c.req.json();
    console.log(body);
    const { success } = createBlogInput.safeParse(body);
    // console.log(success)
    if(!success){
        c.status(411);
        return c.json({
            message:"Inputs not correct"
        })
    }
    
    const userId = c.get('userId');
    console.log(userId);
    const prisma = new PrismaClient({
        datasourceUrl:c.env?.DATABASE_URL
    }).$extends(withAccelerate());

    const post = await prisma.blog.create({
        data:{
            title:body.title,
            content:body.content,
            authorId:userId
        }
    });

    return c.json({
        id:post.id
    })
})

bookRouter.put('/',async (c)=>{
    const body = await c.req.json();
    const { success } = updateBlogInput.safeParse(body);
    if(!success){
        c.status(411);
        return c.json({
            message:"Inputs not correct"
        })
    }
    
    const userId = c.get('userId');
    const prisma = new PrismaClient({
        datasourceUrl:c.env?.DATABASE_URL
    }).$extends(withAccelerate());
    console.log(userId);

    await prisma.blog.update({
        where:{
            id:body.id,
            authorId:userId
        },
        data:{
            title:body.title,
            content:body.content
        }
    });

    return c.text('updated post');
})

bookRouter.get('/bulk',async (c)=>{
    console.log("Entered");
    const prisma = new PrismaClient({
        datasourceUrl:c.env.DATABASE_URL
    })
    try{
        const blogs = await prisma.blog.findMany({
            select:{
                content:true,
                title:true,
                id:true,
                author:{
                    select:{
                        name:true
                    }
                }
            }
        });
        console.log(blogs.length);
        console.dir(blogs, { depth: null });
        return c.json(blogs)
    }catch(e){
        console.log(e);
        return c.json({error:"error"});
    }
})

bookRouter.get('/:id',async (c)=>{
    console.log("Entered")
    const id = c.req.param('id');
    const prisma = new PrismaClient({
        datasourceUrl:c.env?.DATABASE_URL
    })

    const post = await prisma.blog.findUnique({
        where:{
            id
        },
        select:{
            title:true,
            content:true,
            author:{
                select:{
                    name:true
                }
            }
        }
    });

    return c.json(post);
})

bookRouter.options('/*', (c) => {
  return c.body(null, 204, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE',
    'Access-Control-Allow-Headers': '*',
  });
});


// b40d2c88-553d-49ec-8dd1-089f268cba4a

// bookRouter.get('/bulk', async (c) => {
//   const prisma = new PrismaClient({
//     datasourceUrl: c.env.DATABASE_URL
//   });

//   try {
//     const blogs = await prisma.blog.findMany({
//       select: {
//         content: true,
//         title: true,
//         id: true,
//         author: {
//           select: {
//             name: true
//           }
//         }
//       }
//     });

//     const logs = [];

//     logs.push(`✅ Blog count = ${blogs.length}`);

//     if (blogs.length > 0) {
//       logs.push(`✅ First blog: ${JSON.stringify(blogs[0], null, 2)}`);
//     } else {
//       logs.push(`⚠️ No blogs found.`);
//     }

//     return c.json({
//       success: true,
//       logs,
//       count: blogs.length,
//       blogs: JSON.parse(JSON.stringify(blogs))
//     });

//   } catch (e) {
//     let message = "Unknown error";
//     if (e instanceof Error) {
//         message = e.message;
//     }
//     return c.json({
//       success: false,
//       error: "Failed to fetch blogs",
//       logs: [message]
//     }, 500);
//   }
// });



// bookRouter.get('/test-all', async (c) => {
//     const prisma = new PrismaClient({
//         datasourceUrl:c.env.DIRECT_URL
//     })
//   const blogs = await prisma.blog.findMany({
//     include: {
//       author: true
//     }
//   });
//   console.dir(blogs, { depth: null });
//   return c.json({ blogs });
// });