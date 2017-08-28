import React, {Component} from 'react';
import './Users.css';

import $ from 'jquery'

class Users extends Component {

    constructor() {
        super();
        this.state = {
            users: []
        };

        this.toggleBotActivation = this.toggleBotActivation.bind(this);
        this.toggleBotActivation = this.toggleBotActivation.bind(this);
    };

    loadData() {
        fetch('./chatbots.json')
            .then((response) => response.json())
            .then((responseJson) => {

                this.setState({users: responseJson});

            })
            .catch((error) => {
                console.error(error);
            });
    }

    toggleBotActivation({target}) {

        const parentBlock = $(target).parent().parent();
        let botStatus = parentBlock.find('.bot-status')[0].innerHTML === "active" ? "inactive" : "active";

        parentBlock.find('.bot-status').innerHTML = botStatus;
        const index = parentBlock.data('key');

        if(botStatus === "active") {
            botStatus = "inactive";
            parentBlock.find('.bot-status')[0].innerHTML = "active";
            target.className="admin-btn active";
            target.innerText = "Deactivate";
        } else {
            botStatus = "active";
            parentBlock.find('.bot-status')[0].innerHTML = "inactive";
            target.className="admin-btn inactive";
            target.innerText = "Activate";
        }

        const data = {
            name: parentBlock.find('.username')[0].innerHTML,
            email: parentBlock.find('.user-email')[0].innerHTML,
            status: parentBlock.find('.bot-status')[0].innerHTML
        };

        fetch('./data.json', data)
            .then((response) => response.json())
            .then((responseJson) => {

                console.log(data);

            })
            .catch((error) => {
                console.error(error);
            });

        // console.log($(target).parent().parent().find('.user-email')[0].innerHTML);
    }

    componentDidMount() {
        this.loadData();
    }

    render() {
        return (
            <div className="Users">
                <div className="text-right excel-btn-container">
                    <a className="admin-btn">Exportar Excel</a>
                </div>
                <table>
                    <tbody>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Created At</th>
                        <th>Status</th>
                        <th>Bot activation</th>
                    </tr>
                    {this.state.users.map((user, index) => (
                        <tr key={index} data-key={index}>
                            <td className="username">{user.name}</td>
                            <td className="user-email">{user.email}</td>
                            <td>{user.created}</td>
                            <td className="bot-status">{user.status}</td>
                            <td>

                                <a className={"admin-btn " + user.bot} onClick={this.toggleBotActivation}>
                                    { user.bot === "active" ? "Deactivate" : "Activate"}
                                </a>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        );

    }
}

export default Users;
