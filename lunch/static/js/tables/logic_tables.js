function validation_form(name) {
    let data = {}
    if(name === 'table_users'){
        if($("#password").val() !== $("#password_two").val())
            data['password'] = 'Password mismatch';
    }
    return data;
}


function on_add_form_submit(e){
    e.preventDefault()
    let table = e.data.name_table
    let this_form = this;
    let formData = new FormData(this);
    let err_validate = validation_form(table);
    console.log(err_validate)
    if($.isEmptyObject(err_validate)){
        send_ajax_request(`/lunch/${table.replace('table_','')}/`,'POST',formData,
            function (data){
                $(".err-message").html("");
                $(`#body-table-${table.replace('table_','')}`).append(render_table_row(data,table));
                data_obtained_user_list[table][data.pk] = data;
                this_form.reset();
                init_field_proposal(table)
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

function on_edit_form_submit(e){
    e.preventDefault();
    let id_edit = edit_field_id[0];
    let table = edit_field_id[1];
    let row = $(`#row_${table}_${id_edit}`);
    let formData = new FormData(this);
    send_ajax_request(`/lunch/${table.replace('table_','')}/${id_edit}/`,'PUT',formData,
        function (data) {
            console.log(data)
            data_obtained_user_list[table][data.pk] = data;
            init_field_proposal(table,data);
            row.replaceWith(render_table_row(data,table));
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

function cancel_changes(){
    if(edit_field_id){
        let id = edit_field_id[0];
        let table = edit_field_id[1]
        let row = $(`#row_${table}_${id}`);
        row.replaceWith(render_table_row(data_obtained_user_list[table][id],table));
        edit_field_id = null;
    }
}

function on_generating_for_edit_form(e){
    let table = e.data.name_table
    let row = $(this).closest("tr");
    let id_edit = row.attr("id").replace(`row_${table}_`,'');
    cancel_changes();
    edit_field_id = [id_edit,table];
    let data_user = data_obtained_user_list[table][id_edit];
    Object.keys(fields_input_object[table]['view_form']).forEach(function (item){
        let $err_field_message = $(`<div class='err-message-${item} err-message'">`);
        let $field_document = row.children(`.${item}_value`);
        let field_input_generate_func = fields_input_object[table]['view_form'][item];
        let $field_input_generate = field_input_generate_func(id_edit,data_user[item], item);
        $field_document.html($field_input_generate);
        $field_document.append($err_field_message);
    })

    let $group_button = $('<div class="btn-group">');
    let $button_submit = $(`<input type="submit" class="submit-btn edit-btn btn btn-outline-success btn-sm" value="Submit">`);
    let $button_cancel = $(`<input type="button" class="cancel-btn cancel-bt btn-sm btn btn-outline-danger" value="Cancel">`);
    $group_button.append($button_submit);
    $group_button.append($button_cancel);

    $(this).parent().append($group_button);
    $(this).remove();
}

function init_field_proposal(name,data){
    if(name === 'table_restaurant'){
        send_ajax_request(`/lunch/proposal-data`,'GET',null,function (data) {
            let add_data = {}
            $(`#list_restaurant`).html('');
            data.forEach(function (item) {
                add_data[item.pk] = item;
                $(`#list_restaurant`).append($(`<option value="${item.pk}">${item.name}</option>`))
            });
            data_obtained_user_list['select_data'] = add_data;

        },function (err) {
            console.log(err)
        });
        refresh_table('proposal')
    }
    else if (name === 'table_proposal'){
        console.log(data)
        data_obtained_user_list[name][data.pk]['restaurant'] = data_obtained_user_list['select_data'][data.restaurant]
        console.log(data_obtained_user_list)
    }
}

function refresh_table(name) {
    send_ajax_request(
        `/lunch/${name}/`,
        "GET", null,
        function (data){
            $(`#body-table-${name}`).html("");
            let add_data = {}
            data.forEach(function (item){
                $(`#body-table-${name}`).append(render_table_row(item,`table_${name}`));
                add_data[item.pk] = item;
            });
            data_obtained_user_list[`table_${name}`] = add_data;
            console.log(data_obtained_user_list)
        },
        function (err){
            global_err_messages(err['responseJSON']);
        });
}

