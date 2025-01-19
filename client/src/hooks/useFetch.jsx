/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import {useEffect, useState} from 'react';

const API_KEY= import.meta.env.VITE_GIPHY_API;

const useFetch= (keyword)=>{
    const [gifURL, setGifURL] = useState("");

    const fetchGifs = async ()=>{
        try {
            const response = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${keyword.split(" ").join("")}&limit=1`)
            const {data } = await response.json();
            setGifURL(data[0]?.images.downsized_medium?.url)
        } catch (error) {
            setGifURL("https://www.omnisend.com/blog/wp-content/uploads/2016/09/funny-gifs-9.gif")
        };
    }
    useEffect(()=>{
        if(keyword) fetchGifs();
    },[keyword])
    return gifURL;
}
export default useFetch;