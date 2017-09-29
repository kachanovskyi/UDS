import React, {Component} from 'react';

import 'bootstrap/dist/css/bootstrap.css';
import './Chatbot.css';

import {getRandomColor, getTextColor, ifStringEmpty} from '../externalFunctions';
import {notifyModalShow} from '../externalFunctions';
import NotifyModal from './NofityModal';
import CustomDropdown from './CustomDropdown';
import NavButton from './NavButton';
import $ from 'jquery';

class Chatbot extends Component {

    constructor() {
        super();
        this.state = {
            chatbots: []
        };

        this.duplicate = this.duplicate.bind(this);
        this.rename = this.rename.bind(this);
        this.saveName = this.saveName.bind(this);
        this.cancelRename = this.cancelRename.bind(this);
        this.cancelRenameAll = this.cancelRenameAll.bind(this);
    };

    duplicate() {
        this.cancelRenameAll();

        const duplicated = {
            botId: this.props.id
        };

        this.props.sendBotData(duplicated);
    }


    rename() {
        this.cancelRenameAll();

        const $bot = $($('.chatbot')[this.props.index + 1]);
        const name = $bot.find('.bot-name').text();
        const self = this;

        $bot.find('.bot-info').addClass('hidden');
        $bot.find('.rename-bot')
            .val(name)
            .keydown(function (e) {
                if (e.which === 27) {
                    self.cancelRename($bot);
                }
            })
            .removeClass('hidden')
            .focus();
        $bot.find('.save-btn, .cancel-btn').removeClass('hidden');
    }


    cancelRename($bot) {
        $bot.find('.rename-bot').addClass('hidden');
        $bot.find('.save-btn, .cancel-btn').addClass('hidden');
        $bot.find('.bot-info').removeClass('hidden');
    }


    cancelRenameAll() {
        const self = this;

        $('.chatbot').each(function () {
            self.cancelRename($(this));
        });
    }


    saveName() {
        const $bot = $($('.chatbot')[this.props.index + 1]);
        const newName = $bot.find('.rename-bot').val();

        if(ifStringEmpty(newName)) {
            notifyModalShow("You should give chatbot a name");
        } else {

            const data = {
                botId: this.props.id,
                name: newName
            };

            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            fetch('https://udigital.botscrew.com/rename', {
                    method: 'POST',
                    headers: myHeaders,
                    credentials: 'same-origin',
                    body: JSON.stringify(data)
                }
            )
                .then((response) => response.json())
                .then((responseJson) => {

                    $bot.find('.bot-name').text(newName);

                    let chatbots = [];

                    responseJson.forEach(item => {
                        chatbots.push(item);
                    });

                    this.setState({
                        chatbots: chatbots
                    });

                })
                .catch((error) => {
                    console.error(error);
                });

            this.cancelRename($bot);

        }
    }

    render() {

        if (this.props.type === "add-new") {
            return (
                <div className="chatbot add-new">
                    <NavButton className="bot-connect" text="+ Create new bot" goTo={'/create-bot'}/>
                </div>
            )
        }

        const connectBot = <NavButton className="bot-connect" text="Connect to telegram"
                                      goTo={'/connect-bot/' + this.props.id} img="images/link-icon.svg"/>;
        const nickname = <a className="bot-connect text-underlined">{this.props.nickname}</a>;


        return (
            <div className="chatbot">
                <div className="inner">
                    <div className="bot-img" style={{backgroundColor: this.props.color, color: getTextColor(this.props.color)}}>
                        {this.props.name[0]}
                    </div>
                    <div className="bot-info">
                        <div>
                            <NavButton className="bot-name" text={this.props.name}
                                       goTo={`/flow-designer/${this.props.id}/${this.props.name}/${this.props.nickname}`}/>
                        </div>
                        {this.props.telegramToken ? nickname : connectBot}
                    </div>
                    <input type="text" name="rename-bot" className="rename-bot hidden"/>
                    <span className="settings-btn">
                                    <CustomDropdown botId={this.props.id} index={this.props.index}
                                                    duplicate={this.duplicate}
                                                    rename={this.rename} deleteBot={this.props.removeBot}/>
                            </span>
                    <a className="cancel-btn hidden" onClick={this.cancelRenameAll}>Cancel</a>
                    <a className="save-btn hidden" onClick={this.saveName}>Save</a>
                </div>
                <NotifyModal/>
            </div>
        )
    }

}

export default Chatbot;
