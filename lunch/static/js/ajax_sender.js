"use strict";

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function send_ajax_request(
    url,
    method,
    data=null,
    success_handler=null,
    error_handler=null,
    contentType= false,
) {
    let options = {
        url: url,
        method: method,
        // dataType: 'json',
        contentType: contentType, //"application/json; charset=utf-8",
        // enctype: 'multipart/form-data',
        processData: false,
        beforeSend: function (request) {
            request.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
        },
    }
    if (data) {
        options['data'] = data // JSON.stringify(data)
    }
    if (success_handler) {
        options['success'] = success_handler
    }
    if (error_handler) {
        options['error'] = error_handler
    }
    $.ajax(options);

}

