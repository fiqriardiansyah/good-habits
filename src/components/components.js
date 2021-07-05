import React,{useState,useEffect,useContext,useLayoutEffect} from 'react';
import Lottie from 'react-lottie';
import TrophyResolutionAnimation from '../animation/tropy_resolution.json';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolderPlus,faPlus,faCheckSquare,faTrashAlt,faPencilAlt} from '@fortawesome/free-solid-svg-icons'    


import {
    Ava1,Ava2,Ava3,Ava4,Ava5,Ava6,Ava7,Ava8,Ava9,Ava10,Ava11,Ava12,Ava13,Ava14,Ava15,Ava16,Ava17,Ava18,Ava19,Ava20,
    Emoticon1,Emoticon2,Emoticon3,Emoticon4,Emoticon5
} from './Svg';

//utils

import {mediaQueries} from '../utils/mediaQueries';
import {getTime,getRandomColor,GetIconHabits} from '../utils/utils';

//context
import {DataContext} from '../context/dataContext';
import {UserContext} from '../context/userContext';

//firebase
import {saveGoodHabits} from '../firebase/firebaseFunction';

//components
import Box from './Box';
import Modal from './Modal';
import Input from './Input';
import Text from './Text';
import Button from './Button';
import Label from './Label';
import TextArea from './TextArea';

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


const ModalBoxForm = props =>{

    //context
    const {dataProfile,setDataProfile} = useContext(DataContext);

    const [showButton,setShowButton] = useState(false);

    const setValue = value =>{
        setDataProfile({...dataProfile,name: value});
        if(value !== '') return setShowButton(true);
        return setShowButton(false);
    }

    return (
        <Box width="100%" display="flex" alignItems="center" justifyContent="center" flexDirection="column">
            <Text fontSizePhone="3rem" wrap="true" element="p" fontSize="4rem" textTransform="capitalize" margin="0 0 2rem 0">
                what's your name ?
            </Text>
            <Box width="100%" height="100%" display="flex" justifyContent="center" alignItems="center" flexDirection="column" >
                <Box  display="flex" justifyContent="center" alignItems="center" width="100%" margin="0 0 2rem 0" >
                    <Input textAlign="center" validation={setValue} bgColorFocus="white" bgColor="#e6e6e6" borderFocus="0px 0px 2px 3px #6c91f9" borderRadius="1rem" border="none" padding="1rem 3rem" fontSize="2rem" id="name" name="name" type="text" placeholder="your name" />
                </Box>
                <Box width="100%" justifyContent="center" display="flex" margin="2rem 0 0 0">
                    {showButton && <Button onClick={props.onClick} type="button" fontSize="2" unitSize="rem" color="white" bgColor="#3791e8" hoverBgColor="#1968b5"  borderRadius="1rem" padding="1rem 3rem">
                        that's my name
                    </Button>}
                </Box>
            </Box>
        </Box>
    );
}

const styleBox = `
    ${mediaQueries("sm")`
        grid-template-columns: repeat(2,1fr);
    `}
`
const a = `
    ${mediaQueries("sm")`
        width: 10rem;
        height: 10rem;
    `}
`

