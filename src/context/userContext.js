import React,{createContext,useState,useEffect} from 'react';

import {authStateChange} from '../firebase/firebaseFunction';

export const UserContext = createContext();

export const UserProvider = props =>{

    const [user,setuser] = useState();
    const setUser = value =>{
        setuser(value);
    }

    console.log(user);

    const [isGuest,setGuest] = useState(true);
    
    const setIsGuest = value =>{
        setGuest(value);
    }

    useEffect(()=>{
        const isUser = async ()=>{
            authStateChange((user)=>{
                if(user){
                    setUser(JSON.parse(JSON.stringify(user)));
                }else{
                    setUser(null);
                }
            });
        }
        isUser();
    },[]);

    return (
        <UserContext.Provider value={{user,setUser,isGuest,setIsGuest}}>
            {props.children}
        </UserContext.Provider>
    )
}