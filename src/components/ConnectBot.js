import React, {Component} from 'react';

import 'bootstrap/dist/css/bootstrap.css';
import {Col} from 'react-bootstrap';
import {notifyModalShow, getRandomColor} from '../externalFunctions';
import {NavLink, withRouter} from 'react-router-dom';

import NotifyModal from './NofityModal';
import $ from 'jquery';

import './ConnectBot.css';

class ConnectBot extends Component {

    constructor() {
        super();
        this.state = {
            heading: "Connect to Telegram",
            link: "connect-bot/send",
            action: "connect"
        };
        this.formSubmitted = this.formSubmitted.bind(this);
    }

    componentDidMount() {
        if( this.props.location.pathname.includes("create-bot") ) {
            this.setState({
                heading: "Create chatbot",
                link: "create",
                action: "create"
            });
        }
    };

    formSubmitted(e) {
        e.preventDefault();

        const data = {
            token: $('#token').val()
        };

        if(this.state.action === "connect") {
            data.botId = this.props.match.params.botId;
        }

        if(this.state.action === "create") {
            data.color = getRandomColor();
        }

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        fetch('https://udigital.botscrew.com/' + this.state.link, {
                method: 'POST',
                headers: myHeaders,
                credentials: 'same-origin',
                body: JSON.stringify(data)
            }
        )
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.code==="500") {
                    const errorMessage = "Bot with such Token already exists. Please, enter another Token. ";
                    notifyModalShow(errorMessage);
                } 
				if (responseJson.code==="400") {
                    const errorMessage = "This Token is invalid . Please, enter another Token. ";
                    notifyModalShow(errorMessage);
                }
                if (responseJson.code==="200") {
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
                        <h2 className="title">{this.state.heading}</h2>
                        <p>Follow the instruction below to set up new chatbot</p>
                        <p>
                            Open <a className="bot-connect" href="https://telegram.me/botfather" target="_blank">@Botfather</a>
                            in Telegram app, then enter <span
                            className="command">/newbot</span> and choose a name for your bot.
                        </p>
                        <p>You’ll get a token — just copy-paste it into the input below</p>
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

export default withRouter(ConnectBot);
