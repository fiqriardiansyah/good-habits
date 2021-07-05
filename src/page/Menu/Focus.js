import React,{useContext,useEffect,useState,useCallback,useRef} from 'react';
import Styled from 'styled-components';
import Lottie from 'react-lottie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStepForward,faRedoAlt,faExpandArrowsAlt,faQuestionCircle,faCog,faCheckSquare,faCompress,faPause,faPlay,faEdit} from '@fortawesome/free-solid-svg-icons';  

import {ReactComponent as FocusImage} from '../../image/focus.svg';
import {ReactComponent as RileksImage} from '../../image/rileks.svg';

import QuestionAnimation from '../../animation/question.json';

//utils
import {StyleBasic} from '../../utils/globalSetElement';
import {getTime} from '../../utils/utils';

//context
import {DataContext} from '../../context/dataContext';
import {UserContext} from '../../context/userContext';


//firebase
import {saveSpecificDataProfile,getDataProfile,dataProfileOnSnapshot} from '../../firebase/firebaseFunction';

//components
import Box from '../../components/Box';
import Text from '../../components/Text';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import Input from '../../components/Input';
import RadioInput from '../../components/RadioInput';
import Sign from '../../components/Sign';

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

const NumberButton = props =>{
    return (
        <Box>
            <Text margin="1rem 0" fontSize="1.7rem" color="rgba(0,0,0,0.4)" fontWeight="500">{props.title}</Text>
            <Box height="6rem" display="flex" alignItems="center">
                <Box height="100%" alignItems="center" display="flex" justifyContent="center" margin="0 1rem 0 0"  width="10rem" borderRadius="1rem" bgColor="#929292" color="white" fontSize="3rem" fontWeight="600" >
                    {props.children}
                </Box>
                <Box height="100%" display="flex" justifyContent="center" alignItems="center" flexDirection="column">
                    <Box onClick={props.increment} fontWeight="600" display="flex" justifyContent="center" alignItems="center" margin="0 0 1rem" cursor="pointer" width="3rem" borderRadius=".5rem" bgColor="#d8d8d8" color="white" fontSize="2rem"   >
                        +
                    </Box>
                    <Box onClick={props.decrement} fontWeight="600" display="flex" justifyContent="center" alignItems="center" cursor="pointer" width="3rem" borderRadius=".5rem" bgColor="#d8d8d8" color="white" fontSize="2rem"   >
                        -
                    </Box>
                </Box>
            </Box>
            
        </Box>
    )
}

const colors = ['#ec407a','#ab47bc','#5c6bc0','#42a5f5','#66bb6a','#ffee58','#ffa726','#ff7043','#8d6e63','#78909c'];

