import React from 'react';
import Styled from 'styled-components';

const Container = Styled.p`
        color: ${props => props.color};
        font-size: ${props => props.fontSize};
        font-weight: ${props => props.fontWeight};
        text-decoration: ${props => props.textDecoration};
        text-transform: ${props => props.textTransform};
        margin: ${props => props.margin};
        white-space: ${props => props.wrap && 'nowrap'};
        text-align: ${props => props.textAlign};
        cursor: ${props => props.cursor};
        transition: all .2s;

        @media(max-width: 900px){
            font-size: ${props =>  props.fontSizePhone };
        }

        :hover{
            color: ${props => props.hoverColor};
        }
    `

const cutText = (text,cutLength) =>{
    return `${text.length > cutLength ? `${text.split("").slice(0,cutLength).join("")}...` : text}`
}

const Text = props =>{

    return (
        <Container {...props}>
            {props.cutLength ? cutText(props.children,props.cutLength) : props.children}
        </Container>
    )
}

export default Text;