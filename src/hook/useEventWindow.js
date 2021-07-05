import {useEffect} from 'react';

const useEventWindow = (event,callback) =>{
    useEffect(()=>{
        window.addEventListener(event,callback);

        return window.addEventListener(event,callback);
    },[]);
}

export default useEventWindow;