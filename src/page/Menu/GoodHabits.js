import React,{useContext,useEffect,useState,useLayoutEffect} from 'react';
import Styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus,faTrashAlt,faTasks,faFolderPlus,faCheck,faCheckSquare,faWindowClose,faQuestionCircle} from '@fortawesome/free-solid-svg-icons';  
import Lottie from 'react-lottie';
import YogaAnimation from '../../animation/yoga.json';
import TrophyAnimation1 from '../../animation/trophy_1.json';
import TrophyAnimation2 from '../../animation/trophy_2.json';
import TrophyAnimation3 from '../../animation/trophy_3.json';
import EmptyAnimation from '../../animation/empty.json';
import QuestionAnimation from '../../animation/question.json';
import OfficeAnimation from '../../animation/office.json';

//utils
import {mediaQueries} from '../../utils/mediaQueries';
import {StyleBasic} from '../../utils/globalSetElement';
import {getRandomColor,getTime} from '../../utils/utils';
//menu component
import Header from './component/Header';

//context
import {DataContext} from '../../context/dataContext';
import {UserContext} from '../../context/userContext';

///component
import {SelectAnHabits} from '../../components/components';
import Box from '../../components/Box';
import Button from '../../components/Button';
import Text from '../../components/Text';
import Modal from '../../components/Modal';
import Input from '../../components/Input';
import Auth from '../../components/Auth';

//firebase
import {saveListHabitsToFinish,getListHabitsToDay,utilsUser,getDataProfile,dataProfileOnSnapshot,saveListHabits,saveGoodHabits,saveListHabitsDaily,listHabitsDailyOnSnapshot,saveListHabitsDailyFinish} from '../../firebase/firebaseFunction';

//utils
import {GetIconHabits} from '../../utils/utils';

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

const cutText = (text,length) =>{
    if(text.length > length) return `${text.slice(0,length)}...`
    return text
}

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


const FinishGoal = props =>{

    const calculate =()=>{
        let total = 0;
        let totalFinish = 0;
        props.val.listHabits.forEach(val =>{
            val.doHabits.forEach(el =>{
                total++;
                if(el.check) totalFinish++;
            });
        });

        const grades = Math.floor((100 / total) * totalFinish);
         
        return {point: grades,star: Math.floor(grades / 20),total,totalFinish}
    }

    const [hover,setHover] = useState(false);

    return (
        <Box overflowX="hidden" overflowY="hidden" bgColor={calculate().point === 100 ? "#fdbf6d"  : (calculate().point > 50 ? "#babcbd" : "#9a816c")} transition="all .5s" onClick={()=>props.onClick(props.val)} onMouseOver={()=>setHover(true)} onMouseLeave={()=>setHover(false)}  cursor="pointer" display="flex" alignItems="center"  width="100%" height="35rem" borderRadius="1rem" position="relative">
            <Box zIndex="1" position="absolute" top="50%" left="50%" transition="all .5s"  transform="translate(-50%,-50%)" display="flex" flexDirection="column" alignItems="center"  borderRadius="1rem" minWidth="20rem" maxWidth="50%" height="100%">
                <Lottie options={AnimationOption(calculate().point === 100 ? TrophyAnimation1 : (calculate().point > 50 ? TrophyAnimation2 : TrophyAnimation3),false)} height={150} width={150} />
                <Text fontSize="2rem" margin="1rem 0">
                    {[...new Array(calculate().star)].map(() => `⭐`)}
                </Text>
                <Text fontSize="1.4rem" color="rgba(255,255,255,0.5)">{`+ ${calculate().point}xp`}</Text>
                <Text fontSize="2rem" margin="1rem 0 0 0" color="white" fontWeight="600">{props.val.id.split("-").join(" ")}</Text>
                <Box justifyContent="center"  margin="2rem 1rem 2rem 0" width="100%" display="flex" alignItems="center" >
                    <Box fontSize="2rem" color="rgba(255,255,255,0.5)" display="flex" alignItems="center" justifyContent="center">
                        <FontAwesomeIcon icon={faCheckSquare} />
                    </Box>
                    <Text margin="0 1rem" fontSize="1.6rem" color="rgba(255,255,255,0.5)" textTransform="capitalize">
                        {`${calculate().totalFinish} selesai dari ${calculate().total}`}
                    </Text>
                </Box>
            </Box>
            <Box bgColor={calculate().point === 100 ? "#ff9928"  : (calculate().point > 50 ? "#78909c" : "#8b572a")} transition="all .5s" left={hover ? "20%" : "0"} top={hover ? "20%" : "0"} transform="translate(-50%,-50%)" width="20rem" height="20rem" borderRadius="50%" position="absolute" />
            <Box bgColor={calculate().point === 100 ? "#ff9928"  : (calculate().point > 50 ? "#78909c" : "#8b572a")}  transition="all .2s" right={hover ? "-100%" : "-200%"} bottom={hover ? "-50%" : "-200%"}  width="40rem" height="40rem" borderRadius="50%" position="absolute" />
        </Box>
    );
}

