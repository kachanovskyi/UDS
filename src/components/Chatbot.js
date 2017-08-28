import React, {Component} from 'react';

import 'bootstrap/dist/css/bootstrap.css';
import './Chatbot.css';

import CustomDropdown from './CustomDropdown';
import $ from 'jquery';

class Chatbot extends Component {

    constructor() {
        super();
        this.state = {
            chatbots: []
        };

        this.duplicate = this.duplicate.bind(this);
    };

    duplicate(botId) {
        const duplicated = {
            img: $($('.chatbot')[botId + 1]).find('.bot-img img').attr('src'),
            name: $($('.chatbot')[botId + 1]).find('.bot-name').text(),
            nickname: $($('.chatbot')[botId + 1]).find('.bot-nickname').text(),
        };
        this.props.sendBotData(duplicated)
    }

    render() {
        if (this.props.type === "add-new") {
            console.log('add-new');
            return (
                <div className="chatbot add-new">
                    <div className="inner">
                        <p>+ Create new bot</p>
                    </div>
                </div>
            )
        }

        return (
            <div className="chatbot">
                <div className="inner">
                    <div className="bot-img">
                        <img src={this.props.img}/>
                    </div>
                    <div className="bot-info">
                        <p className="bot-name">{this.props.name}</p>
                        <a className="bot-nickname" href="#">{this.props.nickname}
                            <img src="images/link-icon.svg"/>
                        </a>
                    </div>
                    <span className="settings-btn">
                                    <CustomDropdown botId={this.props.id} duplicate={this.duplicate}/>
                            </span>
                </div>
            </div>
        )
    }

}

export default Chatbot;
