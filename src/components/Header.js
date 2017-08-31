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

        removeActive();

        const $target = $(target);
        $target.closest('.menu-item').addClass('active');

        console.log($.contains($('.menu-item'), $target));

        // if($('.menu-item').contains($target)) {
        //     console.log($('.menu-item'));
        // }

        // if ($(target).parent().is('li')) {
        //
        //     removeActive();
        //     $(target).parent().addClass('active');
        //
        // }

    };

    const logOut = () => {
        window.location.href = '/logout';
    };

    // $(document).ready(function () {
    //
    //     $('nav li > a').on('click', addActive);
    //     if ( (props.location.pathname !== "/") && (!props.location.pathname.includes('connect-bot')) ) {
    //
    //         removeActive();
    //         $('#' + props.location.pathname.slice(1)).addClass('active');
    //
    //     } else {
    //
    //         removeActive();
    //         $('#chatbots').addClass('active');
    //
    //     }
    //
    // });

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
                            <li className="active menu-item" onClick={addActive}><NavLink exact to="/" className="menu-item-link" id="chatbots">
                                <img src="images/square.svg"/>
                                <span>Chatbots</span>
                            </NavLink></li>
                        </ul>
                        <ul className="nav navbar-nav navbar-right">
                            <li className="menu-item" onClick={addActive}><NavLink className="menu-item-link" to="/settings" id="settings">
                                <img src="images/square.svg"/>
                                <span>Settings</span>
                            </NavLink></li>
                            <li className="menu-item" onClick={addActive}><NavLink className="menu-item-link" to="/logout" id="logout">
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
