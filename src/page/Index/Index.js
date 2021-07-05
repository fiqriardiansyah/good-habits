import React,{useEffect,useState,useContext} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationTriangle,faExclamationCircle ,faCheckCircle,faTimes,faCheck} from '@fortawesome/free-solid-svg-icons'    

// image
import {Ava1,Ava2,Ava3,Ava4} from '../../components/Svg';

//media queri
import {mediaQueries} from '../../utils/mediaQueries';

// components
import Navbar from '../../components/Navbar';
import Box from '../../components/Box';
import Text from '../../components/Text';
import Button from '../../components/Button';
import SideDrawer from '../../components/SideDrawer';
import Links from '../../components/Links';
import Auth from '../../components/Auth';

///context
import {UserContext} from '../../context/userContext';

import IndexHome from '../Home/Index';

const styleBreakPoint = `
    ${mediaQueries("sm")`
        flex-direction: column;
    `}
`
const Box1 = `
    ${mediaQueries("sm")`
        order: 1;
        height: 100vh;
        flex: auto;
    `}
`
const Box2 = `
    ${mediaQueries("sm")`
        height: 80vh;
        flex: auto;
        justify-content: center;
        border-radius: 0 0 10rem 10rem;
        align-items: flex-end;
    `}
`
const center = `
    ${mediaQueries("sm")`
        display: flex;
        align-items: center;
        justify-content: center;
    `}
`



