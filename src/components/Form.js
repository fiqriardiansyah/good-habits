import React from 'react';
import Styled from 'styled-components';


import {StyleBasic} from '../utils/globalSetElement';

const Container = Styled(StyleBasic("form"))`

`

const Form = props => {
    return (
        <Container {...props} onSubmit={props.onSubmit}>
            {props.children}
        </Container>
    )
}

export default Form;