import React,{useContext,useEffect,useState,memo,useCallback} from 'react';
import Styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight,faArrowLeft} from '@fortawesome/free-solid-svg-icons';  
import Lottie from 'react-lottie';
import { Bar ,defaults,Doughnut,Line } from 'react-chartjs-2';
import DiagramAnimation from '../../animation/diagram.json';

//utils
import {mediaQueries} from '../../utils/mediaQueries';
import {StyleBasic} from '../../utils/globalSetElement';

import Box from '../../components/Box';
import Text from '../../components/Text';
import Modal from '../../components/Modal'; 
import Button from '../../components/Button'; 

//context
import {AppContext} from '../../context/appContext';
import {DataContext} from '../../context/dataContext';
import {UserContext} from '../../context/userContext';

//firebase
import {dataProfileOnSnapshot,dailyActivityOnSnapshot} from '../../firebase/firebaseFunction';

import Rating from './Rating';

const DoughnutDiagram = memo(Doughnut);
const LineDiagram = memo(Line);
const BarDiagram = memo(Bar);


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

const optionsBar = {
    title: {
        display: true,
        text: 'Based on your productivity percent',
        fontSize: 20,
        fontColor: '#343452'
    }
    ,
    aspectRatio: 1
}
const optionsDoughnut = {
    title: {
        display: true,
        text: 'Your mood',
        fontSize: 20,
        fontColor: '#343452'
    }
}
const optionsLine = {
    title: {
        display: true,
        text: 'Based on your focus time (minutes)',
        fontSize: 20,
        fontColor: '#343452'
    }
}

const colorLevel = ['#e71610','#ed1e79','#1092f0','#21b485','#edc734'];
const xpLevel = [1000,3000,5000,7000,10000];


const calculateLevel=(point)=>{
    const lev = xpLevel.find(el => el > point);
    const levBarWidth = (100 / lev) * point;
    return {level: xpLevel.indexOf(lev) + 1,levBarWidth};
}


