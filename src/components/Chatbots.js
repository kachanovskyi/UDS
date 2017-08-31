import React, {Component} from 'react';

import 'bootstrap/dist/css/bootstrap.css';
import './Chatbots.css';

import {Col} from 'react-bootstrap';
import $ from 'jquery';
import Chatbot from './Chatbot';

class Chatbots extends Component {

    constructor() {
        super();
        this.state = {
            chatbots: []
        };

        // this.toggleBotActivation = this.toggleBotActivation.bind(this);
        this.getBotData = this.getBotData.bind(this);
        this.removeBot = this.removeBot.bind(this);
    };

    getBotData(data) {
        fetch('./chatbots.json', {
                method: 'POST',
                body: data
            }
        )
            .then((response) => response.json())
            .then((responseJson) => {

                let chatbots = [];

                responseJson.forEach(item => {
                    chatbots.push(item);
                });

                this.setState({
                    chatbots
                });

            })
            .catch((error) => {
                console.error(error);
            });
    }

    removeBot(id) {

        const data = {
            botId: id
        };

        fetch('./chatbots.json', {
            method: 'POST',
            body: data
        }
        )
            .then((response) => response.json())
            .then((responseJson) => {

                let chatbots = [];

                responseJson.forEach(item => {
                    chatbots.push(item);
                });

                this.setState({
                    chatbots
                });

            })
            .catch((error) => {
                console.error(error);
            });
    }

    componentDidMount() {
        this.loadData();
    }

    loadData() {
        fetch('./chatbots.json')
            .then((response) => response.json())
            .then((responseJson) => {

                let chatbots = [];

                responseJson.forEach(item => {
                    chatbots.push(item);
                });

                this.setState({
                    chatbots
                });

            })
            .catch((error) => {
                console.error(error);
            });
    }

    render() {
        return (
            <Col xs={12}>
                <div className="Chatbots">
                    <Col md={4} lg={3}>
                        <Chatbot type="add-new"/>
                    </Col>
                    {this.state.chatbots.map((chatbot, index) => (
                        <Col md={4} lg={3} key={index}>
                            <Chatbot img={chatbot.img} name={chatbot.name} telegramToken={chatbot.telegramToken}
                                     id={chatbot.id} nickname={chatbot.nickname} index={index}
                                     sendBotData={this.getBotData} removeBot={this.removeBot}/>
                        </Col>
                    ))}
                </div>
            </Col>
        );
    }

}

export default Chatbots;
