import React from 'react';
import Styled from 'styled-components';

const Container = Styled.div`
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.8);
    position: fixed;
    top: 0;
    left: 0;
    z-index: ${props => props.zIndex || '200'};
`



const Backdrop = props => {
    return (
        <Container className="backdrop" onClick={props.onClick} {...props} />
    );
}


export default Backdrop;