const BoxList = props =>{

    return (
        <Box pointerEvents={props.isActive ? 'auto' : 'none'} opacity={props.isActive ? '1' : '0.4'} margin="1rem 0" justifyContent="space-between" borderLeft={`5px solid ${props.isGoal ? '#f7545c' : '#8585f3'}`} alignItems="center" display="flex" padding="1rem 3rem" borderRadius=".5rem" boxShadow="3px 1px 8px 0px rgba(0,0,0,0.3)" bgColor="white" width="100%" display="flex" >
            <Text fontSize="1.5rem">
                {cutText(props.val.name,16)}
            </Text>
            <Button  color={props.isGoal ? '#f7545c' : '#8585f3'} width="auto" display="flex" justifyContent="center" alignItems="center" onClick={props.isActive ? props.onClick : ()=>{}} fontSize="2" unitSize="rem">
                {props.isGoal ? 
                    <FontAwesomeIcon icon={faTrashAlt} />
                : 
                    <FontAwesomeIcon icon={faPlus} />
                }
            </Button>
        </Box>
    )
}

const BoxHabit = props =>{

    const {goodHabits,setDataGoodHabits} = useContext(DataContext);

    const addHabits = value =>{
        const goodHabit = goodHabits.find(el => el.id === props.val.id);  //obj
        const tempGoodHabits = goodHabits.filter(el => el.id !== props.val.id); // array
        const temp = [...tempGoodHabits,{...goodHabit,habits: {...goodHabit.habits,doHabits: [...goodHabit.habits.doHabits,value]}}];
        setDataGoodHabits(temp.sort((a,b)=> (a.id < b.id) ? -1 : 1));
    }

    const checkIfExist = val =>{
        const goodHabit = goodHabits.find(el => el.id === props.val.id);  //obj
        const any = goodHabit.habits.doHabits.find(el => el.id === val.id);
        
        if(any) return false;
        return true;
    }

    const [addList,setAddList] = useState({show: false,name: ''});

    const addListHandler = val =>{

        setAddList({show: false,name: ''});
        const goodHabit = goodHabits.find(el => el.id === props.val.id);  //obj
        const tempGoodHabits = goodHabits.filter(el => el.id !== props.val.id); // array
        const temp = [...tempGoodHabits,{...goodHabit,habits: {...goodHabit.habits,doHabits: [...goodHabit.habits.doHabits,{id: goodHabit.habits.doHabits.length + 1,name: addList.name,check: false}]}}];
        setDataGoodHabits(temp.sort((a,b)=> (a.id < b.id) ? -1 : 1));

    }



    return (
        <React.Fragment>


            <Modal lock={false} borderRadius="1rem" padding="3rem" top="50%" left="50%" show={addList.show} handler={()=>setAddList({show: false,name: ''})} minWidth="40rem" minHeight="20rem" bgColor="white" display="flex" alignItems="center" justifyContent="center">
                <Box display="flex" alignItems="center" flexDirection="column" width="100%" height="100%">
                    <Box flexDirection="column" display="flex" alignItems="flex-start" justifyContent="center">
                        <Input value={addList.name} validation={(value)=> setAddList({...addList,name: value})} bgColorFocus="white" bgColor="#e6e6e6" borderFocus="0px 0px 2px 3px #6c91f9" borderRadius="1rem  " border="none" padding="1rem 3rem" fontSize="2rem" type="text" placeholder="kegiatan" />
                    </Box>
                    <Box margin="5rem 0 0 0" width="100%" height="4rem" display="flex" justifyContent="flex-end" alignItems="center">
                        {addList.name !== '' && <Button onClick={addListHandler} display="flex" alignItems="center" justifyContent="center" width="auto" height="100%" padding="1rem 4rem" bgColor="#3791e8" hoverBgColor="#1968b5" color="white" fontSize="1.7" unitSize="rem" borderRadius=".5rem">
                            Tambahkan
                        </Button>}
                    </Box>
                </Box>
            </Modal>

            <Box padding="2rem" width="100%" borderRadius="1rem" bgColor="#faf9f8" display="flex" flexDirection="column" alignItems="center">
                <Text margin="0 0 1rem 0" fontSize="3rem" textTransform="capitalize" fontWeight="500">
                    {props.val.title}
                </Text>
                {(props.val.id < 5) ?
                <Box display="flex" alignItems="center" justifyContent="center">
                    <GetIconHabits iconId={props.val.icon} width={props.isPhone ? '8rem':'15rem'} height={props.isPhone ? '8rem':'15rem'} />
                </Box> :
                <Box borderRadius="100px" bgColor="white" padding="1rem" fontSize="15rem" display="flex" justifyContent="center" alignItems="center" color={`${getRandomColor()}`}>
                    <FontAwesomeIcon icon={props.val.icon} />
                </Box>
                }
                <Box width="100%" margin="3rem 0 0 0" flexDirection="column" display="flex" alignItems="center" justifyContent="center" >
                    {/* list */}
                    {props.val.habits.availableHabits.map((val,i) =>{
                        return (
                            <BoxList isActive={checkIfExist(val)} onClick={()=>addHabits(val)} key={i} val={val} isGoal={false} />
                        )
                    })}
                    <Button fontSize="1.7" unitSize="rem" onClick={()=>setAddList({...addList,show: true})} justifyContent="center" borderLeft="5px solid blue" alignItems="center" display="flex" padding="1rem 3rem" borderRadius=".5rem" boxShadow="3px 1px 8px 0px rgba(0,0,0,0.3)" bgColor="white" width="100%" display="flex" >
                        tambah list
                    </Button>
                </Box>
            </Box>
        </React.Fragment>
    )
}

