import React from 'react';

import 'bootstrap/dist/css/bootstrap.css';
import {Col} from 'react-bootstrap';
import {notifyModalShow} from '../externalFunctions';

import NotifyModal from './NofityModal';
import $ from 'jquery';

import './Login.css';

const Restore = () => {

    const formSubmitted = (e) => {
        e.preventDefault();
        // window.location.href = '/restore-password';
        const data = {
            "email": $('#restorePass').val()
        };
        let notification = "Email you've entered is not registered. Please, enter another email.";

        console.log(data);

        	var myHeaders = new Headers();
			myHeaders.append("Content-Type", "application/json");
			fetch('https://udigital.botscrew.com/restore-password', {
            method: 'POST',
			headers: myHeaders,
				credentials: 'same-origin',
            body: JSON.stringify(data)
        })
           .then((response) => response.json())
            .then((responseJson) => {

                if ((responseJson.logged === true)) {
                          const Message = "Link for password restoration was sent to your email.";
						notifyModalShow(Message);
                    } else {
                        const errorMessage = "Link for password restoration was sent to your email.";
                        notifyModalShow(errorMessage);
                    }

            })
            .catch((error) => {
                console.error(error);
                notifyModalShow(notification);
            });
        return false;
    };

    return (
        <div className="Login">
            <div className="row table-cell">
                <Col xs={8} xsOffset={2} md={6} mdOffset={3} lg={4} lgOffset={4} className="login-form">
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
