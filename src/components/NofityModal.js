import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './NotifyModal.css';

import $ from 'jquery'


const NotifyModal = ({undo}) => {

    const modalClose = () => {
        $('#notifyModal')
            .animate({
                "opacity": 0
            }, 333, () => {
                $(this).addClass('hidden');
            })

    };

    const undoChanges = () => {
        undo();
        modalClose();
    };

    return (
        <div id="notifyModal" className="hidden">
            <span className="close-icon" onClick={modalClose}>&#10005;</span>
            <span className="undo-btn" onClick={undoChanges}>Undo</span>
            <p className="message-text">
            </p>
        </div>
    );

};

export default NotifyModal;
