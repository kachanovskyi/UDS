import React, {Component} from 'react';
import {ButtonToolbar, Dropdown, MenuItem} from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.css';
import './CustomDropdown.css';

const CustomDropdown = ({botId, duplicate, rename}) => {

    return (
        <ButtonToolbar>
            <Dropdown id="settingsDropdown" pullRight>
                <Dropdown.Toggle>
                    <img className="settings-icon" src="images/settings.svg"/>
                </Dropdown.Toggle>
                <Dropdown.Menu className="super-colors">
                    <MenuItem eventKey="1" onClick={() => {duplicate(botId)}}>Duplicate</MenuItem>
                    <MenuItem eventKey="2" onClick={() => {rename(botId)}}>Rename</MenuItem>
                    <MenuItem eventKey="3">Delete</MenuItem>
                </Dropdown.Menu>
            </Dropdown>
        </ButtonToolbar>
    )
};

export default CustomDropdown;