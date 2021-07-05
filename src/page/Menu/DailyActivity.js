import React,{useContext,useEffect,useState} from 'react';
import Styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrophy,faExpand,faCalendarDay,faWalking,faBoxOpen,faPlus,faQuestionCircle} from '@fortawesome/free-solid-svg-icons';  
import Lottie from 'react-lottie';
import CyclingAnimation from '../../animation/cycling.json';
import NotepadAnimation from '../../animation/notepad.json';
import EmptyAnimation from '../../animation/empty.json';
import QuestionAnimation from '../../animation/question.json';

import {ReactComponent as Emoji} from '../../image/emoticon/emoticon_1.svg';

//utils
import {mediaQueries} from '../../utils/mediaQueries';
import {StyleBasic} from '../../utils/globalSetElement';
import {getRandomColor,getTime,GetEmoticon} from '../../utils/utils';

//context
import {DataContext} from '../../context/dataContext';
import {UserContext} from '../../context/userContext';


//component menu
import Header from './component/Header';

//firebase
import {dailyActivityOnSnapshot,saveDailyActivity} from '../../firebase/firebaseFunction';

//components
import {SelectAnEmoticon,DailyActivity} from '../../components/components';
import Box from '../../components/Box';
import Text from '../../components/Text';
import Button from '../../components/Button';
import Modal from '../../components/Modal';

const Container = Styled(StyleBasic("div"))``;

function groupByKey(array, key) {
    return array
        .reduce((hash, obj) => {
        if(obj[key] === undefined) return hash; 
        return Object.assign(hash, { [obj[key]]:( hash[obj[key]] || [] ).concat(obj)})
        }, {});
}

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

const Activity = props =>{

    const color = getRandomColor();

    return (
        <Box margin="0 0 1rem 0" overflowY="hidden" overflowX="hidden" bgColor={`${color}99`}  borderRadius="1rem" width="100%" display="flex" flexDirection="column" alignItems="center">
            <Box padding="1rem" width="100%" display="flex" alignItems="center" justifyContent="space-between">
                <Box bgColor={color} alignItems="center" justifyContent="center" display="flex"  fontSize="4rem" color="white" width="6rem" height="6rem" borderRadius="100px" >
                    {props.additionActivity ?
                    <FontAwesomeIcon icon={faPlus} />
                    :
                    <FontAwesomeIcon icon={props.val.icon} />
                    }
                </Box>
                <Text color="white" fontSize="2rem" textTransform="capitalize">
                    {props.additionActivity ? props.val.title : props.val.name}
                </Text>
            </Box>
            <Box width="100%" bgColor={color} padding="1rem" margin="1rem 0 0 0" display="flex " alignItems="center" justifyContent="center">
                {props.additionActivity ? 
                    <React.Fragment>
                        {props.val.description === '' ?
                            <React.Fragment>
                                <Box margin="0 1rem 0 0" fontSize="2rem" color="rgba(255,255,255,0.4)">
                                    <FontAwesomeIcon icon={faBoxOpen} />
                                </Box>
                                <Text color="rgba(255,255,255,0.4)" fontSize="1.5rem">Tidak ada catatan</Text>
                            </React.Fragment>
                        :
                            <Text color="white" fontSize="1.5rem">{props.val.description}</Text> 
                        }
                    </React.Fragment>
                    :
                    <React.Fragment >
                        {props.val.note === '' ?
                        <React.Fragment>
                            <Box margin="0 1rem 0 0" fontSize="2rem" color="rgba(255,255,255,0.4)">
                                <FontAwesomeIcon icon={faBoxOpen} />
                            </Box>
                            <Text color="rgba(255,255,255,0.4)" fontSize="1.5rem">Tidak ada catatan</Text>
                        </React.Fragment>
                        :
                        <Text color="white" fontSize="1.5rem">{props.val.note}</Text> 
                        }
                    </React.Fragment>
                }

            </Box>
        </Box>
    )
}