const SelectAnAvatar = props =>{

    //context
    const {dataProfile,setDataProfile} = useContext(DataContext);

    const click = e=>{
        setDataProfile({...dataProfile,avatar: false});
        const avatarId = e.target.closest('.box-avatar').id;
        setDataProfile({...dataProfile,avatar: avatarId});
    }

    useEffect(()=>{
        if(dataProfile.avatar){
            const allBoxAvatar = document.querySelectorAll('.box-avatar-round');
            [...allBoxAvatar].forEach(el => el.style.backgroundColor = '#6666ff');

            const box = document.getElementById(dataProfile.avatar);
            const boxAvatar = box.querySelectorAll('.box-avatar-round');
            [...boxAvatar].forEach(el => el.style.backgroundColor = '#ff9100');
        }
    },[dataProfile.avatar]);

    return (
        <Box width="100%" height="100%" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
            <Text textAlign="center" element="p" fontSize="3rem" textTrasnform="capitalize">choose your avatar</Text>
            <Box bgColor="white" position="relative" overflowY="auto" width="70vw" height="60vh" display="flex" alignItems="center" justifyContent="center" flexDirection="column">
                <Box mediaQueries={styleBox} padding="1rem" position="absolute" top="0" bgColor="white" width="100%" display="grid" gridTemplateColumns="repeat(auto-fit, minmax(15rem, 1fr))" gridGap="1rem">
                    {[
                        Ava1,Ava2,Ava3,Ava4,Ava5,Ava6,Ava7,Ava8,Ava9,Ava10,Ava11,Ava12,Ava13,Ava14,Ava15,Ava16,Ava17,Ava18,Ava19,Ava20
                    ].map((Val,i)=>{
                        return <Box onClick={click} id={`ava_${i}`} className="box-avatar" cursor="pointer" padding="1rem" bgColor="white" width="100%" height="15rem" display="flex" justifyContent="center" alignItems="center" key={i} >
                            <Box transition="all .3s" className="box-avatar-round" mediaQueries={a} overflowX="hidden" oveflowY="hidden" position="relative" bgColor="#6666ff" width="14rem" height="14rem" transition="all .3s" hoverBorderRadius="1rem" borderRadius="100px" display="flex" justifyContent="center" alignItems="center">
                                <Box transition="all .3s" className="box-avatar-round" mediaQueries={a}  display="flex" justifyContent="center" alignItems="center" bgColor="#6666ff" width="14rem" height="14rem" borderRadius="100px" overflowY="hidden" overflowX="hidden">
                                    <Val height="100%" width="100%"/>
                                </Box>
                            </Box>
                        </Box>
                    })}
                </Box>
            </Box>
            <Box margin="1rem 0" display="flex" height="4rem" width="100%" alignItems="center" justifyContent="flex-end">
                {dataProfile.avatar && <Button onClick={props.onClick} display="flex" alignItems="center" justifyContent="center" width="auto" height="100%" padding="1rem" bgColor="#3791e8" hoverBgColor="#1968b5" color="white" fontSize="1.7" unitSize="rem" borderRadius=".5rem">seems good</Button> }
            </Box>
        </Box>
    )
}

const SelectAnEmoticon = props =>{
    //context
    const {dataProfile,dataActivity,setDataActivity} = useContext(DataContext);

    const click = e=>{
        setDataActivity({...dataActivity,emoticon: false});
        const emoticonId = e.target.closest('.emoticon-box').id;
        setDataActivity({...dataActivity,emoticon: emoticonId});
    }

    useEffect(()=>{
        if(dataActivity.emoticon){
            const allBoxEmoticon = document.querySelectorAll('.emoticon-shadow');
            [...allBoxEmoticon].forEach(el => el.style.opacity = '0');

            const box = document.getElementById(dataActivity.emoticon);
            const boxEmoticon = box.querySelectorAll('.emoticon-shadow');
            [...boxEmoticon].forEach(el => el.style.opacity = '1');
        }
    },[dataActivity.emoticon]);

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
        <Box transition={props.transition} opacity={props.opacity} minWidth="60vw" bgColor="white" display="flex" justifyContent="center" alignItems="center" flexDirection="column">
                    <Text fontSizePhone="2.5rem" margin="0 0 4rem 0" fontSize="4rem" color="rgba(0,0,0,0.7)" textTransform="capitalize" textAlign="center">
                        bagaimana kabarmu hari ini {dataProfile.name.split(" ")[0]} ?
                    </Text>
                    <Text textAlign="center" fontSize="2rem" color="rgba(0,0,0,0.3)">
                        {`${getTime.day()} , ${getTime.date()}-${getTime.month()}-${getTime.year()}`}
                        <br></br>       
                        {`${getTime.hours()}:${getTime.minutes()} `}
                    </Text>
                    <Box display="flex" justifyContent="space-around" alignItems="center">
                        {[Emoticon1,Emoticon2,Emoticon3,Emoticon4,Emoticon5].map((Icon,i)=>{
                            return (
                                <Box key={i} onClick={click} className="emoticon-box" id={`emoticon_${i+1}`} flexDirection="column" cursor="pointer" width="100%" height="100%" display="flex" justifyContent="center" alignItems="center">
                                    <Icon height={isPhone ? "7rem":"15rem"} width={isPhone ? "7rem":"15rem"}/>
                                    <Box transition=".5s" className="emoticon-shadow" opacity="0" filter="blur(3px)" margin="2rem auto" width="50%" height=".7rem" bgColor="rgba(0,0,0,0.5)" borderRadius="50%">
                                    </Box>
                                </Box>
                            )
                        })}    
                    </Box>
                    <Box margin="4rem 0 0 0" width="100%" height="4rem" display="flex" justifyContent="flex-end" alignItems="center">
                        {dataActivity.emoticon && 
                        <Button onClick={props.onClick} display="flex" alignItems="center" justifyContent="center" width="auto" height="100%" padding="1rem 4rem" bgColor="#3791e8" hoverBgColor="#1968b5" color="white" fontSize="1.7" unitSize="rem" borderRadius=".5rem">
                            Yep
                        </Button> }
                    </Box>
                </Box>
    )
}

