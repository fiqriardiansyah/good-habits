import React,{useContext,useEffect,useState} from 'react';
import Styled from 'styled-components';
import Lottie from 'react-lottie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus,faTimes,faCheckSquare,faClock,faMedal,faQuestionCircle} from '@fortawesome/free-solid-svg-icons';  
import NotepadAnimation from '../../animation/notepad.json';
import PeopleCheckAnimation from '../../animation/people_check.json';
import ResolutionAnimation from '../../animation/resolution.json';
import QuestionAnimation from '../../animation/question.json';
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';

//utils
import {StyleBasic} from '../../utils/globalSetElement';
import {getTime} from '../../utils/utils';
import {mediaQueries} from '../../utils/mediaQueries';

//context
import {DataContext} from '../../context/dataContext';
import {UserContext} from '../../context/userContext';


//component menu
import Header from './component/Header';

//firebase
import {saveSpecificDataProfile,dataProfileOnSnapshot} from '../../firebase/firebaseFunction';

//components
import {Resolution as ResolutionComponent} from '../../components/components';
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

const numberToMonth = num =>{
    const months = ['januari','februari','maret','april','mei','juni','juli','agustus','september','oktober','november','desember'];
    return months[num-1];
}

const BoxAdviceResolution = props =>{
    
    const {dataProfile,resolution,setResolution,tempResolutionAdvice,setTempResolutionAdvice} = useContext(DataContext);

    const [addition,setAddition] = useState({deadline: false,priority: false});
    //datepicker
    const [date,setDate] = useState({selectedDate: undefined});
    //priority
    const [priority,setPriority] = useState([]);

    const radioInput = input =>{
        let arr = []
        input.forEach(el => arr.push(el.checked));
        setPriority(arr);
    }

    const check =()=>{
        const tempResolution = tempResolutionAdvice.find(el => el.id === props.val.id);
        const temp = resolution.value.find(el => el.id === props.val.id );

        if(temp){
            setResolution({...resolution,value: [...resolution.value.filter(el => el.id !== props.val.id)]});
        }

        if(tempResolution){
            setTempResolutionAdvice([...tempResolutionAdvice.filter(el => el.id !== props.val.id)]);
            setAddition({deadline: false,priority: false});
            setPriority([]);
            setDate({selectedDate: undefined});
        }else{

            let dateExplode = false;
            if(addition.deadline){
                dateExplode = date.selectedDate.toLocaleDateString().split('/');
                dateExplode = `${dateExplode[0]}-${numberToMonth(parseInt(dateExplode[1]))}-${dateExplode[2]}`;
            }

            setTempResolutionAdvice([...tempResolutionAdvice,
                {...props.val,date: dateExplode,priority: priority.indexOf(true) + 1 || 100}]);

        }
    }

    const [isSelect,setIsSelect] = useState(false);

    const checkIfSelect = () =>{
        const tempResolutions = tempResolutionAdvice.find(el => el.id === props.val.id);
        const temp = resolution.value.find(el => el.id === props.val.id);
        if(tempResolutions || temp) return setIsSelect(true);
        return setIsSelect(false);
    }

    useEffect(()=>{
        checkIfSelect();
    },[resolution.value,tempResolutionAdvice,props.clickDelete]);

    return (
        <Box border="1px solid rgba(0,0,0,0.4)" padding="2rem" margin="0 0 2rem 0" display="flex" justifyContent="center" flexDirection="column" width="100%" bgColor="white" borderRadius="1rem">
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Text fontSize="1.7rem" color="rgba(0,0,0,0.8)" textTransform="capitalize">
                    {props.val.title}
                </Text>
                <Button color={isSelect ? '#6f6fef' : 'rgba(0,0,0,0.2)'} onClick={check} width="3rem" height="3rem" display="flex" justifyContent="center" alignItems="center" borderRadius="1rem" padding="1rem 2rem"  fontSize="2.5" unitSize="rem"   >
                   <FontAwesomeIcon icon={faCheckSquare} />
                </Button>
            </Box>
            
            {!isSelect && 
            <Box height="2px" width="100%" bgColor="rgba(0,0,0,0.3)" margin="2rem auto" /> }

            {addition.deadline && !isSelect && 
            <Box margin="2rem 0" width="100%" height="30rem" display="flex" alignItems="center" justifyContent="center">
                <DayPicker onDayClick={(date)=>setDate({selectedDate: date})} 
                selectedDays={date.selectedDate} />
            </Box>}

            {addition.priority && !isSelect && 
            <Box flexDirection="column" borderRadius="1rem" bgColor="#7171ea" margin="2rem 0" width="100%" height="20rem" display="flex" alignItems="center" justifyContent="center">
                <Text fontSize="2rem" color="white">How about priority</Text>
                <RadioInput value={radioInput} element={["#1","#2","#3"]} />
            </Box>}
            
            {!isSelect &&
            <Box display="flex" justifyContent="space-between" width="100%" borderRadius="1rem">
                <Button onClick={()=>setAddition({...addition,deadline: !addition.deadline})} width="auto" height="4rem" borderRadius="1rem" padding="1rem 2rem" bgColor="#b5b5b5" color="white" fontSize="1.7" unitSize="rem"   >
                   {addition.deadline ? 'No deadline ?' :' Add deadline ?'}
                </Button>
                <Button onClick={()=>setAddition({...addition,priority: !addition.priority})} width="auto" height="4rem" borderRadius="1rem" padding="1rem 2rem" bgColor="#b5b5b5" color="white" fontSize="1.7" unitSize="rem"   >
                    {addition.priority ? 'No priority ?' :' Add priority ?'}
                </Button>
            </Box>}

        </Box>
    )
}

