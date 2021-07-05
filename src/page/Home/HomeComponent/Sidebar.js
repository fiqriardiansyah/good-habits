import React,{useContext,useState,useEffect} from 'react';
import Styled from 'styled-components';
import {withRouter} from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignOutAlt,faEdit} from '@fortawesome/free-solid-svg-icons'    
import Lottie from 'react-lottie';
import DiagramAnimation from '../../../animation/diagram.json';
import NotepadAnimation from '../../../animation/notepad.json';
import CyclingAnimation from '../../../animation/cycling.json';
import FocusAnimation from '../../../animation/focus.json';



import {StyleBasic} from '../../../utils/globalSetElement'
import {GetAvatar} from '../../../utils/utils';

import {ReactComponent as LogoImage} from '../../../image/logo.svg';

//firebase
import {logout} from '../../../firebase/firebaseFunction';

/// component
import Box from '../../../components/Box';
import Text from '../../../components/Text';
import Button from '../../../components/Button';
import Modal from '../../../components/Modal';
import Label from '../../../components/Label';
import Input from '../../../components/Input';
import Sign from '../../../components/Sign';

//context
import {AppContext} from '../../../context/appContext';
import {UserContext} from '../../../context/userContext';
import {DataContext} from '../../../context/dataContext';

//firebase
import {dataProfileOnSnapshot,saveSpecificDataProfile} from '../../../firebase/firebaseFunction';

const Container = Styled(StyleBasic("div"))``;

const AnimationOption = (trophy,loop) =>{
    const TrophyOption = {
        loop: loop ,
        autoplay: true,
        animationData: trophy,
        rendererSettings: {
          preserveAspectRatio: "xMidYMid slice"
        }
    };

    return TrophyOption;
}

