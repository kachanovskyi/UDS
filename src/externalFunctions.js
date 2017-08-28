import $ from 'jquery';

export const notifyModalShow = (message, type) => {
    const notifyModal = $('#notifyModal');
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
    }, 2000);
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