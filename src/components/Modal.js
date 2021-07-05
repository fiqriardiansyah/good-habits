import React,{useRef} from 'react';
import Styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes} from '@fortawesome/free-solid-svg-icons';  



import {StyleBasic} from '../utils/globalSetElement';
import {mediaQueries} from '../utils/mediaQueries';

///component
import Button from './Button';
import Backdrop from './Backdrop';
import Box from './Box';


const Container = Styled(StyleBasic("div"))`
    transition: all .5s;
    position: fixed;
    transform: translate(-50%,-50%);
    top: ${props =>  props.show ? props.top : '-100%'};
    left: ${props => props.left };
    z-index: 500;

    ${mediaQueries("sm")`
        width: 90%;
    `}
`

const useComponentWillMount = func =>{
    const willMount = useRef(true);

    if(willMount.current) func();

    willMount.current = false;
}

const Modal = props =>{

    
    return (
        <React.Fragment>
            <Container {...props}>
                {!props.lock &&
                <Button onClick={props.lock ? ()=>{} : props.handler} position="absolute" top="1rem" right="1rem" color="rgba(0,0,0,0.7)" width="3rem" height="3rem" fontSize="2" unitSize="rem">
                    <FontAwesomeIcon icon={faTimes} />
                </Button> }
                {props.children}
            </Container>
            {props.show && <Backdrop onClick={props.lock ? ()=>{} : props.handler} />}
        </React.Fragment>
    )
}

export default Modal;