const BoxHabitDone = props =>{

    //context
    const {listHabits,setListHabits} = useContext(DataContext);
     const {user} = useContext(UserContext);
    

    const checkHabits = ()=>{
        const habit = listHabits.find(el => el.id === props.val.id); // obj
        const habits = listHabits.filter(el => el.id !== props.val.id); //arr

        const obj = habit.doHabits.find(el => el.id === props.el.id);
        const objs = habit.doHabits.filter(el => el.id !== props.el.id);

        const sortObjs =  [...objs,{...obj,check: !obj.check,timeFinish:  !obj.check ? `${getTime.hours()}:${getTime.minutes()}` : false  }].sort((a,b)=>(a.id<b.id) ? -1 : 1);
        const temp = [...habits,{...habit,doHabits: sortObjs}];

        setListHabits(temp.sort((a,b)=> (a.id < b.id) ? -1 : 1));

        const saveListToCollection = ()=>{
            saveListHabitsDaily({id: user.uid,listHabits: JSON.stringify(temp.sort((a,b)=> (a.id < b.id) ? -1 : 1))},()=>{
                saveListToCollection();  // if error then send again
            })
        }
        saveListToCollection();
    }

    return (
        <Box padding="2rem" width="100%" height="10rem" bgColor="white" borderRadius="1rem">
            <Box padding="0 2rem" alignItems="center" justifyContent="space-between" display="flex" bgColor="white" borderLeft={`5px solid ${getRandomColor()}`} width="100%" height="100%">
                <Box  flexDirection="column" display="flex">
                    <Text fontSize="1.7rem" fontWeight="500" color="rgba(0,0,0,0.7)">
                        {props.el.name}
                        {/* asdf */}
                    </Text>
                    <Text fontSize="1.3rem" color="rgba(0,0,0,0.4)">
                        {props.val.title}
                        {/* asdf */}
                    </Text>
                    <Box bgColor="rgba(0,0,0,0.3)" width="5rem" >
                    
                    </Box>
                </Box>
                <Box alignItems="center" justifyContent="center" flexDirection="column" display="flex">
                    {!props.forDetail ?
                    <Button onClick={checkHabits} color={props.el.check ? 'blue' : 'rgba(0,0,0,0.3)'} width="5rem" height="5rem" border="1px solid rgba(0,0,0,0.3)" alignItems="center" justifyContent="center" display="flex" borderRadius="1rem" padding="1rem"  fontSize="3" unitSize="rem">
                        <FontAwesomeIcon icon={faCheck} />
                    </Button> :
                    <Box color={props.el.check ? 'blue' : 'rgba(0,0,0,0.3)'} width="5rem" height="5rem" border="1px solid rgba(0,0,0,0.3)" alignItems="center" justifyContent="center" display="flex" borderRadius="1rem" padding="1rem"  fontSize="3" unitSize="rem">
                        <FontAwesomeIcon icon={faCheck} />
                    </Box> }
                    {props.el.timeFinish && props.el.check === true && <Text margin="1rem 0 0 0">attemp at {props.el.timeFinish}</Text>}
                </Box>
            </Box>
        </Box>
    )
}