const Dashboard = props =>{
    //context
    const {menuOpen,setMenuOpen} = useContext(AppContext);
    const {point} = useContext(DataContext);
    const {user} = useContext(UserContext);

    const [indexGoodHabits,setIndexGoodHabits] = useState({front: 0,back: 7});
    const [indexFocus,setIndexFocus] = useState({front: 0,back: 7});
    const [goodHabitsData,setGoodHabitsData] = useState({label: [],data: []});
    const [showDataGoodHabits,setShowDataGoodHabits] = useState({label: [],data: []});
    const [focusData,setFocusData] = useState({label: [],data: []});
    const [showDataFocus,setShowDataFocus] = useState({label: [],data: []});
    const [mood,setMood] = useState([]);

    defaults.global.defaultFontFamily = 'Montserrat';
    const dataDoughnut = {
        datasets: [
            {
                label: 'Your mood',
                data: mood,
                backgroundColor: ['#4dd0e1','#66bb6a','#ffca28','#ff7043','#e91e63'],
            }
        ],
        labels: ['keren','baik','biasa','buruk','sangat buruk']
    }
    const dataBar = {
        labels: showDataGoodHabits.label,
        datasets: [
            {
                label: 'Good Habits',
                data: showDataGoodHabits.data,
                backgroundColor: [
                    '#f06292','#ba68c8','#7986cb','#64b5f6','#81c784','#fff176','#ffb74d'
                ],
                borderWidth: 1,
                borderColor: '#777',
                hoverBorderWidth: 2,
                hoverBorderColor: '#343452'
            }
        ]
    };
    const dataLine = {
        labels: showDataFocus.label,
        datasets: [
            {
                label: 'Your focus time',
                data: showDataFocus.data,
                backgroundColor: '#9761f787',
                borderWidth: 4,
                borderColor: '#9761f7',
                pointBackgroundColor: '#9761f7',
                pointRadius: 5,
                pointBorderWidth: 0,
                lineTension: 0
            }
        ]
    };

    const paginationDataGoodHabits = useCallback(()=>{
        if(goodHabitsData.label.lengt <= 7){
            setShowDataGoodHabits(goodHabitsData);
        }else{
            const tempLabel = goodHabitsData.label.slice(indexGoodHabits.front,indexGoodHabits.back);
            const tempData = goodHabitsData.data.slice(indexGoodHabits.front,indexGoodHabits.back);
            setShowDataGoodHabits({label: tempLabel,data: tempData});
        }
    })

    const moveShowDataGoodHabits =(arrow)=>{
        const lengthData = goodHabitsData.label.length;
        if(arrow === -1){
            if((indexGoodHabits.front - 1) >= 0) setIndexGoodHabits({...indexGoodHabits,front: indexGoodHabits.front-1,back: indexGoodHabits.back-1});
        }else{
            if((arrow+indexGoodHabits.back) <= lengthData) setIndexGoodHabits({...indexGoodHabits,front: indexGoodHabits.front+1,back: indexGoodHabits.back+1});
        }
    }

    useEffect(()=>{
        paginationDataGoodHabits();
    },[indexGoodHabits]);

    useEffect(()=>{
        paginationDataGoodHabits();
        setIndexGoodHabits({front: goodHabitsData.label.length - 7, back: goodHabitsData.label.length});
    },[goodHabitsData]);


    const moveShowDataFocus =(arrow)=>{
        const lengthData = focusData.label.length;
        if(arrow === -1){
            if((indexFocus.front - 1) >= 0) setIndexFocus({...indexFocus,front: indexFocus.front-1,back: indexFocus.back-1});
        }else{
            if((arrow+indexFocus.back) <= lengthData) setIndexFocus({...indexFocus,front: indexFocus.front+1,back: indexFocus.back+1});
        }
    }

    const paginationDataFocus = useCallback(()=>{
        if(focusData.label.lengt <= 7){
            setShowDataFocus(focusData);
        }else{
            const tempLabel = focusData.label.slice(indexFocus.front,indexFocus.back);
            const tempData = focusData.data.slice(indexFocus.front,indexFocus.back);
            setShowDataFocus({label: tempLabel,data: tempData});
        }
    });

    useEffect(()=>{
        paginationDataFocus();
    },[indexFocus]);

    useEffect(()=>{
        paginationDataFocus();
        setIndexFocus({front: focusData.label.length - 7, back: focusData.label.length});
    },[focusData]);

    useEffect(()=>{
        dataProfileOnSnapshot({id: user.uid},(result)=>{
            if(result.data()){
                const {statisticGoodHabits,statisticFocus} = result.data();

                if(statisticGoodHabits){
                    let label = [];
                    let data = [];
                    JSON.parse(statisticGoodHabits).forEach((val,i)=>{
                        label.push(val.id.split("-").join(" "));
                        data.push(val.grades);
                    })
                    setGoodHabitsData({...goodHabitsData,label,data});
                }

                if(statisticFocus){
                    let label = [];
                    let data = [];
                    JSON.parse(statisticFocus).forEach((val,i)=>{
                        label.push(val.id.split("-").join(" "));
                        data.push(val.timeWork);
                    })
                    setFocusData({...focusData,label,data});
                }
            }
        });

        dailyActivityOnSnapshot({id: user.uid},(result)=>{
            let emoticons = [];
            let moods = [];
            result.forEach(element =>{
                const {emoticon} = element.data();
                emoticons.push(emoticon);
            });
            [...new Array(5)].forEach((el,i) =>{
                const arr = emoticons.filter((val)=> val === `emoticon_${i+1}`);
                moods.push(arr);
            })
            moods = moods.map(val => val.length);
            setMood(moods);
        });
    },[]);
    

    
    const [modalChamp,setModalChamp] = useState({show: false,lock: false});

    return (
        <React.Fragment>
            <Modal flexDirection="column" overflowY="auto" lock={modalChamp.lock} borderRadius="1rem" padding="3rem" top="50%" left="50%" show={modalChamp.show} handler={()=>setModalChamp({show: false,lock: false})} maxWidth="95vw" minWidth="40rem" maxHeight="95vh" minHeight="20rem" bgColor="white" >
                <Rating />
            </Modal>
            <Container mediaQueries={`${mediaQueries("sm")`padding: 1rem !important;`}`} flexDirection="column" padding="5rem" width="100%" height="100%" display="flex" justifyContent="center" alignItems="flex-start">
                {/* jumbotro */}
                <Box mediaQueries={`${mediaQueries("sm")`flex-direction: column-reverse;min-height: 50rem;`}`} display="flex" alignItems="center" justifyContent="space-around" margin="0 0 2rem 0" overflowX="hidden" overflowY="hidden" position="relative" width="100%" minHeight="20rem" borderRadius="1rem" bgColor="#823cff" padding="1rem">
                    <Box top="50%" right="-30%" transform="translate(-50%,-50%)" width="50rem" height="50rem" borderRadius="50%" bgColor="#9761f7" position="absolute"  />
                    
                    <Box zIndex="1" height="100%" justifyContent="center" flexDirection="column" display="flex" alignItems="center" >
                        <Text margin="2rem 0" fontSize="2.5rem" color="white">Ayo mulai aktifitas mu!</Text>
                        <Box display="flex" alignItems="center" >
                            <Button mediaQueries={`${mediaQueries("sm")`font-size: 1.5rem;height: 5rem;`}`} onClick={()=>setMenuOpen({id: 2})} display="flex" alignItems="center" justifyContent="center" height="4rem" margin="0 1rem" padding="1rem 3rem" bgColor="#ae88f3" fontSize="1.7" unitSize="rem" color="white" borderRadius="1rem">
                                Good Habits
                            </Button>
                            <Button mediaQueries={`${mediaQueries("sm")`font-size: 1.5rem;height: 5rem;`}`} onClick={()=>setMenuOpen({id: 3})} display="flex" alignItems="center" justifyContent="center" height="4rem" margin="0 1rem" padding="1rem 3rem" bgColor="#ae88f3" fontSize="1.7" unitSize="rem" color="white" borderRadius="1rem">
                                Daily activity
                            </Button>
                            <Button mediaQueries={`${mediaQueries("sm")`font-size: 1.5rem;height: 5rem;`}`} onClick={()=>setMenuOpen({id: 4})} display="flex" alignItems="center" justifyContent="center" height="4rem" margin="0 1rem" padding="1rem 3rem" bgColor="#ae88f3" fontSize="1.7" unitSize="rem" color="white" borderRadius="1rem">
                                Resolution
                            </Button>
                        </Box>
                    </Box>
                    
                    <Box width="25rem">
                        <Lottie options={AnimationOption(DiagramAnimation,true)} height={250} width={250} />
                    </Box>
                </Box>
                
                <Box  mediaQueries={`${mediaQueries("sm")`
                            flex-direction: column;
                            min-height: 100vh !important;
                        `}`} minHeight="40rem" width="100%" display="flex"  justifyContent="space-between">
                        <Box mediaQueries={`${mediaQueries("sm")`margin: 0px 0px 5rem 0px;`}`} flexDirection="column" display="flex" alignItems="center" justifyContent="center" padding="1rem" flex="2" margin="0 2rem 0 0" bgColor="#fbfbfb" borderRadius="1rem">
                            {showDataGoodHabits.label.length === 0 ? 
                                <Box display="flex" flexDirection="column" display="flex" alignItems="center">
                                    <Text margin="1rem 0" fontSize="2.5rem" color="rgba(0,0,0,0.4)">masih kosong nih...</Text>
                                    <Text fontSize="1.7rem">Ayo kerjakan goal harianmu!</Text>
                                </Box>
                            :
                            <React.Fragment>
                                {props.isPhone ? 
                                    <BarDiagram  width={350} height={350} data={dataBar} options={optionsBar} />
                                    :
                                    <BarDiagram data={dataBar} options={optionsBar} />
                                }
                                {goodHabitsData.label.length > 7 &&
                                <Box width="100%" height="10rem" display="flex" justifyContent="space-around" alignItems="center">
                                    <Button onClick={()=>moveShowDataGoodHabits(-1)} fontSize="2" unitSize="rem" color="grey" display="flex" justifyContent="center" alignItems="center">
                                        <FontAwesomeIcon icon={faArrowLeft} />
                                    </Button>
                                    <Text fontSize="1.5rem">
                                        {`${showDataGoodHabits.label[0]} - ${showDataGoodHabits.label[showDataGoodHabits.label.length - 1]}`}
                                    </Text>
                                    <Button onClick={()=>moveShowDataGoodHabits(1)} fontSize="2" unitSize="rem" color="grey" display="flex" justifyContent="center" alignItems="center">
                                        <FontAwesomeIcon icon={faArrowRight} />
                                    </Button>
                                </Box> }
                            </React.Fragment>
                            }
                        </Box>
                        <Box flexDirection="column" display="flex" alignItems="center" justifyContent="center" flex="1" bgColor="#fbfbfb" borderRadius="1rem">
                            <DoughnutDiagram data={dataDoughnut} options={optionsDoughnut} width={250} height={250} />
                        </Box>
                    </Box>
                    
                    <Box mediaQueries={`${mediaQueries("sm")`
                            flex-direction: column;
                            min-height: 100vh !important;
                        `}`} margin="2rem 0" minHeight="40rem" width="100%" display="flex"  justifyContent="space-between">
                        
                        <Box padding="2rem" mediaQueries={`${mediaQueries("sm")`margin: 0px 0px 5rem 0px;`}`} margin="0 2rem 0 0" flexDirection="column" display="flex" alignItems="center" justifyContent="center" flex="1" bgColor="#823cff" borderRadius="1rem">
                            <Text margin="2rem 0" fontSize="5rem" fontWeight="600" color="white">{`LV.${calculateLevel(point).level}`}</Text>
                            <Box display="flex" alignItems="center" justifyContent="space-between" overflowX="hidden" overflowY="hidden" width="100%" height="2rem" borderRadius="1rem" bgColor="rgba(0,0,0,0.1)">
                                <Box width={`${Math.round(calculateLevel(point).levBarWidth)}%`} display="flex" alignItems="center" justifyContent="flex-end" bgColor={colorLevel[calculateLevel(point).level-1]}  height="100%" borderRadius="1rem" >
                                    <Text color="white" fontWeight="600" >{point}</Text>
                                </Box>
                                <Text color="white" fontWeight="300" >{xpLevel[calculateLevel(point).level-1]}</Text>
                            </Box>
                            
                            <Box onClick={()=>setModalChamp({show: true,lock: false})} transition="all .2s" hoverColor="white" cursor="pointer" margin="2rem 0 0 0" display="flex" fontSize="1.6rem" color="rgba(255,255,255,0.5)" justifyContent="flex-end" alignItems="center" width="100%">
                                <Text hoverColor="white" margin="0 1rem 0 0" fontSize="1.5rem" color="rgba(255,255,255,0.8)">Championship</Text>
                                <FontAwesomeIcon icon={faArrowRight} />
                            </Box>

                        </Box>

                        <Box flexDirection="column" display="flex" alignItems="center" justifyContent="center" padding="1rem" flex="2" bgColor="#fbfbfb" borderRadius="1rem">
                            {showDataFocus.label.length === 0 ? 
                                <Box display="flex" flexDirection="column" display="flex" alignItems="center">
                                    <Text margin="1rem 0" fontSize="2.5rem" color="rgba(0,0,0,0.4)">masih kosong nih...</Text>
                                    <Text fontSize="1.7rem">Ayo coba FOCUS hari ini</Text>
                                </Box>
                            :
                            <React.Fragment>
                                {props.isPhone ? 
                                    <LineDiagram width={350} height={350} data={dataLine} options={optionsLine} />
                                    :
                                    <LineDiagram data={dataLine} options={optionsLine} />
                                }
                                
                                {focusData.label.length > 7 &&
                                <Box width="100%" height="10rem" display="flex" justifyContent="space-around" alignItems="center">
                                    <Button onClick={()=>moveShowDataFocus(-1)} fontSize="2" unitSize="rem" color="grey" display="flex" justifyContent="center" alignItems="center">
                                        <FontAwesomeIcon icon={faArrowLeft} />
                                    </Button>
                                    <Text fontSize="1.5rem">
                                        {`${showDataFocus.label[0]} - ${showDataFocus.label[showDataFocus.label.length - 1]}`}
                                    </Text>
                                    <Button onClick={()=>moveShowDataFocus(1)} fontSize="2" unitSize="rem" color="grey" display="flex" justifyContent="center" alignItems="center">
                                        <FontAwesomeIcon icon={faArrowRight} />
                                    </Button>
                                </Box> }
                            </React.Fragment>
                            }
                        </Box>
                </Box>
                   
                
            </Container>
        </React.Fragment>
    
    )
}

export default Dashboard;



