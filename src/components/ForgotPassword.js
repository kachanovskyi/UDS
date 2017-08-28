import React from 'react';

import 'bootstrap/dist/css/bootstrap.css';
import {Col} from 'react-bootstrap';

import NotifyModal from './NofityModal';

import './Login.css';

const Restore = () => {

    const formSubmitted = (e) => {
        e.preventDefault();
        window.location.href = '/restore-password';
        return false;
    };

    return (
        <div className="Login">
            <div className="row table-cell">
                <Col xs={8} xsOffset={2} className="login-form">
                    <h2 className="title">Forgot your password?</h2>
                    <form onSubmit={formSubmitted}>
                        <input type="email" name="login" id="restorePass" placeholder="Your e-mail"
                               required/>
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
