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
    console.log(formData.get('restaurant'))
    send_ajax_request(`/lunch/${table.replace('table_','')}/${id_edit}/`,'PUT',formData,
        function (data) {
            data_obtained_user_list[table][data.pk] = data;
            console.log(data)
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

