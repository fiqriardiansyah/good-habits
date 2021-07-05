import React,{useContext,useEffect,useState} from 'react';
import Lottie from 'react-lottie';
import ConfettiAnimation from '../../animation/confetti.json';


//page index 
import IndexPage from '../Index/Index';
import Dashboard from './Dashboard';
import FirstData from '../Shared/FirstData';

//components
import Box from '../../components/Box';

//context 
import {UserContext} from '../../context/userContext';
import {DataContext} from '../../context/dataContext';

//firebase
import {dataProfileOnSnapshot,saveDataProfile} from '../../firebase/firebaseFunction';

const Index = props => {
    //context
    const {user} = useContext(UserContext);
    const {dataProfile,setDataProfile,dataAccount,setDataGoodHabits,setDataAccountHandler,isListHabitsFinish} = useContext(DataContext);

    /////////// STATE
    const [layout ,setLayout] = useState({layout: 1});

    useEffect(()=>{
        if(user){
            dataProfileOnSnapshot({id: user.uid},(result)=>{
                if(result.data()){
                    const {goodHabits,name,avatar,resolution,isNewMember,lastUpdateActivity,isFirstActivity,isDataFromDb} = result.data();
                    setDataProfile({...dataProfile,name,avatar,resolution,isNewMember,lastUpdateActivity,isFirstActivity,isDataFromDb});
                    setDataAccountHandler({isNewMember,lastUpdateActivity,isFirstActivity,isDataFromDb});
                    if(JSON.parse(goodHabits)){
                        setDataGoodHabits(JSON.parse(goodHabits));
                    }
                }
            })
        }
    },[user]);

    const sendDataProfileHandler = ()=>{
        const save =()=>{
            const data = {
                id: user.uid,
                name: dataProfile.name,
                avatar: dataProfile.avatar,
                resolution: dataProfile.resolution,
                isNewMember: true,
                lastUpdateActivity: true,
                isFirstActivity: true,
                isDataFromDb: true
            };
            saveDataProfile(data,()=>{
                save();
            });
        }
        save();
    }

    useEffect(()=>{ 
        if(!dataAccount.isDataFromDb && !dataProfile.name ){
            setLayout({layout: 2});
        }else{
            setLayout({layout: 3});
        }
    },[dataAccount]);

    const defaultOptions = {
      loop: false,
      autoplay: true,
      animationData: ConfettiAnimation,
      rendererSettings: {
        preserveAspectRatio: "xMidYMid slice"
      }
    };

    if(!user) return <IndexPage />
    return (
        <React.Fragment>
            {isListHabitsFinish &&
            <Box pointerEvents="none" transform="translateX(-50%)" className="confetti-animation-box" zIndex="500" bgColor="transparent"  position="fixed" bottom="0" left="50%">
                <Lottie options={defaultOptions} height={500} width={500} />
            </Box> }

            <Box width="100vw" minHeight="100vh" bgColor="white" display="flex" justifyContent="center" >
                {layout.layout === 1 && <h1 style={{fontSize: '4rem',color: 'rgba(0,0,0,0.6)'}}>loading...</h1> }
                {layout.layout === 2 && <FirstData handler={sendDataProfileHandler} />}
                {layout.layout === 3 && <Dashboard /> }
            </Box>
        </React.Fragment>
    );
}

export default Index;