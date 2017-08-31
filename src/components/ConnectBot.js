import React, {Component} from 'react';

import 'bootstrap/dist/css/bootstrap.css';
import {Col} from 'react-bootstrap';
import {notifyModalShow} from '../externalFunctions';
import {NavLink} from 'react-router-dom';

import NotifyModal from './NofityModal';
import $ from 'jquery';

import './ConnectBot.css';

class ConnectBot extends Component {

    constructor() {
        super();
        this.formSubmitted = this.formSubmitted.bind(this);
    }

    formSubmitted(e) {
        e.preventDefault();
        const data = {
            botId: this.props.match.params.botId,
            token: $('#token').val()
        };
        fetch('./data.json', {
            method: 'POST',
            body: data
        })
            .then((response) => response.json())
            .then((responseJson) => {
                if(!responseJson.status) {
                    const errorMessage = "Token is invalid. Please, enter another token.";
                    notifyModalShow(errorMessage);
                }
                if(responseJson) {
                    window.location.href = '/';
                }
            })
            .catch((error) => {
                console.error(error);
            });
        return false;
    };

    render() {
        return (
            <div className="Connect">
                <div className="row">
                    <Col xs={8} xsOffset={2} md={6} mdOffset={3} lg={4} lgOffset={4} className="login-form">
                        <h2 className="title">Connect to Telegram</h2>
                        <p>Follow the instruction below to set up new chatbot</p>
                        <p>
                            Open <a className="bot-connect" href="https://telegram.me/botfather" target="_blank">@Botfather</a> in Telegram app, then enter <span
                            className="command">/newbot</span> and choose a name for your bot.
                        </p>
                        <p>You’ll get a token  — just copy-paste it into the input below</p>
                        <form onSubmit={this.formSubmitted}>
                            <input type="text" name="token" id="token" placeholder="Token"
                                   required/>
                            <button type="submit" className="login-btn">Submit</button>
                            <NavLink to="/" className="restore-btn">&lt; Go Back</NavLink>
                        </form>
                    </Col>
                </div>
                <NotifyModal/>
            </div>
        );
    }

}

export default ConnectBot;
