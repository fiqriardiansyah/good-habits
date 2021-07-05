import firebase from 'firebase';

var firebaseConfig = {
    apiKey: "AIzaSyB5Ol5qaQiBPteFZXTEfOTFatLrs6sf6H0",
    authDomain: "good-habits-b76cd.firebaseapp.com",
    projectId: "good-habits-b76cd",
    storageBucket: "good-habits-b76cd.appspot.com",
    messagingSenderId: "111608207808",
    appId: "1:111608207808:web:cd4f8c3f421efe8b5c5025",
    measurementId: "G-BTZTMJ7FK3"
};
firebase.initializeApp(firebaseConfig);
firebase.analytics();


export default firebase;

