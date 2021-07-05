import React,{useContext,useState} from 'react';

//components
import {ModalBoxForm,SelectAnAvatar,SelectAnHabits,Resolution} from '../../components/components';
import Modal from '../../components/Modal';
import Sign from '../../components/Sign';

//context   
import {DataContext} from '../../context/dataContext';

const FirstData = props => {

    //context
    const {dataProfile,setDataProfile} = useContext(DataContext);

    /////////// STATE

    // sign -error-warning-loading-success
    const defaultSign = {loading: false,success: false,warning: false,error: false,text: 'loading...',button: [
        {textButton: 'refresh',color: 'white',bgColor: '#66bb6a',hoverBgColor: '#aeea00',action: ()=>{setModal({show: false,lock: false})}},
    ]}
    const [sign,setSign] = useState(defaultSign);

    //modal
    const defaultModal = {show: true,lock: true};
    const [modal,setModal] = useState(defaultModal);

    const modalHandler = value =>{
        setModal({...defaultModal,show: value.show,lock: value.lock});
    }
    
    const modalTransition = (finish) =>{
        modalHandler({show: false,lock: false});
        setTimeout(()=>{
            setDataProfile({...dataProfile,step: dataProfile.step+1});
            if(finish){
                modalHandler({show: true,lock: false});
            }else{
                modalHandler({show: true,lock: true});
            }
        },400);
    }

    const submitFirstTimeData =e=>{
        e.preventDefault();

        if(dataProfile.step === 1){
            if(dataProfile.name){
                modalTransition();
            }
        }else if(dataProfile.step === 2){
            if(dataProfile.avatar){
                modalTransition();
            } 
        }else if(dataProfile.step === 3){
            modalTransition();
        }else if(dataProfile.step === 4){
            if(dataProfile.resolution.title){
                
                modalTransition(true);
                // show notif success
                setSign({...defaultSign,success: true,text: `great job ${dataProfile.name} !`,button: [
                    {textButton: 'get it',color: 'white',bgColor: '#66bb6a',hoverBgColor: '#aeea00',action: ()=>{setModal({show: false,lock: false})}},
                ]});
            }
        }
    }

    return (
        <React.Fragment>
            <Modal lock={modal.lock} borderRadius="1rem" padding="3rem" top="50%" left="50%" show={modal.show} handler={()=>modalHandler({show: false,lock: false})} minWidth="40rem" minHeight="20rem" bgColor="white" display="flex" alignItems="center" justifyContent="center">
                {dataProfile.step === 1 && <ModalBoxForm onClick={submitFirstTimeData} />}
                {dataProfile.step === 2 && <SelectAnAvatar onClick={submitFirstTimeData} /> }
                {dataProfile.step === 3 && <SelectAnHabits onClick={submitFirstTimeData} /> }
                {dataProfile.step === 4 && <Resolution handler={props.handler} onClick={submitFirstTimeData} />  }
                {dataProfile.step === 5 && <Sign loading={sign.loading}  success={sign.success} warning={sign.warning} error={sign.error} text={sign.text} button={sign.button} />}
            </Modal>
        </React.Fragment>
    );
}

export default FirstData;