import React, {Component} from 'react';
import { Redirect } from 'react-router'
import { withRouter } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.css';
import {Col} from 'react-bootstrap';

import Header from '../components/Header';
import Main from '../components/Main';
import Login from '../components/Login';
import ForgotPassword from '../components/ForgotPassword';
import RestorePassword from '../components/RestorePassword';

import './App.css';

class App extends Component {

    constructor() {
        super();
        this.state = {
            userId: sessionStorage.getItem("toyotaCRadminID"),
            username: ""
        };
        this.logIn = this.logIn.bind(this);
    };

    logIn(userId, username) {
        sessionStorage.setItem("toyotaCRadminID", userId);

        this.setState({
            userId,
            username
        })
    };

    loadData() {
        fetch('./data.json')
            .then((response) => response.json())
            .then((responseJson) => {

                this.setState({
                    userId: responseJson.userId,
                    username: responseJson.username,
                    logged: responseJson.logged
                });
            })
            .catch((error) => {
                console.error(error);
            });
    };

    componentDidMount() {
        this.loadData();
    }

    render() {

        let inner = null;

        if(this.props.location.pathname === "/forgot-password") {
            inner = <ForgotPassword/>
        } else if(this.props.location.pathname === "/restore-password") {
            inner = <RestorePassword/>
        } else if(!this.state.logged) {
            inner =  <div><Redirect to="/"/><Login logIn={this.logIn}/></div>;
        } else if(this.state.logged) {
            inner = <div><Header username={this.state.username}/><Main/></div>;
        }

        return (
            <div className="container-fluid">
                <div className="row">
                    <Col xs={12}>
                        {inner}
                    </Col>
                </div>
            </div>
        )
        // else if(this.state.userId) {
        //     return (
        //         <div className="container-fluid">
        //             <div className="row">
        //                 <Col xs={12} md={10} mdOffset={1} lg={8} lgOffset={2}>
        //                     <Header username={this.state.username}/>
        //                     <Main/>
        //                 </Col>
        //             </div>
        //         </div>
        //     );
        // }
        //
        // return (
        //     <div className="container-fluid">
        //         <div className="row">
        //             <Col xs={12} md={10} mdOffset={1} lg={8} lgOffset={2}>
        //                 <div className="wrapper">
        //                     <div className="circle circle-1"></div>
        //                     <div className="circle circle-1a"></div>
        //                     <div className="circle circle-2"></div>
        //                     <div className="circle circle-3"></div>
        //                 </div>
        //                 <h1 className="text-center">Loading&hellip;</h1>
        //             </Col>
        //         </div>
        //     </div>
        // );

    }
}

export default withRouter(App);
