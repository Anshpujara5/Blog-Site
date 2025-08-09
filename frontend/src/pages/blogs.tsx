import { Appbar } from "../components/Appbar";
import { BlogCard } from "../components/BlogCard";
import { BlogSkeleton } from "../components/BlogSkeleton";
import { useBlogs } from "../hooks";

export function Blogs (){
    const {loading,blogs} = useBlogs();
    
    if (loading) {
        return <div>
            <Appbar /> 
            <div  className="flex justify-center">
                <div>
                    <BlogSkeleton />
                    <BlogSkeleton />
                    <BlogSkeleton />
                    <BlogSkeleton />
                    <BlogSkeleton />
                </div>
            </div>
        </div>
    }

    return <div>
        <Appbar/>
        <div className="flex justify-center">
            <div className="max-w-xl">
                {blogs.map(blog=><BlogCard
                id={blog.id}
                authorName={blog.author.name || "Anonymous"}
                title={blog.title}
                content={blog.content}
                publishedDate={"12 aug 2025"}/>)}
                {/* <BlogCard 
                authorName="ansh"
                title="My first Blog"
                content="Hello all of you!"
                publishedDate="12 aug 2025"/>
                <BlogCard 
                authorName="ansh"
                title="My first Blog"
                content="Hello all of you!jfi aosnojgnaoijfnodshnfirehguhre uihaduisbghudihasuif uih uihdfuishaiuahdufuegusdhfuhduhaudhsu hfdihfuerhguahguhdsjhvf hfuihdugbdugfahughfq98e9frpgfdsgbudgsfhuiudsfuadh"
                publishedDate="12 aug 2025"/>
                <BlogCard 
                authorName="ansh"
                title="My first Blog"
                content="Hello all of you!jfi aosnojgnaoijfnodshnfirehguhre uihaduisbghudihasuif uih uihdfuishaiuahdufuegusdhfuhduhaudhsu hfdihfuerhguahguhdsjhvf hfuihdugbdugfahughfq98e9frpgfdsgbudgsfhuiudsfuadh Hello all of you!jfi aosnojgnaoijfnodshnfirehguhre uihaduisbghudihasuif uih uihdfuishaiuahdufuegusdhfuhduhaudhsu hfdihfuerhguahguhdsjhvf hfuihdugbdugfahughfq98e9frpgfdsgbudgsfhuiudsfuadh"
                publishedDate="12 aug 2025"/> */}
            </div>
        </div>
    </div>
}
