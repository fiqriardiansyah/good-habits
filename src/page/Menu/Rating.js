
import React,{useContext,useEffect,useState,useLayoutEffect} from 'react';
import Styled from 'styled-components';

//utils
import {mediaQueries} from '../../utils/mediaQueries';
import {StyleBasic} from '../../utils/globalSetElement';
import {GetAvatar} from '../../utils/utils';

import Box from '../../components/Box';
import Text from '../../components/Text';
import Modal from '../../components/Modal'; 
import Button from '../../components/Button'; 
import Backdrop from '../../components/Backdrop'; 

//context
import {AppContext} from '../../context/appContext';
import {DataContext} from '../../context/dataContext';
import {UserContext} from '../../context/userContext';

//firebase
import {getAllUsersOnSnapshot} from '../../firebase/firebaseFunction';

const BoxUser = props =>{

    const properti = [
        {bgColor: '#ffc10799',bgColorProfile: '#ffc10799',bigText: 'white',smallText: 'rgba(255,255,255,0.6)'},
        {bgColor: '#78909c99',bgColorProfile: '#78909c99',bigText: 'white',smallText: 'rgba(255,255,255,0.6)'},
        {bgColor: '#8d6e6399',bgColorProfile: '#8d6e6399',bigText: 'white',smallText: 'rgba(255,255,255,0.6)'},
    ];

    const getProperti = ()=>{
        if(props.rating > 3){
            return {bgColor: 'white',bgColorProfile: 'rgba(0,0,0,0.3)',bigText: 'rgba(0,0,0,0.7)',smallText: 'rgba(0,0,0,0.5)'}
        }else{
            return properti.find((el,i) => i === props.rating-1);
        }
    }


    return (
        <Box flexDirection="column" bgColor={getProperti().bgColor} borderRadius="1rem" padding="1rem" margin="1rem 0 2rem 0" width="100%" display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
                <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box bgColor={getProperti().bgColorProfile} margin="0 2rem 0 0" width="7rem" height="7rem" borderRadius="50%" overflowY="hidden" overflowX="hidden" >
                        <GetAvatar width="7rem" height="7rem" avatarId={props.val.avatar}/>
                    </Box>
                    <Text fontSize="2rem" fontWeight="600" color={getProperti().bigText} textTransform="capitalize">
                        {props.val.name}
                    </Text>
                </Box>
                <Text fontSize="2rem" fontWeight="600" color={getProperti().bigText} >{`#${props.rating}`}</Text>
            </Box>
            <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
                <Text fontSize="1.7rem" color={getProperti().smallText} textTransform="capitalize">{`Level ${props.val.level}`}</Text>
                <Text fontSize="2rem" fontWeight="400" color={getProperti().smallText}>{`${props.val.point} xp`}</Text>
            </Box>
        </Box>
    )
}

const xpLevel = [1000,3000,5000,7000,10000];

const calculateLevel =(point)=>{
    const lev = xpLevel.find(el => el > point);
    return {level: xpLevel.indexOf(lev)+ 1};
}

const Rating = props =>{
    

    const [allUsers,setAllUsers] = useState([]);
    useEffect(()=>{
        getAllUsersOnSnapshot((users)=>{
            let arr = [];
            users.forEach(user =>{
                const {name,pointFocus,pointGoodHabits,avatar} = user.data();
                arr.push(
                    {name,point: (pointFocus || 0) + pointGoodHabits,avatar,level: calculateLevel((pointFocus || 0) + pointGoodHabits).level})
            })
            setAllUsers(arr.sort((a,b)=> a.point > b.point ? -1: 1));
        })
    },[]);

    return (
        <Box mediaQueries={`${mediaQueries("sm")`padding: 0 1rem !important;`}`} padding="0 1rem" flexDirection="column" display="flex" alignItems="center" height="100%"  width="100%"  bgColor="white">
            <Text margin="2rem 0" fontSize="4rem" fontWeight="600" color="rgba(0,0,0,0.7)">Championship</Text>
            {allUsers.map((val,i)=>{
                return <BoxUser rating={i+1} val={val} key={i} />
            })}
        </Box>
    )
}

export default Rating;