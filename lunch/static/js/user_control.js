"use strict";


$(document).ready(function() {


    let $users_table = $('#table-user');
    $users_table.on('click', `.edit-user-btn`, on_generating_for_user_edit_form);
    $users_table.on('click','.cancel-user-btn', cancel_changes_user);
    $('#table-edit-form').submit(on_user_edit_form_submit);
    $("#add-user-form").submit(on_add_user_form_submit);

    function get_input(id, data) {
        let $field = $(`<input type="text" class="field_text form-control">`);
        $field.val(data);
        return $field;
    }

    function get_checkbox_input(id, data) {
        let $field = $(`<input type="checkbox" class="checkbox-status-user">`);
        $field.prop('checked', data);
        return $field;
    }

    const fields_input_object = {
        'username': get_input ,
        'first_name': get_input ,
        'last_name': get_input ,
        'email': get_input ,
        'is_active': get_checkbox_input ,
    };
    let data_obtained_user_list = [];
    let edit_field_id;


    function render_table_row(item){
        let $row = $(`<tr id="row_${item.pk}">`);
        $row.append(
            `<td class="field align-middle">${item.pk}</td>`+
            `<td class="username_value field align-middle">${item.username} </td>`+
            `<td class="first_name_value field align-middle">${item.first_name} </td>`+
            `<td class="last_name_value field align-middle">${item.last_name} </td>`+
            `<td class="email_value field align-middle">${item.email} </td>` +
            `<td class="is_active_value"> <span class="material-icons status-user">${item.is_active ? 'done' : 'clear' }</span></td>` +
            `<td class="control-btn"><input class="table-btn edit-btn btn btn-outline-primary btn-sm edit-user-btn" type="button" value="Edit user"></td>`
        );
        return $row;
    }


    function validate_add_form(data) {
        let err_validate = {}
        if(data["password"] !== $("#password_two").val()) {
            err_validate = {password: "not lonely password in fields"};
        }
        return err_validate;
    }

    function on_add_user_form_submit(e){
        e.preventDefault()
        let this_form = this;
        let data = {
            username: $("#username").val(),
            password:  $("#password").val(),
            first_name: $("#first_name").val(),
            last_name: $("#lats_name").val(),
            email: $("#email").val()
        };
        let err_validate = validate_add_form(data);
        if($.isEmptyObject(err_validate)){

            send_ajax_request(`/lunch/users/`,'POST',data,
                function (data){
                    $("#body-table").append(render_table_row(data));
                    data_obtained_user_list[data.pk] = data;
                    this_form.reset();
                },
                function (err){
                    err = err['responseJSON'];
                    $(".err-message").html("");
                    Object.keys(err).forEach(function (item) {
                        $(`#add-err-${item}> ul`).append(`<li> ${item} ${err[item]} </li>`);
                    });
                });

        }else {

            $(".err-message").html("");
            Object.keys(err_validate).forEach(function (item) {
                $(`#add-err-${item}> ul`).append(`<li> ${item} ${err_validate[item]} </li>`);
            });

        }
    }


    function on_user_edit_form_submit(e){
        e.preventDefault();
        let data = {};
        let id_edit = edit_field_id;
        let row = $(`#row_${id_edit}`);
        Object.keys(fields_input_object).forEach(function (item){
            let $field_document = row.find(`.${item}_value > input`);
            console.log($field_document.val());
            if($field_document.attr('type')==='checkbox'){
                data[item] = $field_document.is(':checked');
            }else {
                data[item] = $field_document.val();
            }
        });

        send_ajax_request(`/lunch/users/${id_edit}/`,'PUT',data,
            function (data) {
                data_obtained_user_list[data.pk] = data;
                row.replaceWith(render_table_row(data));
                edit_field_id = null;
            },
            function (err) {
                err = err['responseJSON']
                $(".err-message").html("");
                Object.keys(err).forEach(function (item) {
                    $(`.err-message-${item}`).append(`<li> ${item} ${err[item]} </li>`);
                });
            });
    }


    function cancel_changes_user(){
        if(edit_field_id){
            let row = $(`#row_${edit_field_id}`);
            row.replaceWith(render_table_row(data_obtained_user_list[edit_field_id]));
            edit_field_id = null;
        }
    }

    function on_generating_for_user_edit_form(){
        let row = $(this).closest("tr");
        let id_edit = row.attr("id").replace('row_','');
        cancel_changes_user();
        edit_field_id = id_edit;
        let data_user = data_obtained_user_list[id_edit];
        Object.keys(fields_input_object).forEach(function (item){
            let $err_field_message = $(`<div class='err-message-${item} err-message'">`);
            let $field_document = row.children(`.${item}_value`);
            let field_input_generate_func = fields_input_object[item];
            let $field_input_generate = field_input_generate_func(`${item}-input-${id_edit}`,data_user[item]);
            $field_document.html($field_input_generate);
            $field_document.append($err_field_message);
        })

        let $group_button = $('<div class="btn-group">');
        let $button_submit = $(`<input type="submit" class="submit-user-btn edit-btn btn btn-outline-success btn-sm" value="Submit">`);
        let $button_cancel = $(`<input type="button" class="cancel-user-btn cancel-bt btn-sm btn btn-outline-danger" value="Cancel">`);
        $group_button.append($button_submit);
        $group_button.append($button_cancel);

        $(this).parent().append($group_button);
        $(this).remove();
    }


    send_ajax_request(
        '/lunch/users/',
        "GET", null,
        function (data){
            $("#body-table").html("");
            data.forEach(function (item){
                $("#body-table").append(render_table_row(item));
                data_obtained_user_list[item.pk] = item;
            });
        },
        function (err){
            err = err['responseJSON'];
            $(".global-err-message").html("");
            Object.keys(err).forEach(function (item) {
                $(`.global-err-message`).append(`<div class="alert alert-danger" role="alert"> ${item} ${err[item]} </div>`);
            });
        });
});