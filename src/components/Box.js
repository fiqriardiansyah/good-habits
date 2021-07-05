import React,{forwardRef} from 'react';
import Styled,{keyframes} from 'styled-components';

import {mediaQueries} from '../utils/mediaQueries';
import {StyleBasic} from '../utils/globalSetElement';


const Container = Styled(StyleBasic("div"))`
    transition: ${props => props.transition};

    :hover{
        background-color: ${props => props.hoverBgColor};
        border-radius: ${props => props.hoverBorderRadius};
    }
`

const Box = forwardRef((props,ref)=>{

    return (
        <Container {...props} ref={ref} >
            {props.children}
        </Container>
    )
})



export default Box;