import React, {Component} from 'react';
import './Users.css';

import $ from 'jquery'

class Users extends Component {

    constructor() {
        super();
        this.state = {
            users: []
        };

        this.toggleUserActivation = this.toggleUserActivation.bind(this);
    };

    loadData() {
        fetch('./users.json')
            .then((response) => response.json())
            .then((responseJson) => {

                this.setState({users: responseJson});

            })
            .catch((error) => {
                console.error(error);
            });
    }

    toggleUserActivation({target}) {

        const $target = $(target);

        const data = {
            chatId: $target.parent().parent().find('.chat-id').text()
        };

        if( $(target).hasClass('inactive') ) {
            data.status = 'active';
        } else if( $(target).hasClass('active') ) {
            data.status = 'inactive';
        }

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        fetch('./data.json', {
            method: 'POST',
            headers: myHeaders,
            credentials: 'same-origin',
            body: JSON.stringify(data)
        })
            .then((response) => response.json())
            .then((responseJson) => {



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
            <div className="Users">
                <table>
                    <tbody>
                    <tr>
                        <th>Chat Id</th>
                        <th>Username</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Access</th>
                    </tr>
                    {this.state.users.map((user, index) => (
                        <tr key={index} data-key={index}>
                            <td className="chat-id">{user.chatId}</td>
                            <td className="username">{user.username}</td>
                            <td className="first-name">{user.firstName}</td>
                            <td className="last-name">{user.lastName}</td>
                            <td>
                                <a className={"admin-btn " + user.status} onClick={this.toggleUserActivation}>
                                    { user.status === "active" ? "Dismiss" : "Accept"}
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
