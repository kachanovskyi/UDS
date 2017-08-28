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
    };

    getBotData(chatbotData) {
        let chatbotsTemp = [];

        chatbotsTemp.push(...this.state.chatbots);
        chatbotsTemp.push(chatbotData);

        this.setState({
            chatbots: chatbotsTemp
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
                            <Chatbot img={chatbot.img} name={chatbot.name} nickname={chatbot.nickname} id={index} sendBotData={this.getBotData}/>
                        </Col>
                    ))}
                </div>
            </Col>
        );
    }

}

export default Chatbots;
