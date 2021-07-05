import React from 'react';
import Styled from 'styled-components';

import Backdrop from './Backdrop';

const Container = Styled.div`
    width: ${props => props.width};
    height: ${props => props.height};
    background-color: ${props => props.bgColor};
    position: absolute;
    top: 0;
    left: ${props => props.show ? '0' : `-${props.width}`};
    z-index: 200;
    transition: all .5s;
`

const SideDrawer = props => {
    return (
        <React.Fragment>
             <Container {...props}>
                {props.children}
            </Container>
            {props.show && <Backdrop onClick={props.handlerOpenDrawer} />}
        </React.Fragment>
    )
}

export default SideDrawer;