import React from 'react';
import Styled,{keyframes} from 'styled-components';

const animation = keyframes`
    from{
        ${props => props.from};
    }
    to{
        ${props => props.to};
    }
`

const Container = Styled.div`
    animate: ${props => props.animation}${animation};
`

const Animate = props =>{
    return (
        <Container {...props}>
            {props.children}
        </Container>
    )
}

export default Animate;