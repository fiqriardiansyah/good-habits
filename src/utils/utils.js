import React from 'react';

import {
    Ava1,Ava2,Ava3,Ava4,Ava5,Ava6,Ava7,Ava8,Ava9,Ava10,Ava11,Ava12,Ava13,Ava14,Ava15,Ava16,Ava17,Ava18,Ava19,Ava20,
    Emoticon1,Emoticon2,Emoticon3,Emoticon4,Emoticon5,
    SocialHabits as Image1,StudyHabits as Image2,HomeworkHabits as Image3,HobbyHabits as Image4
} from '../components/Svg';

const GetAvatar = props =>{
    const index = parseInt(props.avatarId.split("").slice(4,props.avatarId.length).join(""));
    let Element;
    [Ava1,Ava2,Ava3,Ava4,Ava5,Ava6,Ava7,Ava8,Ava9,Ava10,Ava11,Ava12,Ava13,Ava14,Ava15,Ava16,Ava17,Ava18,Ava19,Ava20].find((El,i)=>{
        if(i === index) return Element = (<El width={props.width} height={props.height}  />);
    });
    return Element;
}

const GetEmoticon = props =>{
    const index = parseInt(props.iconId.split("_")[1]);
    let Element;
    [Emoticon1,Emoticon2,Emoticon3,Emoticon4,Emoticon5].find((El,i)=>{
        if(i === index-1) return Element = (<El width={props.width} height={props.height} />);
    });
    return Element;
}

const GetIconHabits = props =>{
    let Element;
    [Image1,Image2,Image3,Image4].find((El,i)=>{
        if(i === parseInt(props.iconId)-1) return Element = (<El  width={props.width} height={props.height} />);
    });
    return Element;
}

const getRandomColor = () =>{
    const colors = ['#192234','#31548D','#31548D','#EABDB1','#8A1F26','#A4D388','#578F8C','#65651B','#EEF310','#0CD2EC'];
    const randomNumber = Math.round(Math.random() * 9);
    return colors[randomNumber];
}

const getTime = {
    time: (epochTime)=>{
        let t;
        if(epochTime){
            t = new Date(epochTime);
        }else{
            t = new Date();
        }
        return t;
    },
    GetTime: (string)=>{
        return getTime.time(string).getTime();
    },
    minutes: (epochTime)=>{
        return getTime.time(epochTime).getMinutes().toString().padStart(2,'0');
    },
    hours: (epochTime)=>{
        return getTime.time(epochTime).getHours().toString().padStart(2,'0');
    },
    day: (epochTime)=>{
        const days = ['minggu','senin','selasa','rabu','kamis','jumat','sabtu'];
        const day = getTime.time(epochTime).getDay();
        return days[day];
    },
    date: (epochTime)=>{
        return getTime.time(epochTime).getDate().toString().padStart(2,'0');
    },
    year: (epochTime)=>{
        return getTime.time(epochTime).getFullYear();
    },
    month: ()=>{
        const months = ['januari','februari','maret','april','mei','juni','juli','agustus','september','oktober','november','desember']
        const month = getTime.time().getMonth();
        return months[month];
    }
}


export {
    GetAvatar,getTime,getRandomColor,GetEmoticon,GetIconHabits
}