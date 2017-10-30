import React from 'react';
import { Switch, Route} from 'react-router-dom';

import ForgotPassword from './ForgotPassword';
import RestorePassword from './RestorePassword';
import Chatbots from './Chatbots';
import ConnectBot from './ConnectBot';
import FlowDesigner from "./FlowDesigner";
import Users from "./Users";

const Main = () => {

    return (
        <main>
            <Switch>
                <Route exact path='/' component={Chatbots}/>
                <Route path='/users' component={Users}/>
                <Route path='/forgot-password' component={ForgotPassword}/>
                <Route path='/restore-password' component={RestorePassword}/>
                <Route path='/create-bot' component={ConnectBot}/>
                <Route path='/connect-bot/:botId' component={ConnectBot}/>
                <Route path='/flow-designer/:botId/:botName/:botNickname' component={FlowDesigner}/>
            </Switch>
        </main>
    );
};

export default Main;