const SelectAnHabits = props =>{


    //context
    const {goodHabits,setDataGoodHabits} = useContext(DataContext);
    const {user} = useContext(UserContext);

    //modal
    const [modal,setModal] = useState({show: false,lock: false});
    const [addCategory,setAddCategory] = useState({title: '',activitys: []});

    const activitysHandler = value =>{
        const activitys = value.split(",").filter(el => el !== '');
        setAddCategory({...addCategory,activitys});
    }

    const addCategoryHandler = ()=>{
        setModal({show: false,lock: false});
        let newHabit = {id: goodHabits.length + 1,icon: faFolderPlus,set: false,name: addCategory.title,title: addCategory.title,desc: addCategory.activitys.join(","),habits: {
            availableHabits: [...addCategory.activitys.map((el,i)=>{
                return {id: i+1,name: el}
            })],
            doHabits: []
        }}
        setDataGoodHabits([...goodHabits,newHabit]);
    }
    
    
    const [showButton,setShowButton] = useState(false);
    const click = e=>{
        const habitsId = parseInt(e.target.closest('.habits-box').id);

        const tempGoodHabits = goodHabits.map(el =>{
            if(el.id === habitsId) return {...el,set: !el.set};
            return el;
        })

        setDataGoodHabits(tempGoodHabits);
    }
    useEffect(()=>{
        if(goodHabits){
            let n = 0;
            goodHabits.forEach(val =>{

                const box = document.querySelector(`.habit-box-${val.id}`);
                const text = box.querySelectorAll(".text-habits");

                if(val.set){
                    n++;
                    [...text].forEach(el => el.style.color = 'white' );
                    box.style.backgroundColor = '#66bb6a';
                }else{
                    box.style.backgroundColor = 'white';
                    [...text].forEach((el,i) => i == 0 ? el.style.color = 'rgba(0,0,0,0.9)' : el.style.color = 'rgba(0,0,0,0.5)' );
                }

            });

            if(n !== 0){
                setShowButton(true);
            }else{
                setShowButton(false);
            }
        }
    },[goodHabits]);

    const save = (e)=>{
        props.onClick(e);
        if(user){
            const saveGood = ()=>{
                saveGoodHabits({id: user.uid,goodHabits: JSON.stringify(goodHabits)},()=>{
                    saveGood(); // if error then send again
                });
            }
            saveGood();
        }
    }

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

            <Modal overflowY="auto" lock={modal.lock} borderRadius="1rem" padding="3rem" top="50%" left="50%" show={modal.show} handler={()=>setModal({show: false,lock: false})} minWidth="40rem" maxHeight="95vh" minHeight="20rem" bgColor="white" display="flex" alignItems="center" justifyContent="center">
                <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column">
                    <Box flexDirection="column" display="flex" alignItems="flex-start" justifyContent="center">
                        <Label fontSize="2rem" htmlFor="title" margin="0 0 1rem 0" color="rgba(0,0,0,0.6)">Title</Label>
                        <Input validation={(value)=>{setAddCategory({...addCategory,title: value})}} bgColorFocus="white" bgColor="#e6e6e6" borderFocus="0px 0px 2px 3px #6c91f9" borderRadius="1rem  " border="none" padding="1rem 3rem" fontSize="2rem" id="title" name="title" type="text" placeholder="title" />
                    </Box>
                    <Box margin="2rem 0 0 0" flexDirection="column" display="flex" alignItems="flex-start" justifyContent="center">
                        <Label fontSize="2rem" htmlFor="activity" margin="0 0 1rem 0" color="rgba(0,0,0,0.6)">Activitys</Label>
                        <Input validation={activitysHandler} bgColorFocus="white" bgColor="#e6e6e6" borderFocus="0px 0px 2px 3px #6c91f9" borderRadius="1rem  " border="none" padding="1rem 3rem" fontSize="2rem" id="activity" name="activity" type="text" placeholder="activity 1,activity 2..." />
                    </Box>
                    <Text margin="1rem 0 0 0" fontSize="1.3rem">(jika aktifitas mu banyak ,pisahkan dengan koma ",")</Text>
                    <Box margin="5rem 0 0 0" width="100%" height="4rem" display="flex" justifyContent="flex-end" alignItems="center">
                        {addCategory.title !== '' && <Button onClick={addCategoryHandler} display="flex" alignItems="center" justifyContent="center" width="auto" height="100%" padding="1rem 4rem" bgColor="#3791e8" hoverBgColor="#1968b5" color="white" fontSize="1.7" unitSize="rem" borderRadius=".5rem">
                            save
                        </Button>}
                    </Box>
                </Box>
            </Modal>

            <Box margin={props.margin} width="50vw" height="90%" display="flex" justifyContent="center" alignItems="center" flexDirection="column">
                    <Text fontSizePhone="2rem" margin="0 0 5rem 0" textTransform="capitalize" fontSize="4rem" color="rgba(0,0,0,0.7)" textAlign="center">
                        pilih hal yang ingin anda jadikan "good habits"
                    </Text>
                    <Box mediaQueries={`
                            ${mediaQueries("sm")`
                                width: auto;
                            `}
                        `} width="100%" overflowY={props.isEnableAddition ? 'unset' : 'auto'} display="flex" justifyContent="center" alignItems="center">
                        <Box mediaQueries={`
                            ${mediaQueries("md")`
                                grid-template-columns: repeat(2,1fr);
                            `}
                        `} width="100%" display="grid" gridGap="1rem" gridTemplateColumns="repeat(auto-fit, minmax(15rem, 1fr))">
                            {goodHabits.map((Val,i)=>{
                                return (
                                    <Box key={i} transition=".2s" borderRadius="1rem" onClick={click} id={`${Val.id}`} className={[`habit-box-${Val.id}`,'habits-box'].join(" ")} position="relative" cursor="pointer" alignSelf="center" justifySelf="center" width="100%" height="100%" display="flex" justifyContent="center" alignItems="center" flexDirection="column">
                                        {Val.set && 
                                        <Box position="absolute" top="1rem" right="1rem" color="white" fontSize="2rem" display="flex" justifyContent="center" alignItems="center">
                                            <FontAwesomeIcon icon={faCheckSquare} />
                                        </Box>}
                                        {(i < 4) ? 
                                        <Box width="10rem" display="flex" justifyContent="center" alignItems="center">
                                            <GetIconHabits iconId={Val.icon} width={isPhone ? '8rem':'15rem'} height={isPhone ? '8rem':'15rem'}  />
                                        </Box> : 
                                        <Box fontSize="10rem" display="flex" justifyContent="center" alignItems="center"color={getRandomColor()}>
                                            <FontAwesomeIcon icon={Val.icon} />
                                        </Box>}
                                        <Text className="text-habits" margin="1rem 0" textTransform="capitalize" fontSize="2rem" color="rgba(0,0,0,0.9)" textAlign="center">
                                            {Val.title}
                                        </Text>
                                        <Text className="text-habits" cutLength="13" textTransform="capitalize" fontSize="1.6rem" color="rgba(0,0,0,0.5)" textAlign="center">
                                            {Val.desc}
                                        </Text>
                                    </Box>
                                )
                            })}
                            {props.isEnableAddition && 
                                <Box bgColor="rgba(0,0,0,0.2)" transition=".2s" borderRadius="1rem" onClick={()=>setModal({show: true,lock: false})}  position="relative" cursor="pointer" alignSelf="center" justifySelf="center" width="100%" minHeight="17rem" display="flex" justifyContent="center" alignItems="center" flexDirection="column">
                                    <Box fontSize="10rem" color="white">
                                        <FontAwesomeIcon icon={faPlus} />
                                    </Box>
                                    <Text  className="text-habits" margin="1rem 0" textTransform="capitalize" fontSize="2rem" color="white" textAlign="center">
                                        tambah kategori
                                    </Text>
                                </Box>
                            }
                        </Box>
                    </Box>
                    <Box margin="5rem 0 0 0" width="100%" height="4rem" display="flex" justifyContent="flex-end" alignItems="center">
                        {showButton && <Button onClick={save} display="flex" alignItems="center" justifyContent="center" width="auto" height="100%" padding="1rem 4rem" bgColor="#3791e8" hoverBgColor="#1968b5" color="white" fontSize="1.7" unitSize="rem" borderRadius=".5rem">
                            it's all
                        </Button>  }
                    </Box>
                </Box>
        </React.Fragment>
    )
}

