import React,{createContext,useState,useEffect} from 'react';
import { faCheckSquare,faTrophy,faPlus,faQuran,faBible,faBook,faShoppingCart,faGamepad,faFilm,faDumbbell,faHeart,faUsers,faBroom,faTrashAlt,faPencilAlt} from '@fortawesome/free-solid-svg-icons'    
import {
    Ava1,Ava2,Ava3,Ava4,Ava5,Ava6,Ava7,Ava8,Ava9,Ava10,Ava11,Ava12,Ava13,Ava14,Ava15,Ava16,Ava17,Ava18,Ava19,Ava20,
    Emoticon1,Emoticon2,Emoticon3,Emoticon4,Emoticon5,
} from '../components/Svg';

import {dataProfileOnSnapshot} from '../firebase/firebaseFunction';

export const DataContext = createContext();

export const DataProvider = props =>{

    //dataprofile
    const defaultData = {step: 1,name: false,avatar: false,
        resolution: {title: false,description: false}}
    const dataAccountDefault = {
        isNewMember: false,
        lastUpdateActivity: false,
        isFirstActivity: false,
        isDataFromDb: false,
        startDailyActivity: false
    }
    const [dataAccount,setDataAccount] = useState(dataAccountDefault);
    const setDataAccountHandler = value =>{
        setDataAccount(value);
    }
    const [dataProfile,setData] = useState(defaultData);
    const setDataProfile =value=>{
        setData(value);
    }

    //point
    const [point,setPoint] = useState(0);

    //data daily activity
    const activityList = [
        {id: 1,name: `membaca buku`,icon: faBook,note: ''},
        {id: 2,name: 'bermain game',icon: faGamepad,note: ''},
        {id: 3,name: 'nonton film',icon: faFilm,note: ''},
        {id: 4,name: 'olahraga',icon: faDumbbell,note: ''},
        {id: 5,name: 'kencan',icon: faHeart,note: ''},
        {id: 6,name: 'kumpul teman',icon: faUsers,note: ''},
        {id: 7,name: 'bersih-bersih',icon: faBroom,note: ''},
        {id: 8,name: 'belanja',icon: faShoppingCart,note: ''},
        {id: 9,name: 'tambahkan kegiatan',icon: faPlus,note: ''}
    ]
    const defaultDataActivity = {
        activity: [],
        additionActivity: []
    }
    const [sendDataActivityAfterLogin,setSendDataActivityAfterLogin] = useState(false);
    const [dataActivity,setActivity] = useState(defaultDataActivity);
    const setDataActivity = value =>{
        setActivity(value);
    }
    const [historyListHabits,setHistoryListHabits] = useState([]);

    console.log('dataActivity',dataActivity);

    //data good habits
    const defaultDataGoodHabits = [
        {id: 1,icon: 1,set: false,name: 'social',title: 'sosial',desc: 'keluarga,teman,saudara',habits: {
            availableHabits: [
                {id: 1,name: 'keluarga',check: false},
                {id: 2,name: 'teman',check: false},
                {id: 3,name: 'saudara',check: false}
            ],
            doHabits: []
        }},
        {id: 2,icon: 2,set: false,name: 'study',title: 'belajar',desc: 'pomodoro,rekam belajar',habits: {
            availableHabits: [
                {id: 1,name: 'pomodoro',check: false}
            ],
            doHabits: []
        }},
        {id: 3,icon: 3,set: false,name: 'homework',title: 'pekerjaan rumah',desc: 'memasak,menyapu,bersih-bersih',habits: {
            availableHabits: [
                {id: 1,name: 'memasak',check: false},
                {id: 2,name: 'menyapu',check: false},
                {id: 3,name: 'bersih-bersih',check: false}
            ],
            doHabits: []
        }},
        {id: 4,icon: 4,set: false,name: 'hobby',title: 'hobi',desc: 'game,bersepeda,catur',habits: {
            availableHabits: [
                {id: 1,name: 'game',check: false},
                {id: 2,name: 'bersepeda',check: false},
                {id: 3,name: 'catur',check: false}
            ],
            doHabits: []
        }}
    ];

    const defaultListHabits = [
        {id: 1, title: "sosial", doHabits: [], length: 0},
        {id: 2, title: "belajar", doHabits: [], length: 0},
        {id: 3, title: "pekerjaan rumah", doHabits: [], length: 0},
        {id: 4, title: "hobi", doHabits: [], length: 0},
    ]

    const [goodHabits,setGoodHabits] = useState(defaultDataGoodHabits);
    const [listHabits,setList] = useState([]);
    const [isListHabitsFinish,setIsListHabitsFinish] = useState(false);
    const setDataGoodHabits = value =>{
        setGoodHabits(value);
        localStorage.setItem('data-good-habits',JSON.stringify(value));
    }
    const setListHabits =value=>{
        setList(value);
        //save data to localStora
        localStorage.setItem('data-list-habits',JSON.stringify(value));
    }
    console.log('goodHabits',goodHabits);
    console.log('listHabits',listHabits);
    
    //step to field data profile
    const [isDataProfile,setIsDataProfile] = useState({step: 1});

    //list resolution
    const [resolution,setResolution] = useState({fixed: false,value: []});
    const style = `background-color: green;color: white;`
    console.log(resolution);

    //resolution advice
    const resolutionAdvice = [
        {id: 'advice_1',title: 'bangun pagi di hari libur',date: false,priority: false},
        {id: 'advice_2',title: 'Baca Lebih Banyak Buku',date: false,priority: false},
        {id: 'advice_3',title: 'Makan Sayuran Secara Teratur',date: false,priority: false},
        {id: 'advice_4',title: 'Menanam Tanaman hijau',date: false,priority: false},
        {id: 'advice_5',title: 'Melakukan Gerakan Olahraga Sederhana',date: false,priority: false},
        {id: 'advice_6',title: 'Belajar Memasak',date: false,priority: false},
        {id: 'advice_7',title: 'Diet',date: false,priority: false},
        {id: 'advice_8',title: 'Berlibur ke Tempat yang Diimpikan',date: false,priority: false},
        {id: 'advice_9',title: 'Membeli Gadget Baru',date: false,priority: false},
        {id: 'advice_10',title: 'Hidup Lebih Minimalis',date: false,priority: false},
        {id: 'advice_11',title: 'Berjalan Kaki Minimal 30 Menit Setiap Pagi',date: false,priority: false},
        {id: 'advice_12',title: 'Tidur Lebih Cepat dan Lebih Berkualitas',date: false,priority: false},
        {id: 'advice_13',title: 'Berhenti Menunda Pekerjaan',date: false,priority: false},
        {id: 'advice_14',title: 'Fokus Menabung dan Investasi',date: false,priority: false},
        {id: 'advice_15',title: 'Belajar Bahasa Asing',date: false,priority: false},
        {id: 'advice_16',title: 'Menggeluti Hobi Baru',date: false,priority: false}
    ]
    const [tempResolutionAdvice,setTempResolutionAdvice] = useState([]);

    return (
        <DataContext.Provider value={
            {dataProfile,
            setDataProfile,
            defaultData,
            dataActivity,
            setDataActivity,
            defaultDataActivity,
            activityList,
            defaultDataGoodHabits,
            goodHabits,
            setDataGoodHabits,
            listHabits,
            setListHabits,
            isDataProfile,
            setIsDataProfile,
            sendDataActivityAfterLogin,
            setSendDataActivityAfterLogin,
            setDataAccountHandler,
            dataAccount,
            dataAccountDefault,
            isListHabitsFinish,
            setIsListHabitsFinish,
            historyListHabits,
            setHistoryListHabits,
            defaultListHabits,
            point,
            setPoint,
            resolution,
            setResolution,
            resolutionAdvice,
            tempResolutionAdvice,
            setTempResolutionAdvice
            }}>
            {props.children}
        </DataContext.Provider>
    )
}