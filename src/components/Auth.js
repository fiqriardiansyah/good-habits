import React,{useState} from 'react';
//firebase
import {signIn,signUp} from '../firebase/firebaseFunction';

// components
import Box from './Box';
import Text from './Text';
import Button from './Button';
import Modal from './Modal';
import Input from './Input';
import Label from './Label';
import Sign from './Sign';

const Auth = props => {

    const [content,setContent] = useState('form');

    /////////////////////////////sign
    // sign -error-warning-loading-success
    const defaultSign = {loading: false,success: false,warning: false,error: false,text: '',button: [{textButton: '-',color: 'white',bgColor: 'blue',hoverBgColor: 'red',action: ()=>{}}]}
    const [sign,setSign] = useState(defaultSign);

    //////////////////////////////////////////////////////////////////form
    const [isSignIn,setIsSignIn] = useState(true);
    const [error,setError] = useState(false);
    const [validation,setValidation] = useState({
        email: {
            value: '',
            error: true
        },
        password: {
            value: '',
            error: true
        },
        password2: {
            value: '',
            error: true
        }
    });

    const validationEmail = (value,error) => setValidation({...validation,email: {...validation.email,value: value,error: error.error}});
    const validationPassword = (value,error) => setValidation({...validation,password: {...validation.password,value: value,error: error.error}});
    const validationPassword2 = (value,error) => setValidation({...validation,password2: {...validation.password2,value: value,error: error.error}});

    const SubmitForm = async ()=>{

        if(!isSignIn && validation.password.value !== validation.password2.value) return setError(true);

        setContent('sign');
        let req;
        setSign({...defaultSign,show: true,loading: true,text: 'loading...',button: []});
        if(isSignIn){
            req = await signIn(validation.email.value,validation.password.value);
        }else{
            req = await signUp(validation.email.value,validation.password.value);
        }

        if(req.success){
            setSign({...defaultSign,show: true,loading: false,success: true,text: 'welcome a board !!',button: [
                {textButton: 'get it',color: 'white',bgColor: '#76ff03',hoverBgColor: '#aeea00',action: ()=>props.handler(false)},
            ]});
        }else{
            setSign({...defaultSign,show: true,loading: false,error: true,text: req.message.message,button: [
                {textButton: 'try again',color: 'white',bgColor: '#76ff03',hoverBgColor: '#aeea00',action: ()=>setContent('form')}
            ]});
        }

    }
   
    return (
        <React.Fragment>


            <Modal overflowY="auto" lock={false} borderRadius="1rem" padding="3rem" top="50%" left="50%" show={props.show} handler={()=>props.handler(false)} minWidth="40rem" maxHeight="95vh" minHeight="20rem" bgColor="white" display="flex" alignItems="center" justifyContent="center">
                {content === 'form' &&
                    <Box display="flex" alignItems="center" flexDirection="column" width="100%" height="100%">
                    {props.children}
                    <Box flexDirection="column" display="flex" alignItems="flex-start" justifyContent="center">
                        <Label fontSize="2rem" htmlFor="email" margin="0 0 1rem 0" color="rgba(0,0,0,0.6)">Email</Label>
                        <Input validation={validationEmail} bgColorFocus="white" bgColor="#e6e6e6" borderFocus="0px 0px 2px 3px #6c91f9" borderRadius="1rem  " border="none" padding="1rem 3rem" fontSize="2rem"  name="email" type="email" placeholder="email" />
                    </Box>
                    <Box margin="2rem 0 0 0" flexDirection="column" display="flex" alignItems="flex-start" justifyContent="center">
                        <Label fontSize="2rem" htmlFor="password" margin="0 0 1rem 0" color="rgba(0,0,0,0.6)">Password</Label>
                        <Input validation={validationPassword} bgColorFocus="white" bgColor="#e6e6e6" borderFocus="0px 0px 2px 3px #6c91f9" borderRadius="1rem  " border="none" padding="1rem 3rem" fontSize="2rem"  name="password" type="password" placeholder="password" />
                    </Box>
                    {!isSignIn &&
                        <Box margin="2rem 0 0 0" flexDirection="column" display="flex" alignItems="flex-start" justifyContent="center">
                            <Label fontSize="2rem" htmlFor="password2" margin="0 0 1rem 0" color="rgba(0,0,0,0.6)">Password</Label>
                            <Input validation={validationPassword2} bgColorFocus="white" bgColor="#e6e6e6" borderFocus="0px 0px 2px 3px #6c91f9" borderRadius="1rem  " border="none" padding="1rem 3rem" fontSize="2rem"  name="password2" type="password" placeholder="password" />
                        </Box>
                    }
                    {error &&
                        <Text textAlign="center" fontSize="1.5rem" color="red">
                            first password and second password must be same !
                        </Text>
                    }
                    <Box margin="5rem 0 0 0" width="100%" height="4rem" display="flex" justifyContent="flex-end" alignItems="center">
                        {!validation.email.error && !validation.password.error && 
                        <Button onClick={SubmitForm} display="flex" alignItems="center" justifyContent="center" width="auto" height="100%" padding="1rem 4rem" bgColor="#3791e8" hoverBgColor="#1968b5" color="white" fontSize="1.7" unitSize="rem" borderRadius=".5rem">
                            {isSignIn ? 'Sign in' : 'Sign up'}
                        </Button>}
                    </Box>
                    <Text fontSize="1.3rem" color="blue" onClick={()=>setIsSignIn(prev => !prev)} cursor="pointer" >
                        {isSignIn ? 'not have an account ? signup': 'already have an account ? signin'}
                    </Text>
                </Box>}
                {content !== 'form' &&
                <Sign loading={sign.loading} success={sign.success} warning={sign.warning} error={sign.error} text={sign.text} button={sign.button} />
                }
            </Modal>
           
        </React.Fragment>
    )
}

export default Auth;