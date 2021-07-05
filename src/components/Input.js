import React,{useState,useRef} from 'react';
import Styled from 'styled-components';
import validator from 'validator';

import {StyleBasic} from '../utils/globalSetElement';
import {mediaQueries} from '../utils/mediaQueries';

import Box from './Box';
import Text from './Text';

const Container = Styled(StyleBasic("input"))`
    font-size: ${props => `${props.fontSize}${props.unitSize}` || '1rem'};
    text-align: ${props => props.textAlign};
    :active{
        outline: none;
    }
    :focus{
        outline: none;
        box-shadow: ${props => props.borderFocus};
        background-color: ${props => props. bgColorFocus};
    }

    ::placeholder { 
        color: ${props => props.placeHolderColor};
        opacity: 1; 
    }
      
    :-ms-input-placeholder { /* Internet Explorer 10-11 */
    color: ${props => props.placeHolderColor};
    }
      
    ::-ms-input-placeholder { /* Microsoft Edge */
    color: ${props => props.placeHolderColor};
    }

    @media(max-width: 600px){
        font-size: ${props => `${parseInt(props.fontSize) - (parseInt(props.fontSize) * 0.20)}${props.unitSize}`}
    }
`

const Input = props =>{
    
    const [error,setError] = useState({error: false,message: ''});

    const validation = e =>{
        let err = {error: false,message: ''};
        const value = e.target.value;

        if(props.type === "text"){
            if(value.length === 0){
                setError({error: true,message: `this field required`});
                err = {error: true,message: `this field required`};
            }else{
                setError({error: false,message: ''});
                err = {error: false,message: ''}
            }
        }else if(props.type === "email"){
            if(!validator.isEmail(value)){
                setError({error: true,message: `not valid email`});
                err = {error: true,message: `not valid email`};
            }else{
                setError({error: false,message: ''});
                err = {error: false,message: ''};
            }
        }else if(props.type === "password"){
            if(value.length < 7){
                setError({error: true,message: `password must bigger then 6 character`});
                err = {error: true,message: `password must bigger then 6 character`}
            }else{
                setError({error: false,message: ''});
                err = {error: false,message: ''};
            }
        }

        props.validation(value,err);

    }

    return (
        <Box display="flex" flexDirection="column" alignItems="flex-end" >
            <Container onChange={props.validation ? validation : ()=>{}} {...props} autoComplete="off" />
            {error.error && <Text element="p" color="red" fontSize="1.5rem" margin="1rem 0 0 0">{error.message}</Text>}
        </Box>
    );
}

export default Input;