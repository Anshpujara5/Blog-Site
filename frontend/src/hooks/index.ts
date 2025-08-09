import { useEffect, useState } from "react"
import axios from 'axios';
import { BACKEND_URL } from "../config";

export interface Blog{
    "content":string;
    "title":string;
    "id":string;
    "author":{
        "name":string
    }
}

export const useBlog = ({ id }: { id: string }) => {
    const [loading, setLoading] = useState(true);
    const [blog, setBlog] = useState<Blog>();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            console.warn("Token not found");
            setLoading(false);
            return;
        }

        axios.get(`${BACKEND_URL}/api/v1/blog/${id}`, {
            headers: {
                Authorization: token
            }
        })
        .then(response => {
            setBlog(response.data);
        })
        .catch(err => {
            console.error("Failed to fetch blog:", err);
        })
        .finally(() => {
            setLoading(false);
        });

    }, [id]);


    return {
        loading,
        blog
    }

}

export const useBlogs = () =>{
    const [loading,setLoading] = useState(true);
    const [blogs,setBlogs] = useState<Blog[]>([]);

    useEffect(()=>{
        console.log("axios Entered");
        axios.get(`${BACKEND_URL}/api/v1/blog/bulk`,{
            headers:{
                Authorization:localStorage.getItem("token")
            }
        })
            .then(response=>{
                setBlogs(response.data);
                setLoading(false);
        })
    },[]);
    console.log(blogs);

    return {
        loading,
        blogs
    }
}
