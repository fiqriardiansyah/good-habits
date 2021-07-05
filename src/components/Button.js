import React from 'react';
import Styled from 'styled-components';

const Container = Styled.button`
    min-width: ${props => !props.width && '10rem'};
    background-color: ${props => props.bgColor || 'transparent'};
    color: ${props => props.color || 'black'};
    width: ${props => props.width || 'auto'};
    height: ${props => props.height || 'auto'};
    border: ${props => props.border || 'none'};
    border-radius: ${props => props.borderRadius || '0'};
    font-size: ${props => `${props.fontSize}${props.unitSize}` || '1rem'};
    padding: ${props => props.padding || '0'};
    margin: ${props => props.margin || '0'};
    font-family: ${props => props.fontFamily};
    box-shadow: ${props => props.boxShadow};
    cursor: pointer;
    transition: all .2s;
    position: ${props => props.position};
    top: ${props => props.top};
    bottom: ${props => props.bottom};
    right: ${props => props.right};
    left: ${props => props.left};
    font-weight: ${props => props.fontWeight};

    display: ${props => props.display};
    align-items: ${props => props.alignItems};
    justify-content: ${props => props.justifyContent};
    
    white-space: nowrap;

    :active{
        outline: none;
    }
    :hover{
        color: ${props => props.hoverColor };
        background-color: ${props => props.hoverBgColor};
    }

    ${props => props.mediaQueries };


`

const Button = props =>{
    return (
        <Container onClick={props.onClick} {...props}>
            {props.children}
        </Container>
    )
}

export default Button;