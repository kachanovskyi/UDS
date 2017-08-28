import React, { Component } from 'react';

import 'bootstrap/dist/css/bootstrap.css';
import { Col } from 'react-bootstrap';

import './Conversations.css';

class Conversations extends Component {
    constructor() {

        super();
        this.state = {
            phrases: [],
            blocks: [],
            buttons: []
        };

    };

    loadData() {
        fetch('./popular.json')
            .then((response) => response.json())
            .then((responseJson) => {

                this.setState({
                    phrases: responseJson.phrases,
                    blocks: responseJson.blocks,
                    buttons: responseJson.buttons
                });

            })
            .catch((error) => {
                console.error(error);
            });
    }

    componentDidMount() {
        this.loadData();
    }

    render() {
        return (
            <div className="Conversations">
                <div className="row">
                    <Col xs={12} md={6} className="popular-block">
                        <h3 className="margin-bottom-10">Popular phrases</h3>
                        {this.state.phrases.map((phrase, index) => (
                            <p key={index}>{phrase.content} <span className="counter">{phrase.counter} times</span></p>
                        ))}
                    </Col>
                    <Col xs={12} md={6} className="popular-block">
                        <h3 className="margin-bottom-10">Popular buttons</h3>
                        {this.state.buttons.map((button, index) => (
                            <p key={index}>{button.content} <span className="counter">{button.counter} times</span></p>
                        ))}
                    </Col>
                </div>
            </div>
        );
    }

}

export default Conversations;
