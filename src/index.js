import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './style/style.css';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

import {createGlobalStyle} from 'styled-components';

const GlobalStyle = createGlobalStyle`
    *{
      padding: 0;
      margin: 0; 
      box-sizing: border-box;
    }

    html{
        font-size: 62.5% !important;
        font-family: 'Montserrat', sans-serif;

        @media(max-width: 600px){
          font-size: 50% !important; 
        }
    }
    body {
        overflow-x: hidden;
        @media(max-width: 900px){
          overflow-x: hidden;
          overflow-y: auto;
        }
    }

`

ReactDOM.render(
  <React.Fragment>
    <GlobalStyle />
    <App />
  </React.Fragment>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();

