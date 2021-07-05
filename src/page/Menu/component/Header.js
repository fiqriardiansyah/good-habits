import React,{useContext,useState} from 'react';
import Styled from 'styled-components';

import {StyleBasic} from '../../../utils/globalSetElement';

//context
import {UserContext} from '../../../context/userContext';

//utils
import {mediaQueries} from '../../../utils/mediaQueries';

//components
import Box from '../../../components/Box';
import Text from '../../../components/Text';
import Button from '../../../components/Button';
import Modal from '../../../components/Modal';
import Auth from '../../../components/Auth';

const Container = Styled(StyleBasic("div"))``;

const Header = props =>{

    //contxt
    const {user} = useContext(UserContext);

    //auth
    const [auth,setAuth] = useState(false);

    return (
        <React.Fragment>

            <Auth show={auth} handler={setAuth} />

            <Container height="7rem" mediaQueries={`${mediaQueries("sm")`padding: 1rem;`}`} bgColor="white" zIndex="20" position="sticky" top="0" left="0" padding="2rem 5rem" width="100%" height="auto" display="flex" alignItems="center" justifyContent="space-around" >
                <Text flex="1" fontSize="3rem" fontWeight="600" color="#20264e" textTransform="capitalize">
                    {props.title}
                </Text>
                <Box flex="1"  display="flex" alignItems="center" justifyContent="center">
                    {user && props.children }
                </Box>
            </Container>
        </React.Fragment>
    )
}

export default Header;