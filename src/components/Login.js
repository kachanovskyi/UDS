import React from 'react';

import 'bootstrap/dist/css/bootstrap.css';
import './Login.css';

import {Col} from 'react-bootstrap';
import {notifyModalShow} from '../externalFunctions';
import {hidePass, displayPass} from '../externalFunctions'

import NotifyModal from './NofityModal';
import $ from 'jquery';


const Login = ({logIn}) => {

    const login = (e) => {
        e.preventDefault();
        const login = $('#inputLogin').val();
        const pass = $('#inputPass').val();
        if ((login.length || login.trim()) && (pass.length || pass.trim())) {
            console.log('logging...');
            let data = {
                login,
                pass
            };
            fetch('./data.json', data)
                .then((response) => response.json())
                .then((responseJson) => {

                    // logIn(responseJson.userId, responseJson.username);
                    if ((responseJson.username === data.login) && (responseJson.pass === data.pass)) {
                        logIn(responseJson.username, responseJson.pass, true)
                    } else {
                        const errorMessage = "The details you entered did not match our records. Please double-check and try again.";
                        notifyModalShow(errorMessage);
                    }

                })
                .catch((error) => {
                    console.error(error);
                });
        }

        return false;
    };

    $('#inputLogin, #inputPass').keypress(function (e) {
        if (e.which === 13) {
            login();
        }
    });

    return (
        <div className="Login">
            <div className="row table-cell">
                <Col xs={8} xsOffset={2} md={6} mdOffset={3} lg={4} lgOffset={4} className="login-form">
                    <h2 className="title">Welcome to UDS</h2>
                    <form onSubmit={login}>
                        <input type="email" name="login" id="inputLogin" placeholder="Your e-mail"
                               required/>
                        <div className="password-container">
                            <input type="password" name="password" id="inputPass" placeholder="Password" required/>
                            <img src="images/eye-icon.svg" onMouseDown={displayPass} onMouseUp={hidePass}
                                 onMouseOut={hidePass}/>
                        </div>
                        <a href="/forgot-password" className="restore-btn">Forgot password?</a>
                        <button type="submit" className="login-btn">Log in</button>
                    </form>
                </Col>
                <p className="text-center copyright">© Copyright 2017 Unique Digital Ltd</p>
            </div>
            <NotifyModal/>
        </div>
    );

};

export default Login;
