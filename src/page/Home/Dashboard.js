import React,{useContext,useState,useEffect,useLayoutEffect,memo} from 'react';
import Styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars} from '@fortawesome/free-solid-svg-icons';  

///image
import {ReactComponent as ResolutionImage} from '../../image/resolution.svg';
import { ReactComponent as ActivityImage} from '../../image/activity.svg';
import { ReactComponent as LogoImage} from '../../image/logo.svg';


//utils
import {StyleBasic} from '../../utils/globalSetElement'
import {getTime} from '../../utils/utils';

///firebase
import {saveDailyActivity,saveGoodHabits} from '../../firebase/firebaseFunction';

/// menu 
import GoodHabitsMenu from '../Menu/GoodHabits';
import DailyActivityMenu from '../Menu/DailyActivity';
import DashboardMenu from '../Menu/Dashboard';
import ResolutionMenu from '../Menu/Resolution';
import FocusMenu from '../Menu/Focus';

/// homeComponent
import Sidebar from './HomeComponent/Sidebar';

//component
import Box from '../../components/Box';
import Text from '../../components/Text';
import Button from '../../components/Button';
import {SelectAnEmoticon,DailyActivity as SelectDailyActivity} from '../../components/components';
import Modal from '../../components/Modal';
import Backdrop from '../../components/Backdrop';

///context
import {DataContext} from '../../context/dataContext';
import {UserContext} from '../../context/userContext';
import {AppContext} from '../../context/appContext';

const Container = Styled(StyleBasic("div"))``;

const GoodHabits = memo(GoodHabitsMenu);
const DailyActivity = memo(DailyActivityMenu);
const Dashboard = memo(DashboardMenu);
const Resolution = memo(ResolutionMenu);
const Focus = memo(FocusMenu);

function useWindowSize() {
    const [size, setSize] = useState([0, 0]);
    useLayoutEffect(() => {
      function updateSize() {
        setSize([window.innerWidth, window.innerHeight]);
      }
      window.addEventListener('resize', updateSize);
      updateSize();
      return () => window.removeEventListener('resize', updateSize);
    }, []);
    return size;
}

