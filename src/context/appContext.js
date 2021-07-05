import React,{createContext,useState,useEffect} from 'react';

export const AppContext = createContext();

export const AppProvider = props =>{

    const [menuOpen,setMenuOpen] = useState({id: 1});

    return (
        <AppContext.Provider value={{menuOpen,setMenuOpen}}>
            {props.children}
        </AppContext.Provider>
    )
}