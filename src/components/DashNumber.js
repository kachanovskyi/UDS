import React from 'react';

import './DashNumber.css';

const DashNumber = ({title, amount}) => {

    return (
        <div className="DashNumber">
            <h2 className="font_2">{title}</h2>
            <div className="number">
                <span>{amount}</span>
            </div>
        </div>
    );

};

export default DashNumber;
