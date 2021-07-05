
import React from 'react';
import Styled from 'styled-components';
import {BrowserRouter as Router,Route,Switch,Redirect} from 'react-router-dom';

//context
import {UserProvider} from './context/userContext';
import {DataProvider} from './context/dataContext';
import {AppProvider} from './context/appContext';

// pages
import HomePage from './page/Home/Index';

const App = props => {
  return (
    <UserProvider>
      <DataProvider>
        <AppProvider>
          <Router>
            <Switch>
              <Route path="/" exact>
                  <HomePage />
              </Route>
            </Switch>
          </Router>
        </AppProvider>
      </DataProvider>
    </UserProvider>
  )
}

export default App;