const Focus = props =>{

    //context
    const {dataProfile,resolution,setResolution,resolutionAdvice,tempResolutionAdvice,setTempResolutionAdvice} = useContext(DataContext);
    const {user} = useContext(UserContext);

    //setting
    const [freeMode,setFreeMode] = useState(false); 
    const [modalSetting,setModalSetting] = useState({show: false,lock: false});
    const [modalTask,setModalTask] = useState({show: false,lock: false});
    const [layout,setLayout] = useState({timer: true});

    const {color,workTime,breakTime,autoNext,task,round} = JSON.parse(localStorage.getItem('setting-focus')) || {color: '#ec407a',workTime: 25,breakTime: 5,autoNext: true,task: '',round: 4};

    const [setting,setSetting] = useState({color,workTime,breakTime,autoNext,task,round});
    const saveSetting = value =>{
        setSetting(value);
        // save to local
        localStorage.setItem('setting-focus',JSON.stringify(value));
    }

    const [heightWaves,setHeightWaves] = useState(100);
    const [session,setSession] = useState({work: true,break: false});
    const [start,setStart] = useState({work: false,break: false});
    const [milisecondTimeWork,setMilisecondTimeWork] = useState(setting.workTime * 60000);
    const [milisecondTimeBreak,setMilisecondTimeBreak] = useState(setting.breakTime * 60000);
    const [timeWork,setTimeWork] = useState({minute: setting.workTime,second: 0});
    const [timeBreak,setTimeBreak] = useState({minute: setting.breakTime,second: 0});
    const [tempTask,setTempTask] = useState('');
    const [restartButton,setRestartButton] = useState(false);
    const [nextButton,setNextButton] = useState(false);
    const [modalRound,setModalRound] = useState({show: false,lock: false});
    const [modalFinish,setModalFinish] = useState({show: false,lock: false});
    const [modalQuestion,setModalQuestion] = useState({show: false,lock: false});

    const container = useRef();

    const openFullscreen = ()=> {
        setFreeMode(true);
        if(container.current){
            if (container.current.requestFullscreen) {
                container.current.requestFullscreen();
            } else if (container.webkitRequestFullscreen) { /* Safari */
            container.current.webkitRequestFullscreen();
            } else if (container.msRequestFullscreen) { /* IE11 */
            container.current.msRequestFullscreen();
            }
        }
    }
    function closeFullscreen() {
        if(Document){
            setFreeMode(false);
            if (Document.exitFullscreen) {
                Document.exitFullscreen();
              } else if (Document.webkitExitFullscreen) { /* Safari */
                Document.webkitExitFullscreen();
              } else if (Document.msExitFullscreen) { /* IE11 */
                Document.msExitFullscreen();
              }
        }
    }
    const [Document,setDocument] = useState();
    useEffect(()=>{
        setDocument(document);
    },[]);

    useEffect(()=>{
        if(start.work){

            if(milisecondTimeWork === (setting.workTime * 60000)){
                setLayout({timer: false});
                setTimeout(()=>{
                    setLayout({timer: true});
                },2000);
            }

            let timeInterval = setInterval(()=>{
                if(milisecondTimeWork > 0){
                    setMilisecondTimeWork(prev => prev - 1000);
                    setTimeWork({
                        minute: Math.floor((milisecondTimeWork-1000) / 60000),
                        second: Math.round(((milisecondTimeWork-1000) / 1000) % 60)
                    });
                    setHeightWaves( milisecondTimeWork / ((setting.workTime * 60000) / 100) );
                }else{
                    setSession({work: false,break: true});
                    setStart({work: false,break: true});
                    clearInterval(timeInterval);
                }
            },1000);
            return ()=> clearInterval(timeInterval);
        }
    },[start.work,milisecondTimeWork]);

    useEffect(()=>{
        if(start.break){

            if(milisecondTimeBreak === (setting.breakTime * 60000)){
                setLayout({timer: false});
                setTimeout(()=>{
                    setLayout({timer: true});
                },2000);
            }

            let timeInterval = setInterval(()=>{
                if(milisecondTimeBreak > 0){
                    setMilisecondTimeBreak(prev => prev - 1000);
                    setTimeBreak({
                        minute: Math.floor((milisecondTimeBreak-1000) / 60000),
                        second: Math.round(((milisecondTimeBreak-1000) / 1000) % 60)
                    });
                    setHeightWaves( milisecondTimeBreak / ((setting.breakTime * 60000) / 100) );
                }else{
                    // ///////////////// user finish they work
                    if((round+1) - setting.round === round){
                        setModalFinish({show: true,lock: false});

                        getDataProfile({id: user.uid},(result)=>{

                            const dateAsId = `${getTime.date()}-${getTime.month()}-${getTime.year()}`;

                            if(result.data()){
                                const {statisticFocus,pointFocus} = result.data();
                                if(statisticFocus){
                                    const st = JSON.parse(statisticFocus);

                                    const getTodayFocus = st.find(el => el.id === dateAsId);
                                    const notTodayFocus = st.filter(el => el.id !== dateAsId);

                                    if(getTodayFocus){

                                        const temp = {...getTodayFocus,timeWork: getTodayFocus.timeWork + (setting.workTime * round),point: getTodayFocus.point + ((setting.workTime * 10) * round) };
                                        
                                        saveSpecificDataProfile({id: user.uid},{
                                            pointFocus: pointFocus + ((setting.workTime * 10) * round),
                                            statisticFocus: JSON.stringify([...notTodayFocus,temp])
                                        });

                                    }else{
                                        saveSpecificDataProfile({id: user.uid},{
                                            pointFocus: pointFocus + ((setting.workTime * 10) * round),
                                            statisticFocus: JSON.stringify([...st,{id: dateAsId,timeWork: setting.workTime * round,point: (setting.workTime * 10) * round}])
                                        });
                                    }

                                }else{
                                    saveSpecificDataProfile({id: user.uid},{
                                        pointFocus: (setting.workTime * 10) * round,
                                        statisticFocus: JSON.stringify([{id: dateAsId,timeWork: setting.workTime * round,point: (setting.workTime * 10) * round}])
                                    });
                                }
                            }
                        })
                        
                    }

                    if(setting.round === 1){
                        setRestartButton(true);
                        setSession({work: false,break: false});
                        setStart({work: false,break: false});
                    }else{
                        if(!setting.autoNext){
                            setNextButton(true);
                        }else{
                            setModalRound({show: true,lock: false});
                            setTimeout(()=>{
                                setModalRound({show: false,lock: false});
                            },2000);
                            setSetting({...setting,round: setting.round > 1 ? setting.round -1 : setting.round-0 });
                            setStart({work: true,break: false});
                            save();
                        }
                    }
                    clearInterval(timeInterval);
                }
            },1000);
            return ()=> clearInterval(timeInterval);
        }
    },[start.break,milisecondTimeBreak]);


    useEffect(()=>{
        dataProfileOnSnapshot({id: user.uid},(result)=>{
            if(result.data()){
                const {statisticFocus} = result.data();
                console.log(statisticFocus);
            }
        });
    },[]);

    const startPauseClick =()=>{
        if(session.work){
            setStart({work: !start.work,break: false});
        }else{
            setStart({work: false,break: !start.break});
        }
    }

    const save = ()=>{
        setModalSetting({show: false,lock: false});
        setMilisecondTimeWork(setting.workTime * 60000);
        setMilisecondTimeBreak(setting.breakTime * 60000);
        setTimeWork({minute: setting.workTime,second: 0});
        setTimeBreak({minute: setting.breakTime,second: 0});
        setHeightWaves(100);
        setSession({work: true,break: false});
        setRestartButton(false);
        setNextButton(false);
    }

    const addTask = ()=>{
        saveSetting({...setting,task: tempTask});
        setModalTask({show: false,lock: false});
    }

    const nextClick =()=>{
        setModalRound({show: true,lock: false});
        setTimeout(()=>{
            setModalRound({show: false,lock: false});
        },2000);
        setSetting({...setting,round: setting.round > 1 ? setting.round -1 : setting.round-0 });
        setStart({work: true,break: false});
        save();
        setRestartButton(false);
        setNextButton(false);
    }

    const restartClick =()=>{
        setSetting({...setting,round: round});
        setRestartButton(false);
        setNextButton(false);
        setStart({work: true,break: false});
        save();
    }

    

    return (
        <React.Fragment>

            <Modal overflowX="hidden" flexDirection="column" overflowY="auto" lock={modalQuestion.lock} borderRadius="1rem" padding="3rem" top="50%" left="50%" show={modalQuestion.show} handler={()=>setModalQuestion({show: false,lock: false})} minWidth="40rem" maxHeight="95vh" minHeight="20rem" bgColor="white" >
                <Lottie options={AnimationOption(QuestionAnimation,true)} height={300} width={300} />
                <Box flexDirection="column" display="flex" alignItems="center" justifyContent="center" width="100%" bgColor="#8181f9" borderRadius="1rem" padding="2rem">
                    <Text margin="2rem 0" fontSize="1.7rem" color="white">
                        Kalau waktu belajar atau kerja kamu sebetulnya banyak, tapi nggak ada satu pun kerjaan atau sesi belajar kamu yang beres, berarti kamu sering terdistraksi banyak hal. Solusinya teknik Pomodoro!
                    </Text>
                    <ul style={{width: '100%',marginLeft: '3rem'}}>
                        <li style={{fontSize: '1.5rem',color: 'rgba(255,255,255,0.5)'}}>
                            buat judul task yang akan kamu kerjakan
                        </li>
                        <li style={{fontSize: '1.5rem',color: 'rgba(255,255,255,0.5)'}}>
                            Teknik pomodoro membagi waktu focus menjadi interval selama 25 menit. Setelah 25 menit,kamu bisa beristirahat 5 menit. dan akan diulangi selama 4 sesi atau ronde ,tenang kamu bisa atur waktu dan sesinya sesukamu!
                        </li>
                        <li style={{fontSize: '1.5rem',color: 'rgba(255,255,255,0.5)'}}>
                            jika kamu menyelesaikan 1 sesi maka kamu berhak mendapatkan xp sesuai waktu focusmu (1 menit x 10 xp)
                        </li>
                    </ul>
                </Box>
            </Modal>

            <Modal flexDirection="column" overflowY="auto" lock={modalTask.lock} borderRadius="1rem" padding="3rem" top="50%" left="50%" show={modalTask.show} handler={()=>setModalTask({show: false,lock: false})} minWidth="40rem" maxHeight="95vh" minHeight="20rem" bgColor="white" display="flex" alignItems="center" justifyContent="center">
                <Input value={tempTask} validation={(value)=>{setTempTask(value)}} bgColorFocus="white" bgColor="#e6e6e6" borderFocus="0px 0px 2px 3px #6c91f9" borderRadius="1rem  " border="none" padding="1rem 3rem" fontSize="2rem"  name="task" type="text" placeholder="task" />
                <Box display="flex" margin="2rem" alignItems="center" justifyContent="flex-end" width="100%">
                    {tempTask !== '' && <Button onClick={addTask} padding="1rem 3rem" height="4rem" width="auto" borderRadius="1rem" bgColor="#42a5f5" color="white" fontSize="2" unitSize="rem">
                        Add
                    </Button>}
                </Box>
            </Modal>

            <Modal flexDirection="column" overflowY="auto" lock={modalSetting.lock} borderRadius="1rem" padding="3rem" top="50%" left="50%" show={modalSetting.show} handler={()=>setModalSetting({show: false,lock: false})} minWidth="40rem" maxHeight="95vh" minHeight="20rem" bgColor="white" >
                <Box width="100%" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                    {/* time */}
                    <Box width="100%" display="flex" flexDirection="column">
                        <Text fontWeight="600" fontSize="2.5rem" color="rgba(0,0,0,0.5)" margin="2rem 0">Times (minute)</Text>
                        <Box display="flex" width="100%" alignItems="center" justifyContent="space-around">
                            <NumberButton 
                                increment={()=>saveSetting({...setting,workTime: setting.workTime < 120 ? setting.workTime + 1 : setting.workTime + 0})} 
                                decrement={()=>saveSetting({...setting,workTime: setting.workTime > 1 ? setting.workTime - 1 : setting.workTime - 0 })} title="work">{setting.workTime}</NumberButton>
                            <NumberButton 
                                increment={()=>saveSetting({...setting,breakTime: setting.breakTime < 120 ? setting.breakTime + 1 : setting.breakTime + 0  })} 
                                decrement={()=>saveSetting({...setting,breakTime: setting.breakTime > 1 ? setting.breakTime - 1 : setting.breakTime - 0 })} title="break">{setting.breakTime}</NumberButton>
                        </Box>
                    </Box>
                    <Box margin="2rem 0" width="100%" height="3px" bgColor="rgba(0,0,0,0.4)" borderRadius="1rem" />
                    {/* next round */}
                    {setting.round > 1 &&
                    <Box  width="100%" display="flex" alignItems="center" justifyContent="space-between">
                        <Text fontWeight="600" fontSize="2.5rem" color="rgba(0,0,0,0.5)" margin="2rem 0">Auto next round</Text>
                        <Button onClick={()=>saveSetting({...setting,autoNext : !setting.autoNext})} color={setting.autoNext ? "#55559e" : "rgba(0,0,0,0.4)"} padding="1rem" width="auto" fontSize="3" unitSize="rem" bgColor="transparent">
                            <FontAwesomeIcon icon={faCheckSquare} />
                        </Button>
                    </Box> }
                    {/* round */}
                    <Box  width="100%" display="flex" alignItems="center" justifyContent="space-between">
                        <NumberButton 
                            increment={()=>saveSetting({...setting,round: setting.round < 10 ? setting.round + 1 : setting.round + 0  })} 
                            decrement={()=>saveSetting({...setting,round: setting.round > 1 ? setting.round - 1 : setting.round - 0 })} title="round">{setting.round}</NumberButton>
                    </Box>
                    
                    <Box margin="2rem 0" width="100%" height="3px" bgColor="rgba(0,0,0,0.4)" borderRadius="1rem" />
                    {/* background color */}
                    <Box flexDirection="column"  width="100%" display="flex" >
                        <Text fontWeight="600" fontSize="2.5rem" color="rgba(0,0,0,0.5)" margin="2rem 0">Background color</Text>
                        <Box width="100%" gridGap="1rem" display="grid" gridTemplateColumns="repeat(auto-fit,minmax(5rem,1fr))" >
                            {colors.map((val,i)=>{
                                return (
                                    <Button key={i} border={setting.color === val ? "2px solid black" : ""} onClick={()=>saveSetting({...setting,color: val})} width="5rem" height="5rem" bgColor={val} borderRadius="1rem" />
                                )
                            })}
                        </Box>
                    </Box>
                    {/* button save */}
                    <Box margin="2rem 0" width="100%" height="3px" bgColor="rgba(0,0,0,0.4)" borderRadius="1rem" />
                    <Box width="100%" display="flex" alignItems="center" justifyContent="flex-end" >
                        <Button onClick={save} color="white" width="auto" height="4rem" borderRadius="1rem" bgColor="#42a5f5" fontSize="2" unitSize="rem" padding="1rem 3rem" >
                            save
                        </Button>
                    </Box>
                </Box>
            </Modal>

            <Box overflowX="hidden" ref={container} width="100%" height="100vh" padding="2rem"  position="relative">

                <Modal flexDirection="column" overflowY="auto" lock={modalRound.lock} borderRadius="1rem" padding="3rem" top="50%" left="50%" show={modalRound.show} handler={()=>setModalRound({show: false,lock: false})} minWidth="40rem" maxHeight="95vh" minHeight="20rem" bgColor="white" display="flex" alignItems="center" justifyContent="center">
                    <Box width="100%" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                        <Text textAlign="center" fontSize="4rem" fontWeight="600" color="rgba(0,0,0,0.5)">{`Round ${(round+1) - setting.round}`}</Text>
                    </Box>
                </Modal>

                <Modal flexDirection="column" overflowY="auto" lock={modalFinish.lock} borderRadius="1rem" padding="3rem" top="50%" left="50%" show={modalFinish.show} handler={()=>setModalFinish({show: false,lock: false})} minWidth="40rem" maxHeight="95vh" minHeight="20rem" bgColor="white" display="flex" alignItems="center" justifyContent="center">
                    <Box width="100%" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                        <Text textAlign="center" margin="2rem" fontSize="4rem" fontWeight="600" color="rgba(0,0,0,0.8)">
                            {`${round} ronde telah selesai!`}
                        </Text>
                        <Text margin="1rem 0" >kamu dapat</Text>
                        <Text textAlign="center" fontSize="1.7rem" color="rgba(0,0,0,0.4)">
                            <span>{setting.workTime * 10}</span>
                            <span>{` x ${round} (round) = `}</span>
                            <span styl={{fontWeight: '600',color: 'rgba(0,0,0,0.7)'}}>{`${(setting.workTime * 10) * round} xp`}</span>
                        </Text>
                    </Box>
                </Modal>

                <Box alignItems="flex-start" overflowY="hidden" transition="all .3s" position="relative" bgColor={`${setting.color}`} width="100%" height="100%" borderRadius="1rem" display="flex"  justifyContent="center"  position="relative">
                    <Box zIndex="1" padding="0 3rem" display="flex" alignItems="center" justifyContent="space-between" position="absolute" top="0" left="0" height="8rem" width="100%">
                        {setting.task !== '' &&
                        <Button onClick={freeMode ? ()=>closeFullscreen() : ()=>openFullscreen()} fontWeight="600" display="flex" alignItems="center" width="auto" padding="1rem 3rem" color="rgba(0,0,0,0.3)" bgColor="rgba(255,255,255,0.5)" borderRadius="1rem" fontSize="2" unitSize="rem">
                            <FontAwesomeIcon icon={freeMode ? faCompress : faExpandArrowsAlt} />
                            <Text margin="0 0 0 1rem" fontSize="2rem" color="rgba(0,0,0,0.3)">
                                {freeMode ? 'Shrink':'Free Mode'}
                            </Text>
                        </Button> }
                        {(!freeMode && !start.work && !start.break) &&
                        <Box display="flex" alignItems="center">
                            <Button hoverColor="white" onClick={()=>setModalSetting({show: true,lock: true})} width="auto" display="flex" justifyContent="center" alignItems="center" fontSize="3" unitSize="rem" color="rgba(255,255,255,0.5)">
                                <FontAwesomeIcon icon={faCog} />
                            </Button>
                            <Button onClick={()=>setModalQuestion({show: true,lock: false})} hoverColor="white" margin="0 3rem" width="auto" display="flex" justifyContent="center" alignItems="center" fontSize="3" unitSize="rem" color="rgba(255,255,255,0.5)">
                                <FontAwesomeIcon icon={faQuestionCircle} />
                            </Button>
                        </Box> }
                    </Box>
                    

                    
                    <Box transition="all .4s" transform={`translateY(${layout.timer ? '0': '-50'}%)`} height="200%" display="flex" alignItems="center" flexDirection="column" justifyContent="space-around">
                        <Box width="100%" display="flex" flexDirection="column" alignItems="center" justifyContent="center" >
                            {round !== 1 &&
                            <Text margin="1rem 0" fontSize="3rem" color="rgba(0,0,0,0.4)" fontWeight="600">
                                {`Round ${(round+1) - setting.round}`}
                            </Text> }
                            <Box position="relative" overflowY="hidden" overflowX="hidden" width="30rem" height="30rem" borderRadius="50%" >
                                <div className="water" style={{transform: `translateY(${heightWaves}%)`}}>
                                    <div className="ripple-one"></div>
                                    <div className="ripple-two"></div>   
                                    <div className="ripple-three"></div>
                                </div>
                                <Box display="flex" alignItems="center" justifyContent="center" zIndex="10" width="100%" height="100%" position="absolute" left="0" top="0">
                                    {session.work ? 
                                    <Text fontSize="5rem" color="white" fontWeight="600">
                                        {`${timeWork.minute.toString().padStart(2,"0")}:${timeWork.second.toString().padStart(2,"0")}`}
                                    </Text>
                                    :
                                    <Text fontSize="5rem" color="white" fontWeight="600">
                                        {`${timeBreak.minute.toString().padStart(2,"0")}:${timeBreak.second.toString().padStart(2,"0")}`}
                                    </Text>
                                    }
                                </Box>
                            </Box>
                            {setting.task === '' ?
                            <Button onClick={()=>setModalTask({show: true,lock: false})} hoverColor="white" margin="2rem 0" height="6rem" borderRadius="1rem" color="rgba(255,255,255,0.4)" bgColor="rgba(0,0,0,0.3)" width="auto" padding="1rem 3rem" fontSize="2.5" unitSize="rem">
                                Apa yang kamu kerjakan?
                            </Button>
                            :
                            <React.Fragment>
                                {restartButton &&
                                    <Button onClick={restartClick} margin="2rem 0" width="auto" padding="1rem 3rem" color="white" bgColor="rgba(0,0,0,0.4)" borderRadius="1rem" fontSize="2.5" unitSize="rem">
                                        <FontAwesomeIcon icon={faRedoAlt} />
                                    </Button>
                                }
                                {nextButton &&
                                    <Button onClick={nextClick} margin="2rem 0" width="auto" padding="1rem 3rem" color="white" bgColor="rgba(0,0,0,0.4)" borderRadius="1rem" fontSize="2.5" unitSize="rem">
                                        <FontAwesomeIcon icon={faStepForward} />
                                    </Button>
                                }
                                {!restartButton && !nextButton &&
                                <Button onClick={startPauseClick} margin="2rem 0" width="auto" padding="1rem 3rem" color="white" bgColor="rgba(0,0,0,0.4)" borderRadius="1rem" fontSize="2.5" unitSize="rem">
                                    {(start.work || start.break) ? 
                                        <FontAwesomeIcon icon={faPause} />
                                        :
                                        <FontAwesomeIcon icon={faPlay} />}
                                </Button>}
                            </React.Fragment>
                             }
                            {setting.task !== '' && session.work &&
                                <Box display="flex" alignItems="center">
                                    <Text fontSizePhone="3rem" margin="0 2rem 0 0" textTransform="capitalize" fontSize="4rem" fontWeight="600" color="rgba(255,255,255,0.4)">{setting.task}</Text>
                                    {!freeMode && !start.work && !start.break &&
                                    <Button onClick={()=>setModalTask({show: true,lock: false})} fontSize="3" unitSize="rem" color="rgba(255,255,255,0.4)" hoverColor="white" fontWeight="600" width="auto">
                                        <FontAwesomeIcon icon={faEdit} />
                                    </Button>}
                                </Box>
                            }
                            {session.break && <Text margin="0 2rem 0 0" textTransform="capitalize" fontSize="4rem" fontWeight="600" color="rgba(255,255,255,0.4)">
                                BREAK
                            </Text>}
                        </Box>

                        <Box width="100%" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                            {session.work ? 
                                <React.Fragment>
                                    <FocusImage width="20rem" height="20rem" />
                                    <Text margin="2rem 0" fontSize="3rem" fontWeight="600" color="rgba(0,0,0,0.5)">FOCUS TIME</Text>
                                </React.Fragment>
                                :
                                <React.Fragment>
                                    <RileksImage width="20rem" height="20rem" />
                                    <Text margin="2rem 0" fontSize="3rem" fontWeight="600" color="rgba(0,0,0,0.5)">BREAK TIME</Text>
                                </React.Fragment>
                            }
                        </Box>
                    </Box>

                </Box>
            </Box>
        </React.Fragment>
    )
}

export default Focus;