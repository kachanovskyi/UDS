import React from 'react';
import {Link} from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.css';
import {Col} from 'react-bootstrap';

import NotifyModal from './NofityModal';

import {hidePass, displayPass, notifyModalShow} from '../externalFunctions'

import './Login.css';

import $ from 'jquery';

const Restore = () => {

    const checkPass = (e) => {
        e.preventDefault();

        const newPass = document.getElementById('newPass').value,
            confirmPass = document.getElementById('confirmPass').value;

        if(newPass === confirmPass) {
            const data = {
                password: newPass
            };

            fetch('./data.json', {
                method: 'POST',
                body: data
            })
                .then((response) => response.json())
                .then((responseJson) => {
                    window.location.href = "/";
                })
                .catch((error) => {
                    console.error(error);
                });
        } else {
            const errorMessage = "Passwords don't match. Please, type correct passwords.";
            notifyModalShow(errorMessage);
        }

        return false;
    };

    return (
        <div className="Login">
            <div className="row table-cell">
                <Col xs={8} xsOffset={2} className="login-form">
                    <h2 className="title">New password</h2>
                    <form onSubmit={checkPass}>
                        <div className="password-container">
                            <input type="password" name="newPass" id="newPass" placeholder="Password" required/>
                            <img src="images/eye-icon.svg" onMouseDown={displayPass} onMouseUp={hidePass}
                                 onMouseOut={hidePass}/>
                        </div>
                        <div className="password-container">
                            <input type="password" name="confirmPass" id="confirmPass" placeholder="Confirm password"
                                   required/>
                            <img src="images/eye-icon.svg" onMouseDown={displayPass} onMouseUp={hidePass}
                                 onMouseOut={hidePass}/>
                        </div>
                        <a href="/" className="restore-btn">&lt; Back to log in</a>
                        <button type="submit" className="login-btn">Submit</button>
                    </form>
                </Col>
                <p className="text-center copyright">© Copyright 2017 Unique Digital Ltd</p>
            </div>
            <NotifyModal/>
        </div>
    );

};

export default Restore;
