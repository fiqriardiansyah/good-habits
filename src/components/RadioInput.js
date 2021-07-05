import React,{useEffect,useRef,useState} from 'react';


const RadioInput = props =>{

    const inputs = useRef([]);

    const click = e =>{
        props.value(inputs.current);
    }

    return (
        <div className="container-radio-input">
            <div className="container-radio-input-form">
                {props.element.map((val,i)=>{
                    return (
                        <label onClick={click} key={i} className="container-radio-input-label">
                            <input ref={el => inputs.current[i] = el } type="radio" name="radio" id={`radio_${i}`} />
                            <span>{val}</span>
                        </label>
                    )
                })}
            </div>
        </div>
    )
}


export default RadioInput;