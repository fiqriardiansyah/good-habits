import React,{useState} from 'react';
import Styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationTriangle,faExclamationCircle ,faCheckCircle} from '@fortawesome/free-solid-svg-icons'    

import {mediaQueries} from '../utils/mediaQueries';

import Box from './Box';
import Modal from './Modal';
import Button from './Button';
import Text from './Text';

const style = `
    ${mediaQueries("sm")`
        flex-direction: column;
    `}
`

const Sign = props =>{

    return (
        <Box width="100%" height="100%" display="flex" flexDirection="column" >
                {props.error && 
                <Box margin="0 0 2rem 0" color="#bb002f" fontSize="15rem" display="flex" alignItems="center" justifyContent="center">
                    <FontAwesomeIcon icon={faExclamationTriangle} />
                </Box> }
                {props.warning && 
                <Box margin="0 0 2rem 0" color="#ffa000" fontSize="15rem" display="flex" alignItems="center" justifyContent="center">
                    <FontAwesomeIcon icon={faExclamationCircle} />
                </Box> }
                {props.success && 
                <Box margin="0 0 2rem 0" color="#64dd17" fontSize="15rem" display="flex" alignItems="center" justifyContent="center">
                    <FontAwesomeIcon icon={faCheckCircle} />
                </Box> }
                {props.loading &&
                <Box width="20rem" height="20rem" margin="0 0 2rem 0" display="flex" alignItems="center" justifyContent="center">
                    <Box className="container">
                        <Box className="holder">
                            <Box className="box"></Box>
                        </Box>
                        <Box className="holder">
                            <Box className="box"></Box>
                        </Box>
                        <Box className="holder">
                            <Box className="box"></Box>
                        </Box>
                    </Box> 
                </Box>
                }
                <Text textAlign="center" element="p" margin="0 0 2rem 0" fontSize="3rem" fontSizePhone="2.5rem" color="black">
                    {props.text}
                </Text>
                <Box mediaQueries={style} display="flex" alignItems="center" justifyContent="center">
                    {props.button.map((val,i)=>{
                        return <Button  
                                margin="2rem"
                                fontSize="2"
                                unitSize="rem"
                                color={val.color}
                                onClick={val.action} key={i}
                                bgColor={val.bgColor}
                                padding="1rem 2rem"
                                borderRadius=".5rem"
                                hoverBgColor={val.hoverBgColor}
                                >
                            {val.textButton}
                        </Button>
                    })}
                </Box>
            </Box>
    )
}

export default Sign;