const MainLayout = props =>{
    const {listHabits,setListHabits,setIsListHabitsFinish,setHistoryListHabits,defaultListHabits} = useContext(DataContext);
    const {user} = useContext(UserContext);

    const calculatePoint = list =>{

        let arrayGradesList = [];
        
        list.forEach(li =>{

            let total = 0;
            let totalFinish = 0;
            li.listHabits.forEach(listhabit =>{
                listhabit.doHabits.forEach(dohabit =>{
                    total++;
                    if(dohabit.check) totalFinish++;
                })
            })
            const grades = Math.floor((100 / total) * totalFinish);
            arrayGradesList.push({id: li.id,grades});

        });

        const save =()=>{  // save statisticS
            utilsUser({id: user.uid},{
                statisticGoodHabits: JSON.stringify(arrayGradesList),
                pointGoodHabits: arrayGradesList.reduce((a,b)=> a + b.grades,0)
            },()=>{
                save();
            });
        }
        save();
        
    }

    const done = ()=>{
        setIsListHabitsFinish(true);
        const save = ()=>{ 
            saveListHabitsDailyFinish({id: user.uid},()=>{
                save();
            });
        }
        save();
    }

    const [totalList,setTotalList] = useState({total: 0,totalFinish: 0});
    useEffect(()=>{
        let total = 0;
        let totalFinish = 0;
        listHabits.forEach(outer =>{
            outer.doHabits.forEach(inner =>{
                total += 1;
                if(inner.check) totalFinish += 1;
            })
        })
        setTotalList({total,totalFinish});
    },[listHabits]);


    useEffect(()=>{

        listHabitsDailyOnSnapshot({id: user.uid},(result)=>{

            let arr = [];
            result.forEach(element =>{
                const {listHabits,finish} = element.data();
                const id = element.id;
                arr.push({id,listHabits: JSON.parse(listHabits),finish: finish || false});
            });

            if(arr.length !== 0){
                setHistoryListHabits(arr.filter(el => el.finish === true));
                calculatePoint([...arr].filter(el => el.finish === true));
            }

            const habits = arr.find(el => el.id === `${getTime.date()}-${getTime.month()}-${getTime.year()}`);

            if(habits){
                setListHabits(habits.listHabits);
                setIsListHabitsFinish(habits.finish);
            }else{
                getDataProfile({id: user.uid},(result)=>{
                    if(result.data()){
                        const {listHabits} = result.data();

                        const saveListToCollection = ()=>{
                            saveListHabitsDaily({id: user.uid,listHabits: listHabits ? listHabits : JSON.stringify(defaultListHabits)},()=>{
                                saveListToCollection();  // if error then send again
                            });
                        }
                        saveListToCollection();
                    }
                });
            }

        });

    },[]);

    return (
        <Box  mediaQueries={`${mediaQueries("sm")`padding: unset !important;`}`} padding="0 5rem" width="100%" height="100%">
            <Box width="100%" >
                <Text fontSize="2rem" color="rgba(0,0,0,0.4)">your progress</Text>
                <Box margin="2rem 0 0 0" display="flex" justifyContent="space-between" alignItems="center">
                    <Box  display="flex" alignItems="center">
                        <Text fontWeight="600" margin="0 3rem 0 0" fontSize="3rem" color="#20264e">Today</Text>
                        <Box fontSize="2rem" color="#20264e" display="flex" alignItems="center" justifyContent="center"> 
                            <FontAwesomeIcon icon={faTasks} />
                        </Box>
                    </Box>
                    <Text color="#6886e6" fontWeight="600" fontSize="3rem">
                        {`${totalList.totalFinish}/${totalList.total}`}
                    </Text>
                </Box>
                <Box overflowX="hidden" borderRadius="1rem" width="100%" height="1rem" bgColor="#d6d6d6">
                    <Box transition="all .5s" borderRadius="1rem" width={`${(100 / totalList.total) * totalList.totalFinish}%`} height="100%" bgColor="#6886e6" />
                </Box>
                {totalList.totalFinish === totalList.total &&
                <Button margin="1rem 0 0 0" onClick={done} height="4rem" borderRadius="1rem" padding="1rem 3rem" bgColor="#3892e9" color="white" fontSize="1.7" unitSize="rem" boxShadow="0px 0px 10px -1px rgba(0,0,0,0.3)"  >
                    done!
                </Button> }
            </Box>
            <Box borderRadius="1rem" bgColor="#f3f3f3" margin="3rem 0 0 0" padding="1rem" width="100%"  display="grid" gridGap="1rem" gridTemplateColumns="repeat(auto-fit,minmax(30rem,1fr))" >
                {listHabits.length !== 0 && listHabits.map((val,i)=>{
                    return val.doHabits.map((el,i)=>{
                        return <BoxHabitDone key={i} val={val} el={el} />
                    })
                })}
            </Box>
        </Box>
    )
}