const Resolution = props =>{
    //context
    const {dataProfile,setDataProfile} = useContext(DataContext);
    const {user} = useContext(UserContext);


    const setValue = value =>{
        if(value !== '') return setDataProfile({...dataProfile,resolution: {...dataProfile.resolution,title: value}});
        return setDataProfile({...dataProfile,resolution: {...dataProfile.resolution,title: false}});
    }

    const setValueDesc = e =>{
        if(e.target.value !== '') return setDataProfile({...dataProfile,resolution: {...dataProfile.resolution,description: e.target.value}});
        return setDataProfile({...dataProfile,resolution: {...dataProfile.resolution,description: false}});
    }

    const save = e =>{
        props.onClick(e);
        props.handler();
    }

    return (
        <Box flexDirection="column" minWidth="50vw" display="flex" alignItems="center" justifyContent="center">
            <Box margin="0 0 2rem 0" display="flex" justifyContent="center" alignItems="center">
                <Lottie options={AnimationOption(TrophyResolutionAnimation,true)} height={200} width={200} />
            </Box>
            <Text margin="0 0 5rem 0" fontSize="2.5rem" color="rgba(0,0,0,0.7)" textTransform="capitalize" textAlign="center">
                hal apa yang paling ingin kamu capai di tahun ini ?
            </Text>
            <Box width="100%" flexDirection="column" display="flex" alignItems="center" justifyContent="space-around">
                <Box flexDirection="column" display="flex" alignItems="center" justifyContent="center">
                    <Input textAlign="center" validation={setValue} bgColorFocus="white" bgColor="#e6e6e6" borderFocus="0px 0px 2px 3px #6c91f9" borderRadius="1rem  " border="none" padding="1rem 3rem" fontSize="2rem" id="title" name="title" type="text" placeholder="title" />
                </Box>
                <Box margin="2rem 0 0 0" flexDirection="column" display="flex" alignItems="center" justifyContent="center">
                    <TextArea getValue={setValueDesc}  bgColorFocus="white" height="10rem" width="30rem" bgColor="#e6e6e6" borderFocus="0px 0px 2px 3px #6c91f9" borderRadius="1rem" border="none" padding="1rem" fontSize="1.6rem" id="desc" col="4" name="desc" type="text" placeholder="Description" />
                </Box>
            </Box>
            <Box margin="5rem 0 0 0" width="100%" height="4rem" display="flex" justifyContent="flex-end" alignItems="center">
                {dataProfile.resolution.title && <Button onClick={save} display="flex" alignItems="center" justifyContent="center" width="auto" height="100%" padding="1rem 4rem" bgColor="#3791e8" hoverBgColor="#1968b5" color="white" fontSize="1.7" unitSize="rem" borderRadius=".5rem">
                    done
                </Button>}
            </Box>
        </Box>
    )
}