const BoxResolution = props =>{

    const checkDeadline = ()=>{
        // new Date('12/04/2012 07:00')


        const explodeDate = props.val.date.split("-");
        const dateStringDeadline = `${explodeDate[0]}/${explodeDate[1]}/${explodeDate[2]} 12:00`;
        const dateStringToDay = `${getTime.date()}/${getTime.month()}/${getTime.year()} ${getTime.hours()}:${getTime.minutes()}`;
        
        
        const epochTimeDeadline = new Date(dateStringDeadline).getTime();
        const epochTimeToDay = new Date(dateStringToDay).getTime();
        
        console.log(explodeDate);
        console.log(dateStringDeadline);
        console.log(dateStringToDay);
        console.log(epochTimeDeadline);

        if(epochTimeDeadline > epochTimeToDay) return false;
        return true;

    }

    return (
        <Box padding="2rem" display="flex" alignItems="center" justifyContent="center" flexDirection="column" width="100%" minHeight="10rem" bgColor="white" borderRadius="1rem">
            <Box position="relative" width="100%" display="flex" alignItems="center" justifyContent="space-between">
                <Text fontSize="1.7rem" color="rgba(0,0,0,0.8)" textTransform="capitalize">{props.val.title}</Text>
            </Box>
            <Box width="100%" height="2px" bgColor="#d0d0d4" margin="2rem auto" />
            <Box width="100%" display="flex" alignItems="center" justifyContent="space-between">
                <Box  display="flex" alignItems="center" justifyContent="space-between">
                    {props.val.date ?
                        <Box fontSize="2rem" width="3rem" height="3rem" color={checkDeadline() ? 'red' : 'd0d0d4' } display="flex" justifyContent="center" alignItems="center">
                            <FontAwesomeIcon icon={faClock} />
                        </Box>
                        :
                        <Box fontSize="2rem" width="3rem" height="3rem" color="#d0d0d4" display="flex" justifyContent="center" alignItems="center">
                            <FontAwesomeIcon icon={faClock} />
                        </Box>
                    }
                    
                    {props.val.date ? 
                    <React.Fragment>
                        <Text fontSize="1.7rem" color={checkDeadline() ? 'red' : '#d0d0d4' }  textTransform="capitalize">Deadline</Text>
                        {checkDeadline() && <Text fontSize="1.2rem" color="red"  textTransform="capitalize">{` (time out)`}</Text> }
                    </React.Fragment>
                    :
                        <Text fontSize="1.7rem" color="#d0d0d4"  textTransform="capitalize">Deadline</Text>
                    }
                    
                    
                </Box>
                    {props.val.date ?
                        <Text fontSize="1.5rem" color={checkDeadline() ? 'red' : 'rgba(0,0,0,0.8)' } >
                            {props.val.date.split("-").join(" ")}
                        </Text>
                        :
                        <Text fontSize="1.5rem" color="rgba(0,0,0,0.8)" >
                            -
                        </Text>
                    }
                
            </Box>
            <Box margin="2rem 0" width="100%" display="flex" alignItems="center" justifyContent="space-between">
                <Box  display="flex" alignItems="center" justifyContent="space-between">
                    <Box fontSize="2rem" width="3rem" height="3rem" color="#d0d0d4" display="flex" justifyContent="center" alignItems="center">
                        <FontAwesomeIcon icon={faMedal} />
                    </Box>
                    <Text fontSize="1.7rem" color="#d0d0d4" textTransform="capitalize">Priority</Text>
                </Box>
                <Box color="white"  bgColor={props.val.priority === 1 ? "#e91e63" : props.val.priority === 2 ? '#2196f3' : props.val.priority === 3 ? '#4caf50' : 'white' } fontWeight="600" fontSize="1.7rem" borderRadius="100px" width="6rem" height="3rem" display="flex" alignItems="center" justifyContent="center">
                    {props.val.priority === 1 ? '#1' : props.val.priority === 2 ? '#2' : props.val.priority === 3 ? '#3' : '-'}
                </Box>
            </Box> 
        </Box>
    )
}




