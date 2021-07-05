import React from 'react';
import Styled from 'styled-components';

const Container = Styled.div`
    width: ${props => props.width};
    height: ${props => props.height};
    border-radius: ${props => props.borderRadius || '0'};
    border: ${props => props.border };
    margin: ${props => props.margin};
    overflow: hidden;
`
const Image = Styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
`

const ImageBox = props =>{
    return (
        <Container {...props}>
            <Image src={props.image} />
        </Container>
    )
}

export default ImageBox;