const BoxActivity = props =>{

    const [isHover,setIsHover] = useState(false);

    return (
        <Box className={props.className} id={props.id} onClick={props.onClick} transition="all .2s" onMouseOver={()=>setIsHover(true)}  onMouseLeave={()=>setIsHover(false)} cursor="pointer" width="100%" height="100%" display="flex" justifyContent="center" alignItems="center" flexDirection="column">
            <Box display="flex" fontSize={props.isPhone ? '5rem' : '10rem'} justifyContent="center" alignItems="center" color={isHover || props.isActive ? '#64dd17': 'rgba(0,0,0,0.2)'}>
                <FontAwesomeIcon icon={props.val.icon} />
            </Box>
            <Text textAlign="center" margin="1rem 0 0 0" fontSize="1.7rem" color={isHover || props.isActive ? '#64dd17': 'rgba(0,0,0,0.2)'}>
                {props.val.name}
            </Text>
        </Box>


    )
}
const BoxActivityNote = props =>{

    //context
    const {dataActivity,setDataActivity,activityList} = useContext(DataContext);

    const [textArea,setTextArea] = useState({show: false,text: props.addition ? props.desc : ''});

    const getValueNote = e =>{
        setTextArea({show: true,text: e.target.value});
        if(props.addition){

            const tempDataActivityAddition = dataActivity.additionActivity.map((val,i)=>{
                if(val.id === props.val) return {id: props.val,title: props.title,description: e.target.value};
                return val;
            });

            setDataActivity({...dataActivity,additionActivity: [...tempDataActivityAddition]});
        }else{

            const tempDataActivity = dataActivity.activity.map((val,i)=>{
                if(val.id === props.val) return {...val,note: e.target.value};
                return val;
            });

            setDataActivity({...dataActivity,activity: [...tempDataActivity]});
            
        }

    } 

    const deleteActivity = ()=>{

        if(props.addition){
            
            const tempDataActivity = dataActivity.additionActivity.filter((val,i)=> val.id !== props.val);
            setDataActivity({...dataActivity,additionActivity: [...tempDataActivity]});

        }else{
            const tempDataActivity = dataActivity.activity.filter((val,i)=> val.id !== props.val);
            setDataActivity({...dataActivity,activity: [...tempDataActivity]});
        }

    }

    return (
        <Box flexDirection="column" margin="0 0 2rem 0" borderRadius="1rem" bgColor="rgba(0,0,0,0.1)" padding="1rem" width="100%" display="flex" justifyContent="space-between" alignItems="center">
            <Box width="100%" display="flex" justifyContent="space-between" alignItems="center">
                <Box  display="flex" justifyContent="center" alignItems="center">
                    <Box width="5rem" height="5rem" borderRadius="100px" bgColor="#ffb000" margin="0 1rem 0 0" display="flex" fontSize="3rem" justifyContent="center" alignItems="center" color="white">
                        <FontAwesomeIcon icon={props.addition ? activityList[activityList.length - 1].icon : activityList[activityList.find(val => props.val === val.id).id - 1].icon} />
                    </Box>
                    <Box flexDirection="column" display="flex" alignItems="flex-start">
                        <Text margin="0 0 1rem 0" fontWeight="500" textTransform="capitalize" fontSize="1.7rem" color="rgba(0,0,0,0.9)">
                            {props.addition ? props.title :activityList[activityList.find(val => props.val === val.id).id - 1].name}
                        </Text>
                        <Text fontSize="1.2rem" color="rgba(0,0,0,0.6)">
                            senin, 12-february-2020
                        </Text>
                    </Box>
                </Box>
                <Box display="flex" justifyContent="center" alignItems="center">
                    <Button onClick={deleteActivity} width="3rem" height="3rem" borderRadius="1rem" bgColor="#ec5b5b" margin="0 2rem 0 0" display="flex" fontSize="2rem" justifyContent="center" alignItems="center" color="white">
                        <FontAwesomeIcon icon={faTrashAlt} />
                    </Button>
                    <Button onClick={()=>setTextArea({...textArea,show: !textArea.show})} width="3rem" height="3rem" borderRadius="1rem" bgColor="#5bec5d" margin="0 2rem 0 0" display="flex" fontSize="2rem" justifyContent="center" alignItems="center" color="white">
                        <FontAwesomeIcon icon={faPencilAlt} />
                    </Button>
                </Box>
            </Box>
            {textArea.show && 
            <Box margin="2rem 0 0 0" width="100%" display="flex" justifyContent="space-between" alignItems="center" >
                <TextArea id={props.val} name={props.val} value={textArea.text} getValue={getValueNote} placeholder="hari ini saya..." padding="2rem" borderRadius="1rem" border="none"  width="100%" height="20rem" />
            </Box> }
        </Box>
    )
}

