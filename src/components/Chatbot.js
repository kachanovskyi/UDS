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
        this.rename = this.rename.bind(this);
        this.saveName = this.saveName.bind(this);
        this.cancelRename = this.cancelRename.bind(this);
        this.cancelRenameAll = this.cancelRenameAll.bind(this);
        this.deleteBot = this.deleteBot.bind(this);
    };


    duplicate(botId) {
        this.cancelRenameAll();

        const $bot = $($('.chatbot')[botId + 1]);
        const duplicated = {
            img: $bot.find('.bot-img img').attr('src'),
            name: $bot.find('.bot-name').text(),
            nickname: $bot.find('.bot-nickname').text(),
        };

        this.props.sendBotData(duplicated);
    }


    rename(botId) {
        this.cancelRenameAll();

        const $bot = $($('.chatbot')[botId + 1]);
        const name = $bot.find('.bot-name').text();
        const self = this;

        $bot.find('.bot-info').addClass('hidden');
        $bot.find('.rename-bot')
            .val(name)
            .keydown(function(e) {
                if(e.which === 27) {
                    self.cancelRename($bot);
                }
            })
            .removeClass('hidden')
            .focus();
        $bot.find('.save-btn').removeClass('hidden');
    }


    cancelRename($bot) {
        $bot.find('.rename-bot').addClass('hidden');
        $bot.find('.save-btn').addClass('hidden');
        $bot.find('.bot-info').removeClass('hidden');
    }


    cancelRenameAll() {
        const self = this;

        $('.chatbot').each(function () {
            self.cancelRename($(this));
        });
    }


    saveName() {
        const $bot = $($('.chatbot')[this.props.id + 1]);
        const newName = $bot.find('.rename-bot').val();
        $bot.find('.bot-name').text(newName);

        this.cancelRename($bot);
    }

    deleteBot() {
        $($('.chatbot')[this.props.id + 1]).remove();
        this.props.removeBot(this.props.id);
    }


    render() {
        if (this.props.type === "add-new") {
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
                    <input type="text" name="rename-bot" className="rename-bot hidden"/>
                    <span className="settings-btn">
                                    <CustomDropdown botId={this.props.id} duplicate={this.duplicate} rename={this.rename} deleteBot={this.deleteBot}/>
                            </span>
                    <a className="save-btn hidden" onClick={this.saveName}>Save</a>
                </div>
            </div>
        )
    }

}

export default Chatbot;