const ActivityBox = props=>{

    const [hover,setHover] = useState(false);

    const totalActivity = props.val.activity.activity.length + props.val.activity.additionActivity.length

    return (
        <Box onClick={()=>props.onClick(props.val)} onMouseOver={()=>setHover(true)} onMouseLeave={()=>setHover(false)} cursor="pointer" borderRadius="1rem" position="relative" width="100%" height="30rem" bgColor={`${props.color}99`} >
            <Box bgColor={props.color} width="1rem" height="100%" position="absolute" top="0" left="0" />
            <Box width="100%" position="absolute" top="50%" left="50%" transform="translate(-50%,-50%)">
                <Box padding="0 5rem" width="100%" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                    <Box transition="all .3s" bgColor={props.color} width="13rem" height="13rem" borderRadius={hover ? '1rem' : '100px'} display="flex" alignItems="center" justifyContent="center">
                        <Text color="white" fontSize="4rem" fontWeight="600">
                            {`${getTime.hours(props.val.time)}:${getTime.minutes(props.val.time)}`}
                        </Text>
                    </Box>
                    <Text margin="1rem 0" fontSize="1.7rem" fontWeight="600" color="rgba(0,0,0,0.7)" textTransform="capitalize">
                        {getTime.day(props.val.time)}
                    </Text>
                    <Box margin="1rem 0" fontSize="2rem" color="rgba(0,0,0,0.7)" width="100%" display="flex" alignItems="center" justifyContent="space-between">
                        <FontAwesomeIcon icon={faCalendarDay} />
                        <Text fontSize="1.7rem">{props.val.id.split("-").join(" ")}</Text>
                    </Box>
                    <Box margin="1rem 0" fontSize="2rem" color="rgba(0,0,0,0.7)" width="100%" display="flex" alignItems="center" justifyContent="space-between">
                        <FontAwesomeIcon icon={faWalking} />
                        <Text fontSize="1.7rem" textTransform="capitalize">
                            {`${totalActivity} Kegiatan`}
                        </Text>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

const ListActivityContainer = props =>{
    return (
        <Box margin="0 0 3rem 0" width="100%">
            <Text margin="2rem 0" fontSize="2rem" color="rgba(0,0,0,0.8)" TextTransform="capitalize">
                {props.val.id.split("-").join(" ")}
            </Text>
            <Box width="100%" display="grid" gridGap="1rem" gridTemplateColumns="repeat(auto-fit, minmax(20rem, 1fr))">
                {props.val.data.map((val,i)=>{
                    return <ActivityBox onClick={props.onClick} key={i} val={val} color={getRandomColor()} />
                })}
            </Box>
        </Box>
    )
}


const DailyActivityMenu = props =>{

    ///context
    const {dummyActivity,dataActivity,setDataActivity,defaultDataActivity} = useContext(DataContext);
    const {user} = useContext(UserContext);

    const [isAddNewActivity,setIsAddNewActivity] = useState(false);

    //modal
    const [modal,setModal] = useState({show: false,lock: false});

    //check daily activity
    ////////////////////////////////////////////////
    const [checkDailyActivity,setCheckDailyActivity] = useState({start: false,action: {step: 1,closeAnimation: false}});
    const nextCheckDailyActivityHandler = ()=>{
        setCheckDailyActivity({...checkDailyActivity,action: {...checkDailyActivity.action,closeAnimation: true}});
        setTimeout(()=>{
            setCheckDailyActivity({...checkDailyActivity,action: {...checkDailyActivity.action,step: checkDailyActivity.action.step + 1,closeAnimation: false}});
        },2000);
    }
    const startCheckDailyActivity = ()=>{
        setIsAddNewActivity(true);
        setCheckDailyActivity({start: true,action: {step: 1,closeAnimation: false}});
    }
    const save = ()=>{
        setCheckDailyActivity({start: false,action: {step: 1,closeAnimation: false}});
        saveDailyActivity({id: user.uid,activity: dataActivity,emoticon: dataActivity.emoticon },()=>{
            save();
        });
        setDataActivity(defaultDataActivity);
        setIsAddNewActivity(false);
    }
    ////////////////////////////////////////////////
    
    const [activityList,setActivityList] = useState([]);
    useEffect(()=>{
        dailyActivityOnSnapshot({id: user.uid},(result)=>{
            let arr = [];
            result.forEach(element =>{
                const {time,activity,emoticon} = element.data();
                const id = element.id.split("[*divider*]")[0];
                arr.push({id,time,activity: JSON.parse(activity),emoticon});
            });
            
            const group = groupByKey(arr,'id');
            
            const resultArray = Object.keys(group).map(el => {
                return {id: el,data: [...group[el]]};
            })
            console.log(resultArray);
            setActivityList(resultArray);
        });
    },[]);

    //////////////////////////////////// modal detail activity
    const [modalDetail,setModalDetail] = useState({show: false,lock: false});
    const [detailActivity,setDetailActivity] = useState();

    const showDetail = val =>{
        setDetailActivity(val);
        console.log(val);
        setModalDetail({show: true,lock: false});
    }

    /////////////////////////////// question
    const [modalQuestion,setModalQuestion] = useState({show: false,lock: false});

    return (
        <React.Fragment>
            <Modal overflowX="hidden" flexDirection="column" overflowY="auto" lock={modalQuestion.lock} borderRadius="1rem" padding="3rem" top="50%" left="50%" show={modalQuestion.show} handler={()=>setModalQuestion({show: false,lock: false})} minWidth="40rem" maxHeight="95vh" minHeight="20rem" bgColor="white" display="flex" alignItems="center" justifyContent="center">
                <Lottie options={AnimationOption(QuestionAnimation,true)} height={300} width={300} />
                <Box display="flex" alignItems="center" justifyContent="center" width="100%" bgColor="#8181f9" borderRadius="1rem" padding="2rem">
                    <Text fontSize="1.7rem" color="white">
                        Di bagian Daily Activity ini kamu bisa membuat catatan tentang kegiatan kamu dalam hari itu, kamu bisa menambahkan catatan sebanyak yang kamu mau!
                    </Text>
                </Box>
            </Modal>

            <Modal overflowY="auto" lock={modalDetail.lock} borderRadius="1rem" padding="3rem" top="50%" left="50%" show={modalDetail.show} handler={()=>setModalDetail({show: false,lock: false})} minWidth="40rem" maxHeight="95vh" minHeight="20rem" bgColor="white">
                {detailActivity && 
                <Box width="100%" display="flex" flexDirection="column" alignItems="center">
                    <Box width="100%" padding="1rem" bgColor="rgba(0,0,0,0.2)" borderRadius="1rem" display="flex" alignItems="center">
                        <GetEmoticon iconId={detailActivity.emoticon} width="12rem" height="12rem" />
                        <Box flexDirection="column" display="flex" justifyContent="center" alignItems="flex-end">
                            <Text fontSize="2rem" color="rgba(0,0,0,0.6)">{detailActivity.id.split("-").join(" ")}</Text>
                            <Text fontSize="5rem">
                                {`${getTime.hours(detailActivity.time)}:${getTime.minutes(detailActivity.time)}`}
                            </Text>
                        </Box>
                    </Box>
                    <Text margin="2rem 0 5rem 0" fontSize="2.5rem" color="rgba(0,0,0,0.8)">Activity</Text>
                    {detailActivity.activity.activity.map((val,i)=>{
                        return <Activity val={val} key={i} />
                    })}
                    {detailActivity.activity.additionActivity.map((val,i)=>{
                        return <Activity additionActivity={true} val={val} key={i} />
                    })}
                    {detailActivity.activity.activity.length === 0 && detailActivity.activity.additionActivity &&
                        <React.Fragment>
                            <Lottie options={AnimationOption(EmptyAnimation,true)} height={200} width={200} />
                            <Text fontSize="1.6rem" color="rgba(0,0,0,0.7)">Ooops tidak ada kegiatan</Text>
                        </React.Fragment>
                    }
                </Box> }
            </Modal>

            <Container flexDirection="column" position="relative" width="100%" height="100%" display="flex" justifyContent="center" >
                {/* header */}
                <Header title="daily activity" >
                    <Box width="100%" height="auto" display="flex" justifyContent="flex-end" alignItems="center">
                        {!isAddNewActivity && <Button mediaQueries={`${mediaQueries("sm")`height: 5rem !important;`}`} display="flex" alignItems="center" justifyContent="center" onClick={startCheckDailyActivity} height="4rem" borderRadius="1rem" padding="1rem 3rem" bgColor="#8bbaf9" color="white" fontSize="1.7" unitSize="rem"  >
                            New note!
                        </Button>}
                    </Box>
                </Header>
                {/* body */}
                
                <Box mediaQueries={`${mediaQueries("sm")`padding: 0 1rem !important;`}`} padding="0 5rem" width="100%" height="100%"  overflowY="auto">
                    {isAddNewActivity ? 
                        <React.Fragment>
                            {checkDailyActivity.start &&
                            <Box padding="10rem 0" mediaQueries={`${mediaQueries("sm")`width: 100%;`}`} margin="auto" display="flex" alignItems="center" justifyContent="center">
                                {checkDailyActivity.action.step === 1 && <SelectAnEmoticon transition="1s" opacity={checkDailyActivity.action.closeAnimation ? '0': '1'} onClick={nextCheckDailyActivityHandler} />}
                                {checkDailyActivity.action.step === 2 && <DailyActivity transition="1s" opacity={checkDailyActivity.action.closeAnimation ? '0': '1'} onClick={save} />}
                            </Box> }
                        </React.Fragment>
                        :
                        <React.Fragment>
                            <Box mediaQueries={`${mediaQueries("sm")`flex-direction: column-reverse;`}`} position="relative" width="100%" minHeight="20rem" borderRadius="1rem" bgColor="#d9e5f5" padding="2rem" display="flex" alignItems="center" justifyContent="space-around"> 
                                <Button width="auto" display="flex" justifyContent="center" alignItems="center" onClick={()=>setModalQuestion({show: true,lock: false})} position="absolute" top="1rem" right="1rem" fontSize="3" unitSize="rem" color="rgba(0,0,0,0.7)">
                                    <FontAwesomeIcon icon={faQuestionCircle} />
                                </Button>
                                <Box height="100%" display="flex" alignItems="center" justifyContent="space-around" flexDirection="column">
                                    <Text fontSize="2.5rem" margin="2rem 0">Kegiatan yang sudah kamu lakukan</Text>
                                    <Button onClick={startCheckDailyActivity} height="4rem" borderRadius="1rem" padding="1rem 3rem" bgColor="#8bbaf9" color="white" fontSize="1.7" unitSize="rem"  >
                                        Ayo buat catatan baru!
                                    </Button>
                                </Box>
                                <Box height="20rem">
                                    <Lottie options={AnimationOption(CyclingAnimation,true)} height={200} width={200} />
                                </Box>
                            </Box>
                            <Box>
                                {activityList && activityList.map((val,i)=>{
                                    return <ListActivityContainer onClick={showDetail} key={i} val={val} />
                                }).reverse()}
                            </Box>
                        </React.Fragment>
                    }
                </Box>

            </Container>
        </React.Fragment>
    )
}

export default DailyActivityMenu;