const DashboardContainer = props =>{

    //context
    // const {} = useContext(DataContext);
    const {user,isGuest} = useContext(UserContext);
    const {dataProfile,dataActivity,dataAccount,goodHabits,defaultDataActivity,setDataActivity,defaultDataGoodHabits} = useContext(DataContext);
    const {menuOpen,setMenuOpen} = useContext(AppContext);

    //auth
    const [auth,setAuth] = useState(false);

    //modal Activity
    const [modalActivity,setModalActivity] = useState({show: false,lock: false});
    const modalActivityHandler = value => setModalActivity({...value});

    //modal resolution 
    const [modalResolution,setModalResolution] = useState({show: false,lock: false});
    const modalResolutionHandler = value => setModalResolution({...value});

    /// start 
    const [checkDailyActivity,setCheckDailyActivity] = useState({start: false,action: {step: 1,closeAnimation: false}});

    const nextCheckDailyActivityHandler = ()=>{
        setCheckDailyActivity({...checkDailyActivity,action: {...checkDailyActivity.action,closeAnimation: true}});
        setTimeout(()=>{
            setCheckDailyActivity({...checkDailyActivity,action: {...checkDailyActivity.action,step: checkDailyActivity.action.step + 1,closeAnimation: false}});
        },2000);
    }

    const save = ()=>{
        if(dataAccount.isFirstActivity){    
            modalActivityHandler({show: true,lock: false});
        }
        setCheckDailyActivity({...checkDailyActivity,start: false});
        const saveDaily = ()=>{
            saveDailyActivity({id: user.uid,activity: dataActivity,emoticon: dataActivity.emoticon },()=>{
                saveDaily(); // if error then send again
            });
        }
        saveDaily();
        const saveGood = ()=>{
            saveGoodHabits({id: user.uid,goodHabits: JSON.stringify(goodHabits) },()=>{
                saveGood(); // if error then send again
            });
        }
        saveGood();
        setDataActivity(defaultDataActivity);
    }

    useEffect(()=>{
        if(user){
            if(dataAccount.lastUpdateActivity !== `${getTime.date()}-${getTime.month()}-${getTime.year()}`){
                setCheckDailyActivity({...checkDailyActivity,start: true});
                modalResolutionHandler({show: true,lock: false});
            }else{
                setCheckDailyActivity({...checkDailyActivity,start: false});
            }
        }
    },[user]);

    const changeMenu = id => setMenuOpen({id});




    // responsive
    const [isPhone,setIsPhone] = useState(false);
    const [isOpenSidebar,setIsOpenSidebar] = useState(false);

    const sidebarHandler =()=>{
        setIsOpenSidebar(prev => !prev);
    }

    const [width, height] = useWindowSize();
    useEffect(()=>{
        console.log(width);
        if(width < 900){
            setIsPhone(true);
        }else{
            setIsPhone(false);
        }
    },[width,height]);


    return (
        <React.Fragment>

            <Modal lock={modalResolution.lock} borderRadius="1rem" padding="3rem" top="50%" left="50%" show={modalResolution.show} handler={()=>modalResolutionHandler({show: false,lock: false})} minWidth="40rem" minHeight="20rem" bgColor="white" display="flex" alignItems="center" justifyContent="center">
                <Box width="100%" height="100%" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                    <ResolutionImage width="20rem" height="20rem" />
                    <Box borderRadius="1rem" padding="2rem" margin="2rem 0"  bgColor="#f7ff3d" display="flex" justifyContent="center" alignItems="center" flexDirection="column">
                        <Text fontSize="1.6rem" fontWeight="200">remember this word</Text>
                        <Text textTransform="capitalize" fontSize="3rem" fontWeight="600" color="white">{`--- ${dataProfile.resolution.title} ---`}</Text>
                    </Box>
                    <Text textAlign="center" fontSize="1.7rem" margin="1rem 0">
                        {`hei ${dataProfile.name} jangan lupakan resolusimu ya, have a nice day :)`}
                    </Text>
                    <Button onClick={()=>modalResolutionHandler({show: false,lock: false})} display="flex" alignItems="center" justifyContent="center" width="auto" height="100%" padding="1rem 4rem" bgColor="#3791e8" hoverBgColor="#1968b5" color="white" fontSize="1.7" unitSize="rem" borderRadius=".5rem">
                        ayo mulai !
                    </Button>
                </Box>
            </Modal>

            <Modal lock={modalActivity.lock} borderRadius="1rem" padding="3rem" top="50%" left="50%" show={modalActivity.show} handler={()=>modalActivityHandler({show: false,lock: false})} minWidth="40rem" minHeight="20rem" bgColor="white" display="flex" alignItems="center" justifyContent="center">
                <Box width="100%" height="100%" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                    <Box width="15rem" height="15rem" display="flex" alignItems="center" justifyContent="center" >
                        <ActivityImage width="100%" height="100%" />
                    </Box>
                    <Text textAlign="center" fontSize="2rem" margin="2rem">
                        yey ,aktifitas pertamamu telah kami simpan!
                    </Text>
                    <Box  margin="5rem 0 0 0" width="100%" height="4rem" display="flex" justifyContent="center" alignItems="center">
                        <Button onClick={()=>{
                            changeMenu(3);
                            modalActivityHandler({show: false,lock: false});
                        }} display="flex" alignItems="center" justifyContent="center" width="auto" height="100%" padding="1rem 4rem" bgColor="#3791e8" hoverBgColor="#1968b5" color="white" fontSize="1.7" unitSize="rem" borderRadius=".5rem">
                            lihat aktifitas harian
                        </Button>
                    </Box>
                </Box>
            </Modal>

            <Container margin={isPhone ? '10rem 0 0 0':'0 0 0 0'}  padding={isPhone ? '0 0 0 0': '0 0 0 20vw'} width="100vw" minHeight="100vh" bgColor="white" display="flex" alignItems="center" justifyContent="center">
                
                {!isPhone && <Sidebar phone={false} />}
                
                {isPhone &&
                    <React.Fragment>
                        <Sidebar onClick={sidebarHandler} show={isOpenSidebar} phone={true} />
                        {isOpenSidebar && <Backdrop onClick={sidebarHandler} />}
                    </React.Fragment>
                }
                

                {isPhone && 
                    <Box position="fixed" top="0" left="0" zIndex="10" bgColor="#7350b1"  width="100%" height="7rem" display="flex" alignItems="center" justifyContent="space-between" padding="2rem">
                        <Box  display="flex" justifyContent="center" alignItems="center">
                            <LogoImage width="4rem" height="4rem" />
                            <Text color="white" fontSize="2rem" fontWeight="600" margin="0 0 0 2rem">Good Habits</Text>
                        </Box>
                        <Button onClick={sidebarHandler} color="white" fontSize="2.5" unitSize="rem" width="3rem" height="3rem" display="flex" alignItems="center" justifyContent="center" >
                            <FontAwesomeIcon icon={faBars} />
                        </Button>
                    </Box>
                }

                {checkDailyActivity.start &&
                    <Box padding="10rem 0" width="80%" margin="auto" display="flex" alignItems="center" justifyContent="center">
                        {checkDailyActivity.action.step === 1 && <SelectAnEmoticon transition="1s" opacity={checkDailyActivity.action.closeAnimation ? '0': '1'} onClick={nextCheckDailyActivityHandler} />}
                        {checkDailyActivity.action.step === 2 && <SelectDailyActivity transition="1s" opacity={checkDailyActivity.action.closeAnimation ? '0': '1'} onClick={save} />}
                    </Box> }
                
                {!checkDailyActivity.start &&
                    <React.Fragment>
                        {menuOpen.id === 1 && <Dashboard isPhone={isPhone} />}
                        {menuOpen.id === 2 && <GoodHabits />}
                        {menuOpen.id === 3 && <DailyActivity />}
                        {menuOpen.id === 4 && <Resolution />}
                        {menuOpen.id === 5 && <Focus />}
                    </React.Fragment>}
                
            </Container> 
        </React.Fragment>
    )
}


export default DashboardContainer;