const Resolution = props =>{

    //context
    const {dataProfile,resolution,setResolution,resolutionAdvice,tempResolutionAdvice,setTempResolutionAdvice} = useContext(DataContext);
    const {user} = useContext(UserContext);

    //resolution component /modal
    const [modalResolution,setModalResolution] = useState({show: false,lock: false});
    const saveResolutionComponent = ()=>{
        saveSpecificDataProfile({id: user.uid},{resolution: dataProfile.resolution});
        setModalResolution({show: false,lock: false});
    }

    // sign -error-warning-loading-success
    const defaultSign = {loading: false,success: false,warning: false,error: false,text: 'loading...',button: []}
    const [sign,setSign] = useState(defaultSign);
    const [modalSign,setModalSign] = useState({show: false,lock: false});

    //////////////////////////////////////////////resolution 
    const [error,setError] = useState(false);
    const [layoutResolution,setLayoutResolution] = useState(false);
    const [modalInputResolution,setModalInputResolution] = useState({show: false,lock: false});
    const [addition,setAddition] = useState({date: false,priority: false});

    //title
    const [title,setTitle] = useState('');
    //datepicker
    const [date,setDate] = useState({selectedDate: undefined});
    //priority
    const [priority,setPriority] = useState([]);

    const radioInput = input =>{
        let arr = []
        input.forEach(el => arr.push(el.checked));
        setPriority(arr);
    }
    const addResolution = ()=>{
        if(title !== ''){

            if(addition.date){

                if(date.selectedDate !== undefined){
                    let dateExplode = date.selectedDate.toLocaleDateString().split('/');
                    dateExplode = `${dateExplode[0]}-${numberToMonth(parseInt(dateExplode[1]))}-${dateExplode[2]}`;
                    setResolution({...resolution,value: [...resolution.value,{id: resolution.value.length+1, title,date: dateExplode,priority: priority.indexOf(true) + 1 || 100 }]})
                    setModalInputResolution({show: false,lock: false});
                    setTitle('');
                    setDate({selectedDate: undefined});
                    setPriority([]);
                }else{
                    setError('Deadline date is required!');
                }
                
            }else{
                setResolution({...resolution,value: [...resolution.value,{id: resolution.value.length+1, title,date: false,priority: priority.indexOf(true) + 1 || 100} ]});
                setModalInputResolution({show: false,lock: false});
                setTitle('');
                setDate({selectedDate: undefined});
                setPriority([]);
            }
        }else{
            setError('title is required!');
        }
    }
    
    const [clickDelete,setClickDelete] = useState(false);
    const deleteResolution = id =>{
        const tempResolution = resolution.value.filter(el => el.id !== id);
        setResolution({...resolution,value: tempResolution});
        setClickDelete(prev => !prev);
    }

    /// resolution advice
    const [modalAdvice,setModalAdvice] = useState({show: false,lock: false});
    
    const saveAdviceResolution =()=>{

        const temp = [...resolution.value,...tempResolutionAdvice].filter((val,i,self)=>{
            return i === self.findIndex((t)=> t.id === val.id );
        });
        setResolution({...resolution,value: temp});
        setModalAdvice({show: false,lock: false});
    }

    const save =()=>{

        setSign({...defaultSign,loading: true,text: `loading...`,button: []});
        setModalSign({show: true,lock: false});
        saveSpecificDataProfile({id: user.uid},{resolutionList: {fixed: true,value: JSON.stringify(resolution.value)}});
    }

    useEffect(()=>{
        dataProfileOnSnapshot({id: user.uid},(result)=>{
            if(result.data()){
                setModalSign({show: false,lock: false});
                const {resolutionList} = result.data();
                if(resolutionList){
                    setResolution({fixed: resolutionList.fixed,value: JSON.parse(resolutionList.value)});
                }
            }
        })
    },[]);

    /////////////////////////////// question
    const [modalQuestion,setModalQuestion] = useState({show: false,lock: false});

    return (
        <React.Fragment>

            <Modal overflowX="hidden" flexDirection="column" overflowY="auto" lock={modalQuestion.lock} borderRadius="1rem" padding="3rem" top="50%" left="50%" show={modalQuestion.show} handler={()=>setModalQuestion({show: false,lock: false})} minWidth="40rem" maxHeight="95vh" minHeight="20rem" bgColor="white" display="flex" alignItems="center" justifyContent="center">
                <Lottie options={AnimationOption(QuestionAnimation,true)} height={300} width={300} />
                <Box flexDirection="column" display="flex" alignItems="center" justifyContent="center" width="100%" bgColor="#8181f9" borderRadius="1rem" padding="2rem">
                    <Text margin="2rem 0" fontSize="1.7rem" color="white">
                        Sekarang kamu bisa membuat daftar resolusi mu di tahun ini ,dan tambahkan sebanyak banyaknya
                    </Text>
                    <ul style={{width: '100%',marginLeft: '3rem'}}>
                        <li style={{fontSize: '1.5rem',color: 'rgba(255,255,255,0.5)'}}>kamu bisa menambahkan tanggal deadline jika kamu mau</li>
                        <li style={{fontSize: '1.5rem',color: 'rgba(255,255,255,0.5)'}}>dan juga kamu bisa menyesuaikan prioritas untuk setiap daftar dari resolusimu</li>
                    </ul>
                </Box>
            </Modal>

            <Modal overflowY="auto" lock={modalSign.lock} borderRadius="1rem" padding="3rem" top="50%" left="50%" show={modalSign.show} handler={()=>setModalSign({show: false,lock: false})} minWidth="40rem" maxHeight="95vh" minHeight="20rem" bgColor="white" display="flex" alignItems="center" justifyContent="center">
                <Sign loading={sign.loading}  success={sign.success} warning={sign.warning} error={sign.error} text={sign.text} button={sign.button} />
            </Modal>

            <Modal overflowY="auto" lock={modalResolution.lock} borderRadius="1rem" padding="3rem" top="50%" left="50%" show={modalResolution.show} handler={()=>setModalResolution({show: false,lock: false})} minWidth="40rem" maxHeight="95vh" minHeight="20rem" bgColor="white" display="flex" alignItems="center" justifyContent="center">
                <ResolutionComponent handler={()=>{}} onClick={saveResolutionComponent} />
            </Modal>

            <Modal overflowY="auto" lock={modalInputResolution.lock} borderRadius="1rem" padding="3rem" top="50%" left="50%" show={modalInputResolution.show} handler={()=>setModalInputResolution({show: false,lock: false})} minWidth="40rem" maxHeight="95vh" minHeight="20rem" bgColor="white" >
                <Box  width="100%" height="100%" display="flex" alignItems="center" flexDirection="column">
                    <Box width="100%" flexDirection="column" display="flex" alignItems="center" justifyContent="center">
                        <Input validation={value => setTitle(value)} bgColorFocus="white" bgColor="#e6e6e6" borderFocus="0px 0px 2px 3px #6c91f9" borderRadius="1rem  " border="none" padding="1rem 3rem" fontSize="1.7rem"  name="title" type="text" placeholder="title" />
                        {addition.date && 
                        <Box margin="2rem 0" width="100%" height="30rem" display="flex" alignItems="center" justifyContent="center">
                            <DayPicker onDayClick={(date)=>setDate({selectedDate: date})} 
                            selectedDays={date.selectedDate} />
                        </Box>}
                        <Text margin="1rem 0" color="blue" cursor="pointer" fontSize="1.7rem" onClick={()=>setAddition({...addition,date: !addition.date})}>
                            {addition.date ? 'No deadline?' : 'Add deadline ?'}
                        </Text>
                        {addition.priority &&
                        <Box flexDirection="column" borderRadius="1rem" bgColor="#7171ea" margin="2rem 0" width="100%" height="20rem" display="flex" alignItems="center" justifyContent="center">
                            <Text fontSize="2rem" color="white">How about priority</Text>
                            <RadioInput value={radioInput} element={["#1","#2","#3"]} />
                        </Box> }
                        <Text margin="1rem 0" color="blue" cursor="pointer" fontSize="1.7rem" onClick={()=>setAddition({...addition,priority: !addition.priority})}>
                            {addition.priority ? 'No priority?' : 'Add priority ?'}
                        </Text>
                        {error && <Text fontSize="1.5rem" color="red">{error}</Text>}
                    </Box>
                    <Box margin="5rem 0 0 0" width="100%" height="4rem" display="flex" justifyContent="flex-end" alignItems="center">
                        {title !== '' && <Button onClick={addResolution} display="flex" alignItems="center" justifyContent="center" width="auto" height="100%" padding="1rem 4rem" bgColor="#3791e8" hoverBgColor="#1968b5" color="white" fontSize="1.7" unitSize="rem" borderRadius=".5rem">
                            add
                        </Button> }
                    </Box>
                </Box>
            </Modal>

            <Modal  lock={modalAdvice.lock} borderRadius="1rem" padding="3rem" top="50%" left="50%" show={modalAdvice.show} handler={()=>setModalAdvice({show: false,lock: false})} minWidth="40rem" maxHeight="95vh" minHeight="20rem" bgColor="white" >
                <Box overflowY="auto" width="100%" height="75vh" display="flex" alignItems="center" flexDirection="column">
                    {resolutionAdvice.map((val,i)=>{
                        return <BoxAdviceResolution clickDelete={clickDelete} val={val} />
                    })}
                </Box>
                <Box height="5rem" width="100%" display="flex" alignItems="center" justifyContent="flex-end">
                    <Button onClick={saveAdviceResolution} display="flex" alignItems="center" justifyContent="center" width="auto" height="4rem" padding="1rem 4rem" bgColor="#3791e8" hoverBgColor="#1968b5" color="white" fontSize="1.7" unitSize="rem" borderRadius=".5rem">
                        save
                    </Button>
                </Box>
            </Modal>
            
            <Container width="100%" height="100%" display="flex" justifyContent="center" alignItems="center" flexDirection="column">
                {/* header */}
                <Header title="resolution" >    
                    <Box width="100%" height="auto" display="flex" justifyContent="flex-end" alignItems="center">
                        {resolution.fixed && <Button mediaQueries={`${mediaQueries("sm")`height: 5rem !important;`}`} display="flex" alignItems="center" justifyContent="center" onClick={()=>setResolution({...resolution,fixed: false})} height="4rem" borderRadius="1rem" padding="1rem 3rem" bgColor="#3892e9" color="white" fontSize="1.7" unitSize="rem" boxShadow="0px 0px 10px -1px rgba(0,0,0,0.3)"  >
                            Edit resolution
                        </Button>}
                    </Box>
                </Header>
                {/* body */}
                <Box mediaQueries={`${mediaQueries("sm")`padding: 0 1rem !important;`}`} padding="0 5rem" width="100%" height="100%" display="flex" alignItems="center" flexDirection="column">
                    
                    <Box mediaQueries={`${mediaQueries("sm")`flex-direction: column-reverse;`}`} overflowY="hidden" overflowX="hidden" position="relative" display="flex" alignItems="center" bgColor="#ffff57" width="100%" minHeight="10rem" borderRadius="1rem">
                        <Box bgColor="#FFEB3B" width="40rem" height="40rem" borderRadius="50%" position="absolute" top="50%" right="-20%" transform="translate(-50%,-50%)" />
                        <Box zIndex="1" padding="3rem" flex="3" justifyContent="center" className="box-text" height="100%" display="flex" flexDirection="column">
                            <Text fontSize="1.6rem" color="rgba(0,0,0,0.5)">the thing most wanted to achieve</Text>
                            <Text fontSize="4rem" margin="1rem 0" textTransform="capitalize">{dataProfile.resolution.title}</Text>
                            <Text fontSize="2rem" color="rgba(0,0,0,0.7)">{dataProfile.resolution.description || ''}</Text>
                            <Button width="10rem" margin="2rem 0" onClick={()=>setModalResolution({show: true, lock: false})} height="4rem" borderRadius="1rem" padding="1rem 3rem" bgColor="#ffeb3b" color="white" fontSize="1.7" unitSize="rem" >
                                Edit
                            </Button>
                        </Box>
                        <Box  flexBasis="30rem" >
                            <Lottie options={AnimationOption(NotepadAnimation,true)} height={200} width={200} />
                        </Box>
                    </Box>

                    <Box mediaQueries={`${mediaQueries("sm")`flex-direction: column;`}`} position="relative" margin="5rem 0" display="flex" alignItems="center" bgColor="#29304a" width="100%" minHeight="10rem" borderRadius="1rem">
                        <Button width="auto" display="flex" justifyContent="center" alignItems="center" onClick={()=>setModalQuestion({show: true,lock: false})} position="absolute" top="1rem" right="1rem" fontSize="3" unitSize="rem" color="rgba(255,255,255,0.4)">
                            <FontAwesomeIcon icon={faQuestionCircle} />
                        </Button>
                        {resolution.fixed ? 
                            <Box  display="flex" flexDirection="column" width="100%" alignItems="center">
                                <Box mediaQueries={`${mediaQueries("sm")`flex-direction: column;`}`} display="flex" width="100%" alignItems="center" justifyContent="space-around">
                                    <Box width="30rem" height="30rem" display="flex" alignItems="center"  justifyContent="center">
                                        <Lottie  options={AnimationOption(ResolutionAnimation,true)} height={250} width={250} />
                                    </Box>
                                    <Text fontSize="3rem" color="white" margin="2rem 0">{`My resolution in ${getTime.year()}`}</Text>
                                </Box>
                                <Box padding="2rem" width="100%" display="grid" gridGap="1rem" gridTemplateColumns="repeat(auto-fit,minmax(25rem,1fr))">
                                    {resolution.value.sort((a,b)=> parseInt(a.priority) > parseInt(b.priority) ? 1: -1).map((val,i)=>{
                                        return <BoxResolution key={i} val={val} />
                                    })}
                                </Box>
                            </Box>
                            :
                            <React.Fragment>
                            {!layoutResolution ? 
                                <React.Fragment>
                                    <Box flexBasis="30rem" >
                                        <Lottie options={AnimationOption(ResolutionAnimation,true)} height={250} width={250} />
                                    </Box>
                                    <Box mediaQueries={`${mediaQueries("sm")`align-items: center;`}`} padding="3rem" flex="3" alignItems="flex-end" justifyContent="center" className="box-text" height="100%" display="flex" flexDirection="column">
                                        <Text fontSize="4rem" color="white" textTransform="capitalize">{`Hy! ${dataProfile.name.split(" ")[0]}`}</Text>
                                        <Text textAlign="center" fontSize="2rem" color="rgba(255,255,255,0.6)" margin="1rem 0" >{`ayo buat daftar resolusimu di tahun ${getTime.year()} ini`}</Text>
                                        <Button width="auto" margin="2rem 0" onClick={()=>setLayoutResolution(true)} height="4rem" borderRadius="1rem" padding="1rem 3rem" bgColor="#424965" color="white" fontSize="1.7" unitSize="rem" >
                                            Buat sekarang!
                                        </Button>
                                    </Box> 
                                </React.Fragment>
                            :
                                <React.Fragment>
                                    <Box padding="4rem" display="flex" alignItems="center" flexDirection="column" flex="1" height="100%" flexDirection="column">
                                        {resolution.value.length === 0 ?
                                            <React.Fragment>
                                                <Text fontSize="1.7rem" color="white">Kamu bisa menambahkan sebanyak banyaknya!</Text>
                                                <Lottie options={AnimationOption(PeopleCheckAnimation,true)} height={250} width={250} />
                                            </React.Fragment> 
                                        :
                                            <React.Fragment>
                                                <Text fontSize="1.7rem" color="white">My resolution</Text>
                                                {resolution.value.map((val,i)=>{
                                                    const id = val.id.toString().split("_");
                                                    if(id[1]){
                                                        return (
                                                            <Box justifyContent="space-between" padding="1rem" borderRadius="1rem" margin="1rem 0 0 0" key={i} width="100%" display="flex" alignItems="center" bgColor="rgba(255,255,255,0.3)">
                                                                <Text fontWeight="300" fontSize="2rem" color="white" textTransform="capitalize">{val.title}</Text>
                                                            </Box>
                                                        )
                                                    }else{
                                                        return (
                                                            <Box justifyContent="space-between" padding="1rem" borderRadius="1rem" margin="1rem 0 0 0" key={i} width="100%" display="flex" alignItems="center" bgColor="rgba(255,255,255,0.3)">
                                                                <Text fontWeight="300" fontSize="2rem" color="white" textTransform="capitalize">{val.title}</Text>
                                                                <Button width="3rem" height="3rem" onClick={()=>deleteResolution(val.id)}  color="#29304a" fontSize="2" unitSize="rem" >
                                                                    <FontAwesomeIcon icon={faTimes} />
                                                                </Button>
                                                            </Box>
                                                        )
                                                    }
                                                })}
                                                <Button width="100%" bgColor="#3892e9" margin="1rem 0" onClick={save} height="5rem" borderRadius="1rem" padding="1rem 3rem" color="white" fontSize="1.7" unitSize="rem" >
                                                    Simpan
                                                </Button>
                                            </React.Fragment>
                                        }
                                    </Box>
                                    <Box  padding="4rem" justifyContent="center" display="flex" alignItems="center" flexDirection="column" flex="1" height="100%">
                                        <Button onClick={()=>setModalInputResolution({show: true,lock: false})} width="100%" border="2px dashed white" justifyContent="center" display="flex" alignItems="center" margin="1rem 0"  height="5rem" borderRadius="1rem" padding="1rem 3rem" bgColor="#29304a" color="white" fontSize="1.7" unitSize="rem" >
                                            <Box fontSize="1.7rem" color="white" display="flex" alignItems="center" justifyContent="center">
                                                <FontAwesomeIcon icon={faPlus} />
                                            </Box>
                                            <Text margin="0 0 0 1rem" fontSize="2rem" color="white" >Tambah</Text>
                                        </Button>
                                        <Button onClick={()=>setModalAdvice({show: true,lock: false})} boxShadow="0px 0px 0px 3px #009688" border="5px solid #29304a" width="100%" bgColor="#009688" margin="1rem 0"  height="5rem" borderRadius="1rem" padding="1rem 3rem" color="white" fontSize="1.7" unitSize="rem" >
                                            Dari yang mudah aja dulu
                                        </Button>
                                    </Box>
                                </React.Fragment>
                            }
                            </React.Fragment>
                        }
                    </Box>

                </Box>
            </Container>
        </React.Fragment>
    )
}

export default Resolution;