const Sidebar = props =>{

    //context
    const {menuOpen,setMenuOpen} = useContext(AppContext);
    const {user} = useContext(UserContext);
    const {dataProfile,point,setPoint,listHabits} = useContext(DataContext);

    // sign -error-warning-loading-success
    const defaultSign = {loading: false,success: false,warning: false,error: false,text: 'loading...',button: []}
    const [sign,setSign] = useState(defaultSign);
    const [modalSign,setModalSign] = useState({show: false,lock: false});
    
    //// logout
    const [isLogout,setIsLogout] = useState(false);    
    useEffect(()=> isLogout && window.location.reload(true) ,[isLogout]);    
    const logoutHandler =()=>{
        logout();
        props.history.push("/");
        setIsLogout(true);
        localStorage.clear();
    }

    const logoutClick = ()=>{
        setSign({...defaultSign,error: true,text: `Sign out ?`,button: [
            {textButton: 'yap',color: 'rgba(0,0,0,0.8)',bgColor: 'white',hoverBgColor: 'rgba(0,0,0,0.2)',action: ()=>{
                logoutHandler();
            }},
            {textButton: 'nope',color: 'white',bgColor: '#90a4ae',hoverBgColor: '#62757f',action: ()=>{
                setModalSign({show: false,lock: false});
            }},
        ]});
        setModalSign({show: true,lock: false});
    }

    //// change name
    const [modal,setModal] = useState({show: false,lock: false});
    const [name,setName] = useState(user.name);
    const validationName = value => setName(value);
    const saveName = ()=>{
        saveSpecificDataProfile({id: user.uid},{name: name});
        setModal({show: false,lock: false});
    }


    ///click menu
    const [onClick,setOnClick] = useState(false);
    const clickMenu = id =>{
        setOnClick(prev => !prev);
        setMenuOpen({id: id})
    }


    useEffect(()=>{
        dataProfileOnSnapshot({id: user.uid},(result)=>{
            let point = 0;
            if(result.data()){
                const {statisticGoodHabits,statisticFocus} = result.data();
                if(statisticGoodHabits){
                    /// calculate total point
                    const pointGoodHabits = JSON.parse(statisticGoodHabits).reduce((a,b)=> a + b.grades,0);
                    point += pointGoodHabits;
                }

                if(statisticFocus){
                    const pointFocus = JSON.parse(statisticFocus).reduce((a,b) => a + b.point,0);
                    point += pointFocus;
                }
            }
            setPoint(point);
        })
    },[]);

    const [totalList,setTotalList] = useState({total: 10,totalFinish: 0});
    console.log(totalList);
    useEffect(()=>{
        let total = 0;
        let totalFinish = 0;
        listHabits.forEach(outer =>{
            outer.doHabits.forEach(inner =>{
                total += 1;
                if(inner.check) totalFinish += 1;
            })
        })
        setTotalList({total: total || 10,totalFinish});
    },[listHabits]);

    const clickMenuHandler = id =>{
        clickMenu(id);
        if(props.phone){
            props.onClick();
        }
    }


    return (
        <React.Fragment>

            <Modal overflowY="auto" lock={modalSign.lock} borderRadius="1rem" padding="3rem" top="50%" left="50%" show={modalSign.show} handler={()=>setModalSign({show: false,lock: false})} minWidth="40rem" maxHeight="95vh" minHeight="20rem" bgColor="white" display="flex" alignItems="center" justifyContent="center">
                <Sign loading={sign.loading}  success={sign.success} warning={sign.warning} error={sign.error} text={sign.text} button={sign.button} />
            </Modal>

            <Modal overflowY="auto" lock={modal.lock} borderRadius="1rem" padding="3rem" top="50%" left="50%" show={modal.show} handler={()=>setModal({show: false,lock: false})} minWidth="40rem" maxHeight="95vh" minHeight="20rem" bgColor="white" display="flex" alignItems="center" justifyContent="center">
                <Box display="flex" alignItems="center" flexDirection="column" width="100%" height="100%">
                    <Box flexDirection="column" display="flex" alignItems="flex-start" justifyContent="center">
                        <Label fontSize="2rem" htmlFor="namenew" margin="0 0 1rem 0" color="rgba(0,0,0,0.6)">Name</Label>
                        <Input value={name} validation={validationName} bgColorFocus="white" bgColor="#e6e6e6" borderFocus="0px 0px 2px 3px #6c91f9" borderRadius="1rem  " border="none" padding="1rem 3rem" fontSize="2rem"  name="namenew" type="text" placeholder="your new name..." />
                    </Box>
                    <Box margin="5rem 0 0 0" width="100%" height="4rem" display="flex" justifyContent="flex-end" alignItems="center">
                        {name !== '' && <Button onClick={saveName} display="flex" alignItems="center" justifyContent="center" width="auto" height="100%" padding="1rem 4rem" bgColor="#3791e8" hoverBgColor="#1968b5" color="white" fontSize="1.7" unitSize="rem" borderRadius=".5rem">
                            change
                        </Button>}
                    </Box>
                </Box>
            </Modal>

            <Container  transition="all .3s" transform={props.phone && ((props.show) ? 'translateX(0%)':'translateX(-100%)')}  position="fixed" top="0" left="0" zIndex={props.phone ? "250" : "10"}  width={props.phone ? '80%': '20vw'} height="100vh" bgColor="white" >

                <Box width="100%" height="100%" overflowY="auto" bgColor="#ececec">

                    <Box bgColor="#7350b1" width="100%" height="7rem" display="flex" justifyContent="center" alignItems="center">
                        <LogoImage width="4rem" height="4rem" />
                        <Text color="white" fontSize="2rem" fontWeight="600" margin="0 0 0 2rem">Good Habits</Text>
                    </Box>

                    {/* profile box */}
                    <Box flexDirection="column" overflowX="hidden" display="flex" alignItems="center" justifyContent="center"  position="relative" width="100%" height="25rem" >
                        <Box  bgColor="#7350b1" top="-20%" left="50%" width="100%" height="30rem" position="absolute" transform="translate(-50%,-50%)" />
                        <Box zIndex="2" bgColor="#ececec" width="15rem" height="15rem" display="flex" alignItems="center" justifyContent="center" borderRadius="50%" overflowY="hidden" overflowX="hidden">
                            <GetAvatar width="100%" height="100%" avatarId={dataProfile.avatar}/>
                        </Box>
                        <Box margin="2rem 0 1rem 0" display="flex" justifyContent="space-around" alignItems="center">
                            <Text margin="0 2rem 0 0" fontSize="2rem" fontWeight="600" color="rgba(0,0,0,0.6)" textTransform="capitalize">
                                {dataProfile.name}
                            </Text>
                            <Button onClick={()=>{
                                setModal({show: true,lock: false});
                                if(props.phone){
                                    props.onClick();
                                }
                            }} width="auto" display="flex" justifyContent="space-around" alignItems="center" color="rgba(0,0,0,0.7)" >
                                <FontAwesomeIcon icon={faEdit} />
                            </Button>
                        </Box>
                        <Text fontSize="1.3rem" color="rgba(0,0,0,0.4)">{`${point} xp`}</Text>
                    </Box>

                    {/* menu */}
                    <Box padding="1rem" flexDirection="column" display="flex" alignItems="center" justifyContent="center"  width="100%" >
                        {/* dashboard */}
                        <Button hoverBgColor="#ae88f3" onClick={()=>clickMenuHandler(1)}  bgColor={menuOpen.id === 1 ? "#9761f7" : "#d4d4d6"}  margin="1rem 0" flexDirection="column" padding="1rem" borderRadius="1rem" width="100%"  display="flex" alignItems="center" justifyContent="space-between" >
                            <Text fontSize="1.7rem" color="white" fontWeight="600">Dashboard</Text>
                            <Box height="10rem">
                                <Lottie options={AnimationOption(DiagramAnimation,false)} height={80} width={80} />
                            </Box>
                        </Button>
                        {/* good habits */}
                        <Button hoverBgColor="#ae88f3" onClick={()=>clickMenuHandler(2)} bgColor={menuOpen.id === 2 ? "#9761f7" : "#d4d4d6"} margin="1rem 0" flexDirection="column" padding="1rem" borderRadius="1rem" width="100%"  display="flex" alignItems="center" justifyContent="space-between" >
                            <Text fontSize="1.7rem" color="white" fontWeight="600">Good Habits</Text>
                            <Box display="flex" alignItems="center" justifyContent="space-around" flexDirection="column"  height="10rem" width="100%">
                                <Text fontSize="1.3rem" color="rgba(0,0,0,0.7)">progress today</Text>
                                <Box overflowY="hidden" overflowX="hidden" width="100%" borderRadius="6px" height="1rem" bgColor="#ececec">
                                    <Box height="100%" width={`${Math.round((100 / totalList.total) * totalList.totalFinish)}%`} bgColor="#ecaf47" borderRadius="1rem" />
                                </Box>
                                <Text color="#424569" fontSize="2rem" fontWeight="600" margin="0 auto">
                                    {`${Math.round((100 / totalList.total) * totalList.totalFinish)}%`}
                                </Text>
                            </Box>
                        </Button>
                        {/* daily activity */}
                        <Button hoverBgColor="#ae88f3" onClick={()=>clickMenuHandler(3)} bgColor={menuOpen.id === 3 ? "#9761f7" : "#d4d4d6"} margin="1rem 0" flexDirection="column" padding="1rem" borderRadius="1rem" width="100%"  display="flex" alignItems="center" justifyContent="space-between" >
                            <Text fontSize="1.7rem" color="white" fontWeight="600">Daily Activity</Text>
                            <Box height="10rem">
                                <Lottie options={AnimationOption(CyclingAnimation,false)} height={80} width={80} />
                            </Box>
                        </Button>
                        {/* resolution */}
                        <Button hoverBgColor="#ae88f3" onClick={()=>clickMenuHandler(4)} bgColor={menuOpen.id === 4 ? "#9761f7" : "#d4d4d6"} margin="1rem 0" flexDirection="column" padding="1rem" borderRadius="1rem" width="100%"  display="flex" alignItems="center" justifyContent="space-between" >
                            <Text fontSize="1.7rem" color="white" fontWeight="600">Resolution</Text>
                            <Box height="10rem">
                                <Lottie options={AnimationOption(NotepadAnimation,false)} height={80} width={80} />
                            </Box>
                        </Button>
                        {/* focus */}
                        <Button hoverBgColor="#ae88f3" onClick={()=>clickMenuHandler(5)} bgColor={menuOpen.id === 5 ? "#9761f7" : "#d4d4d6"} margin="1rem 0" flexDirection="column" padding="1rem" borderRadius="1rem" width="100%"  display="flex" alignItems="center" justifyContent="space-between" >
                            <Text fontSize="1.7rem" color="white" fontWeight="600">Focus</Text>
                            <Box height="10rem">
                                <Lottie options={AnimationOption(FocusAnimation,false)} height={80} width={80} />
                            </Box>
                        </Button>

                        {/* loguout */}
                        <Button onClick={logoutClick} hoverBgColor="#f16f9b" display="flex" alignItems="center" justifyContent="center" width="100%" boxShadow="0px 0px 10px -2px rgba(0,0,0,0.3)" bgColor="#e91e63"  height="5rem" borderRadius="1rem" margin="2rem 0" >
                            <Box margin="0 2rem" display="flex" alignItems="center" justifyContent="center" fontSize="2rem" color="white">
                                <FontAwesomeIcon icon={faSignOutAlt} />
                            </Box>
                            <Text fontSize="2rem" color="white">Sign out</Text>
                        </Button>

                    </Box>


                </Box>
            </Container>    
        </React.Fragment>
    )
}


export default withRouter(Sidebar);

