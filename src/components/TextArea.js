import React,{useState} from 'react';
import Styled from 'styled-components';

import {StyleBasic} from '../utils/globalSetElement';

const Container = Styled(StyleBasic("textarea"))`
    font-size: ${props => `${props.fontSize}${props.unitSize}` || '1rem'};
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

`;

const TextArea = props =>{

    const [error,setError] = useState({error: false,message: ''});

    return (
        <Container onChange={props.getValue} {...props}>
            {props.children}
        </Container>
    )
}

export default TextArea;