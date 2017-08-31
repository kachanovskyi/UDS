import React from 'react';
import { Switch, Route} from 'react-router-dom';
import { Redirect } from 'react-router'

// import Dashboard from './Dashboard';
import ForgotPassword from './ForgotPassword';
import RestorePassword from './RestorePassword';
import Chatbots from './Chatbots';
import ConnectBot from './ConnectBot';

const Main = () => {

    return (
        <main>
            <Switch>
                {/*<Redirect from='/' to='/chatbots'/>*/}
                <Route exact path='/' component={Chatbots}/>
                <Route path='/settings' component={ConnectBot}/>
                {/*<Route path='/:passRestored' component={Login}/>*/}
                <Route path='/forgot-password' component={ForgotPassword}/>
                <Route path='/restore-password' component={RestorePassword}/>
                {/*<Route path='/connect' component={Header}/>*/}
                <Route path='/connect-bot/:botId' component={ConnectBot}/>
            </Switch>
        </main>
    );
};

export default Main;
