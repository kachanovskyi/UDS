import $ from 'jquery';

export const notifyModalShow = (message, type) => {
    const notifyModal = $('#notifyModal');
    let timeout = 1000;

    if(type === "undo") {
        notifyModal.addClass('undo');
        timeout = 200000;
    }

    let notifyModalTimeout;

    if ( notifyModal && (notifyModal !== undefined) ) {

        if(!notifyModal.is('hidden')) {
            notifyModal.addClass('hidden')
        }
        window.clearTimeout(notifyModalTimeout);
    }

    notifyModal.removeClass('hidden');
    notifyModal.find('.message-text').text(message);
    notifyModal.animate({
            "opacity": 1
        }, 333);

    notifyModalTimeout = window.setTimeout(function () {
        notifyModal.animate({
            "opacity": 0
        }, 333, () => {
            $(this).addClass('hidden');
        });
    }, timeout);
};

export const displayPass = ({target}) => {
    // document.getElementById('inputPass').setAttribute('type', 'text');
    const input = $(target).parent().find('input[type=password]');
    input.attr('type', 'text');
    $(target).attr('src', 'images/eye-icon-show.svg');
};

export const hidePass = ({target}) => {
    const input = $(target).parent().find('input[type=text]');
    input.attr('type', 'password');
    $(target).attr('src', 'images/eye-icon.svg');
};


export const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
};

export const getTextColor = (hex) => {
    const rgb = hexToRgb(hex);
    const o = Math.round(((parseInt(rgb[0]) * 299) +
        (parseInt(rgb[1]) * 587) +
        (parseInt(rgb[2]) * 114)) / 1000);
    const fore = (o > 125) ? 'black' : 'white';
    const back = 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';

    return fore;
};

export const ifStringEmpty = (text) => {
    return (text.length === 0 && !text.trim());
};