const GoodHabits = props =>{

    //context
    const {historyListHabits,goodHabits,setDataGoodHabits,listHabits,setListHabits,isListHabitsFinish,setIsListHabitsFinish} = useContext(DataContext);
    const {user} = useContext(UserContext);

    
    const [lastSave,setLastSave] = useState();
    const [layout,setLayout] = useState({main: false,editHabits: false,editCategory: false,loading: true});
    const [layoutFinishGoal,setLayoutFinishGoal] = useState(false);
    const [modal,setModal] = useState({show: false,lock: false});

    const deleteHabits = (obj,habit) =>{
        const goodHabit = goodHabits.find(el => el.id === obj.id);  //obj
        const tempGoodHabits = goodHabits.filter(el => el.id !== obj.id); // array
        const temp = [...tempGoodHabits,{...goodHabit,habits: {...goodHabit.habits,doHabits: [...goodHabit.habits.doHabits.filter(el => el.id !== habit.id)] }}];
        setDataGoodHabits(temp.sort((a,b)=> (a.id < b.id) ? -1 : 1));
    }

    const save = ()=>{
        setLayout({main: true,editHabits: false,editCategory: false,loading: false});
        setListHabits(doHabits);
        // save to firebase
        const saveList = ()=>{
            saveListHabits({id: user.uid,listHabits: JSON.stringify(doHabits)},()=>{
                saveList();  // if error then send again
            });
        }
        saveList();
        const saveGood = ()=>{
            saveGoodHabits({id: user.uid,goodHabits: JSON.stringify(goodHabits)},()=>{
                saveGood(); // if error then send again
            });
        }
        saveGood();
        const saveListToCollection = ()=>{
            saveListHabitsDaily({id: user.uid,listHabits: JSON.stringify(doHabits)},()=>{
                saveListToCollection();  // if error then send again
            })
        }
        saveListToCollection();
    }

    const [doHabits,setDoHabits] = useState([]);
    useEffect(()=>{
        const temp = goodHabits.map(element =>{
            let obj = {id: element.id,title: element.title,doHabits: [],length: 0};
            element.habits.doHabits.forEach(el =>{
                obj.doHabits.push(el);
                obj.length = obj.length + 1;
            });
            if(element.set) return obj;
            return {id: element.id,title: element.title, doHabits: [],length: 0};
        });
        setDoHabits(temp);
    },[goodHabits]);

    useEffect(()=>{

        saveListHabitsToFinish({id: user.uid}); // change all listhabits to finish except today

        //listening on dataprofile

        dataProfileOnSnapshot({id: user.uid},(result)=>{
            if(result.data()){
                const {goodHabits,lastSave} = result.data();

                if(goodHabits){
                    setDataGoodHabits(JSON.parse(goodHabits));
                }

                if(lastSave){
                    setLastSave(lastSave);
                }
            }
        })

        getDataProfile({id: user.uid},(result)=>{
            if(result.data()){

                const {goodHabits,listHabits: listHabitsFromDb,lastSave} = result.data();

                if(goodHabits){
                    setDataGoodHabits(JSON.parse(goodHabits));
                }

                if(listHabitsFromDb){
                    if(listHabits.reduce((a,b)=> a + b.length,0) === 0){
                        // setlistHabits when first render
                        setListHabits(JSON.parse(listHabitsFromDb));
                    }
                }

                if(lastSave){
                    setLastSave(lastSave);
                }

            }
        });

        if(listHabits.length == 0){
            setLayout({main: false,editHabits: true,editCategory: false,loading: false});
        }else{
            setLayout({main: true,editHabits: false,editCategory: false,loading: false});
        }

        // setLayout({main: false,editHabits: true,editCategory: false,loading: false});
    },[]);

    useEffect(()=>{
        if(lastSave){
            setLayout({main: true,editHabits: false,editCategory: false,loading: false});
        }
    },[lastSave]);



    const [detailListHabits,setDetailListHabits] = useState();
    const goalModalDetail = (value) =>{
        setDetailListHabits(value);
        setModal({show: true,lock: false});
    }
    const calculate =(listHabits)=>{
        let total = 0;
        let totalFinish = 0;
        listHabits.forEach(val =>{
            val.doHabits.forEach(el =>{
                total++;
                if(el.check) totalFinish++;
            });
        });
        const grades = Math.floor((100 / total) * totalFinish);
        return {point: grades,star: Math.floor(grades / 20)}
    }
    /////////////////////////////// question
    const [modalQuestion,setModalQuestion] = useState({show: false,lock: false});


    const [isPhone,setIsPhone] = useState(false);

    const [width, height] = useWindowSize();
    useEffect(()=>{
        if(width < 900){
            setIsPhone(true);
        }else{
            setIsPhone(false);
        }
    },[width,height]);



    return (
        <React.Fragment>

            <Modal overflowX="hidden" flexDirection="column" overflowY="auto" lock={modalQuestion.lock} borderRadius="1rem" padding="3rem" top="50%" left="50%" show={modalQuestion.show} handler={()=>setModalQuestion({show: false,lock: false})} minWidth="40rem" maxHeight="95vh" minHeight="20rem" bgColor="white" display="flex" alignItems="center" justifyContent="center">
                <Lottie options={AnimationOption(QuestionAnimation,true)} height={300} width={300} />
                <Box flexDirection="column" display="flex" alignItems="center" justifyContent="center" width="100%" bgColor="#8181f9" borderRadius="1rem" padding="2rem">
                    <Text margin="2rem 0" fontSize="1.7rem" color="white">
                        Disini kamu bisa membuat sebuah daftar yang ingin kamu jadikan kebiasaan kamu setiap harinya
                    </Text>
                    <ul style={{width: '100%',marginLeft: '3rem'}}>
                        <li style={{fontSize: '1.5rem',color: 'rgba(255,255,255,0.5)'}}>Kumpulkan xp setiap harinya!</li>
                    </ul>
                </Box>
            </Modal>

            <Modal overflowY="auto" lock={modal.lock} borderRadius="1rem" padding="3rem" top="50%" left="50%" show={modal.show} handler={()=>setModal({show: false,lock: false})} minWidth="40rem" maxHeight="95vh" minHeight="20rem" bgColor="white" >
                {detailListHabits &&
                <Box display="flex" width="100%" flexDirection="column" alignItems="center" justifyContent="center">
                    <Box margin="3rem 0 3rem 0" transition="all .5s"   display="flex" flexDirection="column" alignItems="center"  bgColor="white" borderRadius="1rem" >
                        <Lottie options={AnimationOption(calculate(detailListHabits.listHabits).point === 100 ? TrophyAnimation1 : (calculate(detailListHabits.listHabits).point > 50 ? TrophyAnimation2 : TrophyAnimation3),true)} height={200} width={200} />
                        <Text fontSize="2rem" margin="1rem 0">
                            {[...new Array(calculate(detailListHabits.listHabits).star)].map(() => `⭐`)}
                        </Text>
                        <Text >{`+ ${calculate(detailListHabits.listHabits).point}xp`}</Text>
                        <Text fontSize="2rem" margin="1rem 0 0 0" color="rgba(0,0,0,0.5)">{detailListHabits.id.split("-").join(" ")}</Text>
                    </Box>
                    <Box width="100%" flexDirection="column" alignItems="center" justifyContent="center">
                        {detailListHabits.listHabits.length !== 0 && detailListHabits.listHabits.map((val,i)=>{
                            return val.doHabits.map((el,i)=>{
                                return <BoxHabitDone forDetail={true} key={i} val={val} el={el} />
                            })
                        })}
                    </Box>
                </Box> }
            </Modal>
            
            <Container flexDirection="column" position="relative" width="100%" height="100%" display="flex" justifyContent="center" alignItems="center">
                {/* header */}
                <Header title="good habits">
                    <Box width="100%" height="auto" display="flex" justifyContent="flex-end" alignItems="center">
                        {!layout.editCategory && !isListHabitsFinish && !layoutFinishGoal && <Button mediaQueries={`${mediaQueries("sm")`height: 5rem !important;`}`} display="flex" alignItems="center" justifyContent="center" onClick={layout.main ? ()=>setLayout({main: false,editHabits: true,editCategory: false,loading: false}) : ()=>setLayout({main: false,editHabits: false,editCategory: true,loading: false})} height="4rem" borderRadius="1rem" padding="1rem 3rem" bgColor="#3892e9" color="white" fontSize="1.7" unitSize="rem" boxShadow="0px 0px 10px -1px rgba(0,0,0,0.3)"  >
                            {layout.main ? 'Edit my habits' : 'Edit category'}
                        </Button>}
                        {!layoutFinishGoal && <Button mediaQueries={`${mediaQueries("sm")`height: 5rem !important;`}`} display="flex" alignItems="center" justifyContent="center" margin="0 0 0 2rem" onClick={()=>setLayoutFinishGoal(true)} height="4rem" borderRadius="1rem" padding="1rem 3rem" bgColor="#3892e9" color="white" fontSize="1.7" unitSize="rem" boxShadow="0px 0px 10px -1px rgba(0,0,0,0.3)"  >
                            history
                        </Button>}
                        {layoutFinishGoal && <Button mediaQueries={`${mediaQueries("sm")`height: 5rem !important;`}`} display="flex" alignItems="center" justifyContent="center" margin="0 0 0 2rem" onClick={()=>setLayoutFinishGoal(false)} height="4rem" borderRadius="1rem" padding="1rem 3rem" bgColor="#3892e9" color="white" fontSize="1.7" unitSize="rem" boxShadow="0px 0px 10px -1px rgba(0,0,0,0.3)"  >
                            back
                        </Button>}
                    </Box>
                </Header>
                
                <Box mediaQueries={`${mediaQueries("sm")`padding: 1rem !important`}`} padding="0 5rem" margin="0 0 5rem 0" flexDirection="column" position="relative" width="100%" height="100%" display="flex" justifyContent="center" alignItems="center">
                    
                    <Box mediaQueries={`${mediaQueries("sm")`flex-direction: column-reverse;`}`} overflowX="hidden" overflowY="hidden" position="relative" display="flex" alignItems="center" justifyContent="space-between" width="100%" borderRadius="1rem" bgColor="#f59bf9" margin="0 0 5rem 0">
                        <Box bgColor="#ee61f5" width="40rem" height="40rem" borderRadius="50%" position="absolute" top="50%" right="-20%" transform="translate(-50%,-50%)" />
                        <Button width="auto" display="flex" justifyContent="center" alignItems="center" onClick={()=>setModalQuestion({show: true,lock: false})} position="absolute" top="1rem" right="1rem" fontSize="3" unitSize="rem" color="rgba(255,255,255,0.5)">
                            <FontAwesomeIcon icon={faQuestionCircle} />
                        </Button>
                        <Box zIndex="1" padding="3rem" flex="3" justifyContent="center" className="box-text" height="100%" display="flex" flexDirection="column">
                            <Text fontSize="3rem" color="rgba(0,0,0,0.5)">
                                ayo bentuk kebiasaan mu!
                            </Text>
                        </Box>
                        <Box flexBasis="30rem" >
                            <Lottie options={AnimationOption(OfficeAnimation,true)} height={200} width={200} />
                        </Box>
                    </Box>


                    {layoutFinishGoal ? 
                        <Box flexDirection="column" width="100%" height="100%" display="flex" justifyContent="center" alignItems="center">
                            <Text margin="3rem 0" fontSize="3rem" textTransform="capitalize" color="rgba(0,0,0,0.8)">riwayat goal harianmu</Text>
                            <Box mediaQueries={`${mediaQueries("sm")`grid-template-columns: repeat(2,1fr) !important;padding: 0 !important; `}`} overflowY="auto" padding="5rem" width="100%" height="100%" display="grid" gridGap="1rem" gridTemplateColumns="repeat(auto-fit,minmax(25rem,1fr))">
                                {historyListHabits.length !== 0 ?
                                    historyListHabits.map((val,i)=> <FinishGoal onClick={goalModalDetail} key={i} val={val} />).reverse() :
                                    <Box flexDirection="column" display="flex" alignItems="center" justifyContent="center">
                                        <Lottie options={AnimationOption(EmptyAnimation,true)} height={400} width={400} />
                                        <Text fontSize="2rem" color="rgba(0,0,0,0.8)" fontWeight="500">Oooops belum ada riwayat</Text>
                                        <Button margin="1rem 0 0 0" onClick={()=>setLayoutFinishGoal(false)} height="4rem" borderRadius="1rem" padding="1rem 3rem" bgColor="#3892e9" color="white" fontSize="1.7" unitSize="rem" boxShadow="0px 0px 10px -1px rgba(0,0,0,0.3)"  >
                                            ayo selesaikan goal hari ini!
                                        </Button>
                                    </Box>
                                }
                            </Box>
                        </Box>
                    :
                    <React.Fragment>
                        {isListHabitsFinish ?
                            <Box flexDirection="column" display="flex" alignItems="center" justifyContent="center">
                                <Lottie options={AnimationOption(YogaAnimation,true)} height={350} width={350} />
                                <Text fontSize="2rem" color="rgba(0,0,0,0.8)" fontWeight="500">rileks... goal harianmu tercapai hari ini</Text>
                                <Text margin="2rem 0" fontSize="1.6rem" color="rgba(0,0,0,0.5)" >see you tomorrow!</Text>
                                <Button margin="1rem 0 0 0" onClick={()=>setLayoutFinishGoal(true)} height="4rem" borderRadius="1rem" padding="1rem 3rem" bgColor="#3892e9" color="white" fontSize="1.7" unitSize="rem" boxShadow="0px 0px 10px -1px rgba(0,0,0,0.3)"  >
                                    lihat riwayat 
                                </Button>
                            </Box>
                        :
                        <React.Fragment>

                            {layout.loading && <h1 style={{fontSize: '3rem',color: 'rgba(0,0,0,0.7)'}}>loading...</h1> }
                            {layout.main && <MainLayout />}
                            {layout.editCategory && <SelectAnHabits isEnableAddition={true} onClick={()=>setLayout({...layout,editHabits: true,editCategory: false,loading: false})} />}

                            {layout.editHabits &&
                            <Box mediaQueries={`${mediaQueries("sm")`flex-direction: column-reverse;padding: 1rem !important;`}`} display="flex" padding="0 4rem" width="100%" height="100%"  overflowY="auto">
                                <Box flex="1" padding="0 1rem" width="100%" height="100%"  overflowY="auto">
                                    <Box width="100%" display="flex" flexDirection="column">
                                        <Text margin="1rem 0" fontSize="2rem" color="rgba(0,0,0,0.8)" fontWeight="400" textTranform="capitalize">
                                            rekam aktifitas mu sehari-hari
                                        </Text>
                                        <Text margin="1rem 0" fontSize="1.6rem" color="rgba(0,0,0,0.5)" fontWeight="200" textTranform="capitalize">
                                            dan selesaikan goal harianmu!
                                        </Text>
                                        <Text margin="1rem 0" fontSize="1.6rem" color="rgba(0,0,0,0.9)" fontWeight="500" textTranform="capitalize">
                                            category :
                                        </Text>
                                    </Box>

                                    <Box mediaQueries={`${mediaQueries("sm")`grid-template-columns: repeat(1,1fr);`}`} padding="2rem" width="100%" display="grid" gridGap="1rem" gridTemplateColumns="repeat(2,1fr)">
                                        {/* child */}
                                        {goodHabits.map((val,i) =>{
                                            if(val.set) return <BoxHabit isPhone={isPhone} key={i} val={val} />
                                        })}
                                    </Box>  
                                </Box>
                                <Box margin="0 0 5rem 0" display="flex" flexDirection="column" alignItems="center" flexBasis="25rem" height="100%" bgColor="white">
                                    <Box width="100%" display="flex" flexDirection="column">
                                        <Text margin="1rem 0" fontSize="2rem" color="rgba(0,0,0,0.8)" fontWeight="400" textTranform="capitalize">
                                            goal mu
                                        </Text>
                                        <Text margin="1rem 0" fontSize="1.6rem" color="rgba(0,0,0,0.5)" fontWeight="200" textTranform="capitalize">
                                            kamu bisa menambahkan sebanyak-banyaknya 
                                        </Text>
                                    </Box>
                                    <Box width="100%" display="flex" flexDirection="column" alignItems="center">
                                        {doHabits.map((val,i) =>{
                                            if(val.length !== 0){
                                                return (
                                                    <Box key={i} margin="2rem 0 0 0" width="100%" display="flex" flexDirection="column" justifyContent="center">
                                                        <Text fontSize="1.7rem" textTransform="capitalize">
                                                            {val.title}
                                                        </Text>
                                                        <Box width="100%" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
                                                            {val.doHabits.map((el,i) =>{
                                                                return (
                                                                    <BoxList key={i} onClick={()=>deleteHabits(val,el)} isActive={true} isGoal={true} val={el} />
                                                                )
                                                            })}
                                                        </Box>
                                                    </Box>
                                                )
                                            }
                                        })}
                                        {doHabits.reduce((a,b)=> a + b.length,0) !== 0 &&
                                            <Button onClick={save} margin="3rem 0 0 0" bgColor="#3892e9" borderRadius="1rem" boxShadow="2px 2px 10px rgba(0,0,0,0.5)" height="4rem" color="white" fontSize="1.7" unitSize="rem">
                                                save
                                            </Button>
                                        }
                                        {doHabits.reduce((a,b)=> a + b.length,0) === 0 &&
                                        <Box margin="5rem 0 0 0" width="80%" display="flex" alignItems="center" justifyContent="center" flexDirection="column">
                                            <Box color="rgba(0,0,0,0.3)" fontSize="5rem" display="flex" alignItems="center" justifyContent="center">
                                                <FontAwesomeIcon icon={faFolderPlus} />
                                            </Box>
                                            <Text textTranform="center" fontSize="2rem" color="rgba(0,0,0,0.3)">
                                                ayo tambahkan goalmu !
                                            </Text>
                                        </Box>
                                        }
                                    </Box>
                                </Box>
                            </Box> }

                        </React.Fragment> }
                    </React.Fragment> }

                </Box> 
                
            </Container>

        </React.Fragment>
    )
}

export default GoodHabits;