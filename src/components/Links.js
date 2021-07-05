import React from 'react';
import {Link} from 'react-router-dom';
import Styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'    

import {mediaQueries} from '../utils/mediaQueries';

import Box from './Box';
import Button from './Button';

const Ul = Styled.ul`
    list-style: none;
    margin: 0;
    padding: 0;

    display: flex;
    align-items: center;
    justify-content: space-around;
    flex-direction: ${props => props.phone && 'column'};
`
const Li = Styled.li`
    margin: 0;
    margin-left: 1rem;
    margin-right: 1rem;
    font-size: 1.7rem;
    font-weight: 400;
    color: grey;

    ${props => props.phone && `
        font-size: 3rem;
        width: 80%;
        padding: 1rem;
        background-color: #569fe6;
        border-radius: 1rem;
        margin-bottom: 1rem;
        display: flex;
        align-items: center;
        justify-content: center;
    `}

    :hover{
        color: black;
    }
    
`
const LogoText = Styled.p`
    font-size: ${props => props.phone ? '4rem' :'2rem'};
    font-weight: 500;
    margin-right: ${props => props.phone ? '0' :'5rem'};
    margin-bottom: ${props => props.phone ? '5rem' :'0'};
    color: ${props => props.phone && 'white'};
`

const style={
    textDecoration: 'none',
    color: 'rgba(255,255,255,0.8)',

}

const Links = props => {
    return (
        <React.Fragment>
            <Ul {...props}>
                <Box display="flex" alignItems="center" {...props}>
                    <LogoText {...props}>
                        Good Habits
                    </LogoText>
                </Box>
                {props.phone && <hr/>}
                {!props.phone ? 
                <React.Fragment>
                    <Link to="/" style={{textDecoration: 'none'}}><Li {...props}>About</Li></Link>
                    <Link to="/" style={{textDecoration: 'none'}}><Li {...props}>Contact</Li></Link>
                    <Link to="/" style={{textDecoration: 'none'}}><Li {...props}>History</Li></Link>
                </React.Fragment> : 
                <React.Fragment>
                    <Li {...props}><Link to="/" style={style}>About</Link></Li>
                    <Li {...props}><Link to="/" style={style}>Contact</Link></Li>
                    <Li {...props}><Link to="/" style={style}>Hisgtory</Link></Li>
                    <Button
                        margin="2rem 0 0 0"
                        onClick={props.handlerOpenDrawer} borderRadius="1rem" bgColor="white" padding="1rem 2rem" color="#3892e9" fontSize="1.7" unitSize="rem"
                    >Sign Up</Button>
                </React.Fragment> 
                }
                
            </Ul>
        </React.Fragment>
    )
}

export default Links;