const Index = props => {

    //context
    const {user,setIsGuest} = useContext(UserContext);

    //modal
    const [auth,setAuth] = useState(false);
    
    if(user) return <IndexHome />
    return (
        <React.Fragment>

            <Auth show={auth} handler={setAuth}  />

            <Navbar />

            <Box width="100vw" minHeight="100vh" display="flex" bgColor="#f4f9ff" mediaQueries={styleBreakPoint} >
                <Box mediaQueries={Box1}  height="100vh" display="flex" flex="2"  alignItems="center" justifyContent="center">
                    <Box mediaQueries={`
                        ${mediaQueries("sm")`
                            max-width: 90%;
                        `}
                    `} maxWidth="60%" 
                    display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                        <Box mediaQueries={center} width="100%" margin="0 0 2rem 0">
                            <Text fontSize="5rem" color="#2e3654" element="p" fontWeight="500">
                                Let's change your habits
                            </Text>
                        </Box>
                        <Box mediaQueries={center} width="100%" margin="0 0 2rem 0">
                            <Text fontSize="2rem" color="grey" element="p">
                                Plan your days to be more productive
                            </Text>
                        </Box>
                        <Box mediaQueries={center} width="100%" margin="0 0 2rem 0">
                            <Button onClick={()=>setAuth(true)} hoverBgColor="#823cff99" bgColor="#823cff" padding="1rem 2rem" borderRadius=".5rem" color="#fff" fontSize="2" unitSize="rem">
                                Sign in
                            </Button>
                        </Box>
                    </Box>
                </Box>
                <Box mediaQueries={Box2} height="100vh" display="flex" flex="1" bgColor="#823cff" borderRadius="0 0 0 10rem" alignItems="center">

                    <Box mediaQueries={`
                        ${mediaQueries("sm")`
                            transform: translateX(0) !important;
                            width: 90%;
                            align-items: center;
                        `}
                    `} style={{transform: 'translateX(-20%)'}} width="50rem" display="flex" flexDirection="column" alignItems="flex-end" >

                        <Box margin="0 0 1rem 0" width="auto" display="flex" padding="1.5rem" borderRadius="1rem" bgColor="#6736bfb8" alignItems="center" justifyContent="space-between">
                            <Text wrap="true" element="p" color="white" fontWeight="500" fontSize="1.8rem">
                                ⚡ your activity
                            </Text>
                        </Box>
                        <Box animation={true} transition="all .6s" className="animation-box1" margin="0 0 1rem 0" opacity=".6" width="70%" display="flex" padding="1.5rem" borderRadius="1rem" bgColor="white" alignItems="center" justifyContent="space-between">
                            <Box display="flex" >
                                <Box margin="0 2rem 0 0" display="flex" alignItems="center" justifyContent="center" width="4rem" height="4rem" borderRadius="50%" overflowY="hidden" overflowX="hidden">
                                    <Ava1 width="4rem" height="4rem" />
                                </Box>
                                <Box  width="100%" fontSize="1.7rem" color="#fc6363" display="flex" alignItems="center">
                                    <FontAwesomeIcon icon={faTimes} />
                                    <Text color="rgba(0,0,0,0.4)" element="p" textTransform="capitalize" margin="0 0 0 1rem">
                                        uncompleted task
                                    </Text> 
                                </Box>
                            </Box>
                            <Box color="#fc6363" fontSize="1.8rem">
                                <FontAwesomeIcon icon={faExclamationTriangle} />
                            </Box>
                        </Box>
                        
                        <Box className="animation-box3" boxShadow="0px 3px 30px rgba(0,0,0,0.4)" margin="0 0 1rem 0" opacity="1" width="100%" display="flex" padding="1.5rem" borderRadius="1rem" bgColor="white" alignItems="center" justifyContent="space-between">
                            <Box  display="flex" >
                                <Box  margin="0 2rem 0 0" display="flex" alignItems="center" justifyContent="center" width="4rem" height="4rem" borderRadius="50%" overflowY="hidden" overflowX="hidden">
                                    <Ava2 width="4rem" height="4rem" />
                                </Box>
                                <Box width="100%" display="flex" flexDirection="column">
                                    <Text element="p" textTransform="capitalize" margin="0 0 1rem 0">
                                        your progress today
                                    </Text> 
                                    <Box  borderRadius="1rem" width="100%" height="1rem" overflowX="hidden" bgColor="rgba(0,0,0,0.1)">
                                        <Box width="70%" height="100%" borderRadius="1rem" bgColor="#58cf92" />
                                    </Box>
                                </Box>
                            </Box>
                            <Box color="#fc6363" fontSize="1.8rem">
                                <FontAwesomeIcon icon={faExclamationCircle} />
                            </Box>
                        </Box>
                        <Box className="animation-box2" boxShadow="0px 3px 30px rgba(0,0,0,0.4)" margin="0 0 1rem 0" opacity="1" width="90%" display="flex" padding="1.5rem" borderRadius="1rem" bgColor="white" alignItems="center" justifyContent="space-between">
                            <Box display="flex" >
                                <Box  margin="0 2rem 0 0" display="flex" alignItems="center" justifyContent="center" width="4rem" height="4rem" borderRadius="50%" overflowY="hidden" overflowX="hidden">
                                    <Ava3 width="4rem" height="4rem" />
                                </Box>
                                <Box  width="100%" fontSize="1.7rem" color="green" display="flex" alignItems="center">
                                    <FontAwesomeIcon icon={faCheck} />
                                    <Text color="rgba(0,0,0,0.4)" element="p" textTransform="capitalize" margin="0 0 0 1rem">
                                        focus on work
                                    </Text> 
                                </Box>
                            </Box>
                            <Box color="#58cf92" fontSize="1.8rem">
                                <FontAwesomeIcon icon={faCheckCircle} />
                            </Box>
                        </Box>
                        <Box className="animation-box1" margin="0 0 1rem 0" opacity=".6" width="70%" display="flex" padding="1.5rem" borderRadius="1rem" bgColor="white" alignItems="center" justifyContent="space-between">
                            <Box display="flex" >
                                <Box  margin="0 2rem 0 0" display="flex" alignItems="center" justifyContent="center" width="4rem" height="4rem" borderRadius="50%" overflowY="hidden" overflowX="hidden">
                                    <Ava4 width="4rem" height="4rem" />
                                </Box>
                                <Box display="flex" flexDirection="column">
                                    <Text element="p" textTransform="capitalize" margin="0 0 1rem 0">
                                        all task complete!
                                    </Text> 
                                    <Box  width="100%"  borderRadius="1rem" width="100%" height="1rem" overflowX="hidden" bgColor="rgba(0,0,0,0.1)">
                                        <Box width="100%" height="100%" borderRadius="1rem" bgColor="#58cf92" />
                                    </Box>
                                </Box>
                            </Box>
                            <Box color="#58cf92" fontSize="1.8rem">
                                <FontAwesomeIcon icon={faCheckCircle} />
                            </Box>
                        </Box>


                    </Box>

                </Box>
            </Box>
        </React.Fragment>
    )
}

export default Index;