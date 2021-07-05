import firebase from './firebaseConfig';
import {getTime} from '../utils/utils';

const signIn = async (email,password) =>{
    try{
        await firebase.auth().signInWithEmailAndPassword(email,password);
        return {success: true};
    }catch(e){
        console.log('error in signin',e);
        return {success: false,message: e};
    }
}

const signUp = async (email,password) =>{
    try{
        await firebase.auth().createUserWithEmailAndPassword(email,password);
        return {success: true};
    }catch(e){
        console.log('error in signup',e);
        return {success: false,message: e};
    }
}

const logout = async ()=>{
    try{
        firebase.auth().signOut();
    }catch(e){
        console.log('error in logout',e);
    }
}

const authStateChange = async func=>{
    firebase.auth().onAuthStateChanged((user)=>func(user));
}

const saveDataProfile = async (data,func) =>{
    const db = firebase.firestore();
    try{
        const req = await db.collection('users').doc(data.id).get();
        if(!req.exists){
            await db.collection('users').doc(data.id).set({
                name: data.name,
                avatar: data.avatar,
                resolution: data.resolution,
                isNewMember: data.isNewMember,
                lastUpdateActivity: data.lastUpdateActivity,
                isFirstActivity: data.isFirstActivity,
                isDataFromDb: data.isDataFromDb,
                pointFocus: 0,
                pointGoodHabits: 0
            });
        }
    }catch(e){
        console.log('error in savedataProfile',e);
        func();
    }
}
const saveSpecificDataProfile = async (data,profile) =>{
    const db = firebase.firestore();
    try{
        db.collection('users').doc(data.id).update(profile);
    }catch(e){
        console.log('error in saveSpecificDataProfile',e);
    }
}

const dataProfileOnSnapshot = (data,func) =>{
    const db = firebase.firestore();
    db.collection('users').doc(data.id).onSnapshot((result)=>func(result));
}

const getDataProfile = async (data,func) =>{
    const db = firebase.firestore();
    try{ 
        db.collection("users").doc(data.id).get().then(doc =>{
            func(doc);
        })
    }catch(e){
        console.log('error in dataProfileOnSnapshot');
    }
}

const saveDailyActivity = async (data,func) =>{
    const db = firebase.firestore();
    try{
        const id = `${getTime.date()}-${getTime.month()}-${getTime.year()}[*divider*]${getTime.time()}`;

        await db.collection('users').doc(data.id).update({
            isNewMember: false,
            isFirstActivity: false,
            lastUpdateActivity: `${getTime.date()}-${getTime.month()}-${getTime.year()}`
        });

        await db.collection('users').
        doc(data.id).collection('dailyActivity').doc(id).set({
            time: new Date().getTime(),
            activity: JSON.stringify(data.activity),
            emoticon: data.emoticon
        });

    }catch(e){
        console.log('error in saveDailyActivity',e);
    }
}

const dailyActivityOnSnapshot =async (data,func) =>{
    const db = firebase.firestore();
    db.collection('users').doc(data.id).collection('dailyActivity').onSnapshot((result)=>func(result));
}

const saveGoodHabits = async (data,func) =>{
    const db = firebase.firestore();
    try{
        db.collection('users').doc(data.id).update({
            goodHabits: data.goodHabits
        })
    }catch(e){
        console.log('error in saveGoodHabits',e);
        func();
    }
}
const saveListHabits = async (data,func) =>{
    const db = firebase.firestore();
    try{
        db.collection('users').doc(data.id).update({
            listHabits: data.listHabits,
            lastSave: new Date().getTime()
        })
    }catch(e){
        console.log('error in saveListHabits',e);
        func();
    }
}
const saveListHabitsDaily = async (data,func) =>{
    const db = firebase.firestore();
    const id = `${getTime.date()}-${getTime.month()}-${getTime.year()}`;
    try{
        db.collection('users').doc(data.id).collection('listHabitsDaily').doc(id).set({
            listHabits: data.listHabits,
            finish: false
        })

    }catch(e){
        console.log('error in saveListHabitsDaily',e);
        func();
    }
}
const listHabitsDailyOnSnapshot = async (data,func) =>{
    const db = firebase.firestore();
    db.collection('users').doc(data.id).collection('listHabitsDaily').onSnapshot((result)=>func(result));
}
const saveListHabitsDailyFinish = async (data,func) =>{
    const db = firebase.firestore();
    const id = `${getTime.date()}-${getTime.month()}-${getTime.year()}`;
    try{
        db.collection('users').doc(data.id).collection('listHabitsDaily').doc(id).update({
            finish: true
        })

    }catch(e){
        console.log('error in saveListHabitsDailyFinish',e);
        func();
    }
}
const utilsUser = async (data,update,func)=>{
    const db = firebase.firestore();
    try{
        db.collection("users").doc(data.id).update(update);
    }catch(e){
        console.log('error in utilsUser');
        func()
    }
}
const getListHabitsToDay = async (data,func) =>{
    const db = firebase.firestore();
    const id = `${getTime.date()}-${getTime.month()}-${getTime.year()}`;
    try{
        db.collection('users').doc(data.id).
        collection('listHabitsDaily').doc(id).onSnapshot((result)=>func(result));
    }catch(e){
        console.log('error in getListHabitsToDay',e);
        func();
    }
}
const saveListHabitsToFinish = async (data) =>{
    const db = firebase.firestore();
    const dateToDay = `${getTime.date()}-${getTime.month()}-${getTime.year()}`;
    try{
        db.collection('users').doc(data.id).collection('listHabitsDaily').get().then((result)=>{
            result.forEach(async element =>{
                const id = element.id;
                if(id !== dateToDay){
                    await db.collection('users').doc(data.id).collection('listHabitsDaily').doc(id).update({
                        finish: true
                    });
                }
            });
        });
    }catch(e){
        console.log('error in saveListHabitsToFinish',e);
    }
}

const getAllUsersOnSnapshot = async (func)=>{
    const db = firebase.firestore();
    db.collection('users').onSnapshot((result)=>func(result));
    // db.collection("users").onSnapshot(result =>{
    //     result.forEach(el =>{
    //         el.id
    //     })
    // })
}

export {
    signIn,
    signUp,
    authStateChange,
    saveDataProfile,
    logout,
    saveDailyActivity,
    dataProfileOnSnapshot,
    getDataProfile,
    dailyActivityOnSnapshot,
    saveGoodHabits,
    saveListHabits,
    saveListHabitsDaily,
    listHabitsDailyOnSnapshot,
    saveListHabitsDailyFinish,
    utilsUser,
    getListHabitsToDay,
    saveListHabitsToFinish,
    saveSpecificDataProfile,
    getAllUsersOnSnapshot
}