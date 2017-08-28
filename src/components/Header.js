import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './Header.css';
import {NavLink, withRouter} from 'react-router-dom';

import $ from 'jquery'


const Header = (props) => {

    const removeActive = () => {
        $('nav li').removeClass('active');
    };

    const addActive = ({target}) => {

        if ($(target).parent().is('li')) {

            removeActive();
            $(target).parent().addClass('active');

        }

    };

    const logOut = () => {
        window.location.href = '/logout';
    };

    $(document).ready(function () {

        $('nav li > a').on('click', addActive);
        if (props.location.pathname !== "/") {

            removeActive();
            $('#' + props.location.pathname.slice(1)).addClass('active');

        }

    });

    return (
        <header>
            <nav className="navbar navbar-default navbar-fixed-top">
                <div className="container-fluid">
                    <div className="navbar-header">
                        <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#udsNav">
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                        </button>
                        <a className="navbar-brand">
                            <span>Logotype</span>
                        </a>
                    </div>
                    <div className="collapse navbar-collapse" id="udsNav">
                        <ul className="nav navbar-nav">
                            <li><NavLink exact to="/" className="menu-item-link">
                                <img src="images/square.svg"/>
                                <span>Chatbots</span>
                            </NavLink></li>
                        </ul>
                        <ul className="nav navbar-nav navbar-right">
                            <li><NavLink className="menu-item-link" to="/settings">
                                <img src="images/square.svg"/>
                                <span>Settings</span>
                            </NavLink></li>
                            <li><NavLink className="menu-item-link" to="/logout">
                                <img src="images/square.svg"/>
                                <span>Log out</span>
                            </NavLink></li>
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    );

};

export default withRouter(Header);
