import React from 'react';
import { Switch, Route, NavLink, browserHistory } from 'react-router-dom';
import { Redirect } from 'react-router'

// import Dashboard from './Dashboard';
import ForgotPassword from './ForgotPassword';
import RestorePassword from './RestorePassword';
import Chatbots from './Chatbots';
import Conversations from './Conversations';
import Login from "./Login";


const Main = () => {

    return (
        <main>
            <Switch>
                {/*<Redirect from='/' to='/chatbots'/>*/}
                <Route path='/' component={Chatbots}/>
                {/*<Route path='/:passRestored' component={Login}/>*/}
                <Route path='/forgot-password' component={ForgotPassword}/>
                <Route path='/restore-password' component={RestorePassword}/>
                {/*<Route path='/conversaciones' component={Conversations}/>*/}
            </Switch>
        </main>
    );
};

export default Main;
