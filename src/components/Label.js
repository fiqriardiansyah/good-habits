import React from 'react';
import Styled from 'styled-components';

import {StyleBasic} from '../utils/globalSetElement';

const Container = Styled(StyleBasic("label"))`

`;


const Label = props =>{
    return (
        <Container {...props} >
            {props.children}
        </Container>
    )
}

export default Label;