const DailyActivity = props =>{

    

    //context
    const {dataProfile,dataActivity,setDataActivity,activityList} = useContext(DataContext);

    const [modal,setModal] = useState({show: false,lock: false});
    const [additionActivity,setAdditionActivity] = useState({title: '',description: ''});

    const modalHandler =value=>{
        setModal({...value});
    }

    const saveAdditionActivity = ()=>{

        if(additionActivity.title !== ''){
            setModal({show: false,lock: false});
            setAdditionActivity({title: '',description: ''});
            setDataActivity({...dataActivity,
                additionActivity: [...dataActivity.additionActivity,{id: dataActivity.additionActivity.length + 1,...additionActivity}]
            });
        }
    }
    
    const click = e=>{
        const id = e.target.closest(".box-activity").id;
        if(id === "9"){
            modalHandler({show: true,lock: false});
        }else{
            const activity = activityList.find((val,i)=> val.id === parseInt(id));
            
            let arr = [];

            const ifExist = dataActivity.activity.find(el => el.id === activity.id);

            if(ifExist){
                arr = [...dataActivity.activity.filter(el => el.id !== activity.id)];
            }else{
                arr = [...dataActivity.activity,activity];
            }
            
            setDataActivity({...dataActivity,activity: arr});
        }
    }

    const [noteActivity,setNoteActivity] = useState([]);
    useEffect(()=>{
            setNoteActivity(dataActivity.activity);
    },[dataActivity.activity]);

    const [noteActivityAddition,setNoteActivityAddition] = useState();
    useEffect(()=>{
        setNoteActivityAddition(dataActivity.additionActivity);
    },[dataActivity.additionActivity]);

    const isActive = id => noteActivity.find(el => el.id === id) ? true : false;

    const [isPhone,setIsPhone] = useState(false);

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

            <Modal lock={modal.lock} borderRadius="1rem" padding="3rem" top="50%" left="50%" show={modal.show} handler={()=>modalHandler({show: false,lock: false})} minWidth="40rem" minHeight="20rem" bgColor="white" display="flex" alignItems="center" justifyContent="center">
                <Box width="100%" height="100%" display="flex" justifyContent="center" alignItems="center" flexDirection="column" >
                    <Input value={additionActivity.title} margin="0 0 2rem 0" textAlign="center" validation={(e)=>{

                        setAdditionActivity({...additionActivity,title: e});

                    }} bgColorFocus="white" bgColor="#e6e6e6" borderFocus="0px 0px 2px 3px #6c91f9" borderRadius="1rem  " border="none" padding="1rem 3rem" fontSize="2rem" id="title" name="title" type="text" placeholder="judul" />
                    <TextArea value={additionActivity.description}  getValue={(e)=>{

                        setAdditionActivity({...additionActivity,description: e.target.value});

                    }}  bgColorFocus="white" height="10rem" width="30rem" bgColor="#e6e6e6" borderFocus="0px 0px 2px 3px #6c91f9" borderRadius="1rem" border="none" padding="1rem" fontSize="1.6rem" id="desc" col="4" name="desc" type="text" placeholder="keterangan"/>
                    <Box  margin="5rem 0 0 0" width="100%" height="4rem" display="flex" justifyContent="flex-end" alignItems="center">
                        <Button onClick={saveAdditionActivity} display="flex" alignItems="center" justifyContent="center" width="auto" height="100%" padding="1rem 4rem" bgColor="#3791e8" hoverBgColor="#1968b5" color="white" fontSize="1.7" unitSize="rem" borderRadius=".5rem">
                            save
                        </Button>
                    </Box>
                </Box>
            </Modal>

            <Box transition={props.transition} opacity={props.opacity} width="100%" height="100%" display="flex" justifyContent="center" alignItems="center" flexDirection="column">
                <Box margin="0 0 5rem 0" width="100%" display="flex" justifyContent="center" alignItems="center" flexDirection="column">
                    <Text color="rgba(0,0,0,0.8)" margin="0 0 1rem 0" fontSize="3rem" textAlign="center" textTransform="capitalize" >
                        apa yang sudah {dataProfile.name.split(" ")[0]} lakukan hari ini?
                    </Text>
                    <Text color="rgba(0,0,0,0.4)" fontSize="2rem" textAlign="center">
                        kamu bisa pilih lebih dari 1
                    </Text>
                </Box>
                {/* asdfasdf */}
                <Box  mediaQueries={`${mediaQueries("sm")`grid-template-columns: repeat(3,1fr);`}`} width="100%" height="auto" display="grid" gridGap="3rem" gridTemplateColumns="repeat(auto-fit, minmax(15rem, 1fr))">
                    {activityList.map((val,i)=>{
                        return <BoxActivity isPhone={isPhone} isActive={isActive(val.id)} onClick={click} id={val.id} className="box-activity" val={val} key={i} />
                    })}
                </Box>

                {noteActivity && noteActivity.length !== 0 &&
                    <Text fontSize="1.7rem" textAlign="center" margin="5rem 0 3rem 0" color="rgba(0,0,0,0.8)">
                        ayo buat catatan pada setiap kegiatanmu !
                    </Text>
                }
                <Box width="100%" height="100%" display="flex" justifyContent="center" alignItems="center" flexDirection="column">
                    {noteActivity && noteActivity.map((val,i)=>{
                        return <BoxActivityNote addition={false} key={i} val={parseInt(val.id)} />
                    })}
                </Box>
                {noteActivityAddition && noteActivityAddition.length !== 0 &&
                    <Text fontSize="1.7rem" textAlign="center" margin="5rem 0 3rem 0" color="rgba(0,0,0,0.8)">
                        kegiatan tambahan
                    </Text>
                }
                <Box width="100%" height="100%" display="flex" justifyContent="center" alignItems="center" flexDirection="column">
                    {noteActivityAddition && noteActivityAddition.map((val,i)=>{
                        return <BoxActivityNote addition={true} title={val.title} desc={val.description} key={i} val={parseInt(val.id)} />
                    })}
                </Box>

                <Box  margin="5rem 0 0 0" width="100%" height="4rem" display="flex" justifyContent="flex-end" alignItems="center">
                    <Button onClick={props.onClick} display="flex" alignItems="center" justifyContent="center" width="auto" height="100%" padding="1rem 4rem" bgColor="#3791e8" hoverBgColor="#1968b5" color="white" fontSize="1.7" unitSize="rem" borderRadius=".5rem">
                        save
                    </Button>
                </Box>
            </Box>
        </React.Fragment>


    )
}

export {
    ModalBoxForm,SelectAnAvatar,SelectAnEmoticon,SelectAnHabits,Resolution,DailyActivity
}