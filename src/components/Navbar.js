import React,{useState} from 'react';
import {Link} from 'react-router-dom';
import Styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'    

import {mediaQueries} from '../utils/mediaQueries';

import {ReactComponent as LogoImage} from '../image/logo.svg';

//components
import Button from './Button';
import Box from './Box';
import Text from './Text';
import Auth from './Auth';

const Container = Styled.div`
    width: 100vw;
    height: 8rem;
    position: absolute;
    top: 0;
    left: 0;
    
    display: flex;
    align-items: center;
    justify-content: space-around;
`
const LogoText = Styled.p`
    font-size: 2rem;
    font-weight: 500;
    margin-right: 5rem;
`

const style1 = `
    ${mediaQueries("sm")`
        display: none;
    `}
`
const style2 = `
    ${mediaQueries("sm")`
        display: flex;
    `}
`


const Navbar = props => {
    const [auth,setAuth] = useState(false);
    return (
        <React.Fragment>
            <Auth show={auth} handler={setAuth}  />
            <Container>
                <Box mediaQueries={style1} width="100%" height="100%" display="flex" alignItems="center" justifyContent="space-around">
                    <Box display="flex" alignItems="center" justifyContent="space-around">
                        <LogoImage width="4rem" height="4rem" />
                        <Text margin="0 0 0 2rem" fontSize="3rem" fontWeight="600" color="#7e56c2">Good Habits</Text>
                    </Box>
                    <Button onClick={()=>setAuth(true)} hoverBgColor="#0e61b1" padding="1rem 2rem" bgColor="#6736bfb8" borderRadius=".5rem" color="white" fontSize="1.7" unitSize="rem" >
                        Sign in
                    </Button>
                </Box>
                <Box mediaQueries={style2} width="100%" height="100%" display="none" alignItems="center" justifyContent="space-around">
                    <Box display="flex" alignItems="center" justifyContent="space-around">
                        <LogoImage width="4rem" height="4rem" />
                        <Text margin="0 0 0 2rem" fontSize="3rem" fontWeight="600" color="#fff">Good Habits</Text>
                    </Box>
                </Box>
            </Container>
        </React.Fragment>
    )
}

export default Navbar;