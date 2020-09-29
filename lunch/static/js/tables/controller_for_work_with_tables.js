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
        send_ajax_request(`/${table.replace('table_','')}/`,'POST',formData,
            function (data){
                $(".err-message").html("");
                data_obtained_list[table][data.pk] = data;
                init_field_proposal(table,data)
                $(`#body-table-${table.replace('table_','')}`).append(render_table_row(data,table));
                this_form.reset();
                checked_date_for_checkboxes();
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
    send_ajax_request(`/${table.replace('table_','')}/${id_edit}/`,'PUT',formData,
        function (data) {
            console.log(data)
            data_obtained_list[table][data.pk] = data;
            init_field_proposal(table,data);
            row.replaceWith(render_table_row(data,table));
            edit_field_id = null;
            checked_date_for_checkboxes()
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
        row.replaceWith(render_table_row(data_obtained_list[table][id],table));
        edit_field_id = null;
        checked_date_for_checkboxes();
    }
}

function on_generating_for_edit_form(e){
    let table = e.data.name_table
    let row = $(this).closest("tr");
    let id_edit = row.attr("id").replace(`row_${table}_`,'');
    cancel_changes();
    edit_field_id = [id_edit,table];
    let data_user = data_obtained_list[table][id_edit];
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
        let url = `/restaurant-data`;
        if(! $.isEmptyObject(data_obtained_list['select_data']) && data_obtained_list['select_data']['next'] != null)
            url = data_obtained_list['select_data']['next']

        send_ajax_request(url,'GET',null,function (data) {
            $(`#list_restaurant`).html('');
            if(data_obtained_list['select_data'] === undefined){
                data_obtained_list['select_data'] = {}
            }
            data['results'].forEach(function (item) {
                data_obtained_list['select_data'][item.pk] = item;
            });

            data_obtained_list['select_data']['next'] = data['next'];

            if(data_obtained_list['select_data']['next'] == null){
                let select_data = data_obtained_list['select_data']
                Object.keys(select_data).forEach(function (item) {
                    if(item !== 'next')
                        $(`#list_restaurant`).append($(`<option value="${select_data[item]['pk']}">${select_data[item]['name']}</option>`))
                });

                refresh_table('proposal');
            }else {
                init_field_proposal('table_restaurant');
            }
        },function (err) {
            console.log(err)
        });
    }

    else if (name === 'table_proposal'){
        console.log(data)
        data_obtained_list[name][data.pk]['restaurant'] = data_obtained_list['select_data'][data.restaurant]
    }
}

function refresh_table(name) {
    send_ajax_request(
        `/${name}/`,
        "GET", null,
        function (data){
            $(`#body-table-${name}`).html("");
            // console.log(data)
            let add_data = {}
            data['results'].forEach(function (item){
                $(`#body-table-${name}`).append(render_table_row(item,`table_${name}`));
                add_data[item.pk] = item;
            });
            add_data['next'] = data['next'];
            data_obtained_list[`table_${name}`] = add_data;
            console.log(data);
            if(name === 'voting' || name === 'proposal')
                checked_date_for_checkboxes()


        },
        function (err){
            global_err_messages(err['responseJSON']);
        });

}


function eq_data(data_1, data_2) {
    if(data_1.getDay() !== data_2.getDay())
        return false

    if(data_1.getDate() !== data_2.getDate())
        return false

    return data_1.getFullYear() === data_2.getFullYear();

}

function find_date_to_voting(date) {
    if('table_voting' in data_obtained_list){
        let list_object = Object.values(data_obtained_list['table_voting'])
        list_object.pop();
        return list_object.some(function (obj) {
            return eq_data(new Date(obj.date), date);
        });
    }
}

function voting_validations(proposal) {
    let validate_list = {}
    let voting_duplicate = find_date_to_voting(new Date());
    let restaurant_pk = [];
    proposal.forEach(function (pk) {
        restaurant_pk.push(data_obtained_list['table_proposal'][pk]['restaurant']['pk'])
    });
    if (voting_duplicate){
        validate_list['voting'] = 'you can not create voting today';
    }

    if(proposal.length !== new Set(restaurant_pk).size){
        validate_list['voting'] = 'the restaurant cannot be repeated in the vote';
    }
    return validate_list;
}

function on_add_voting_from_submit() {
    $(`#add_voting`).click(function (e) {
        let checked = $(`.selected_proposal_value`);
        let proposal = [];
        Object.keys(checked).forEach(function (items) {
            let checkbox = $(checked[items]).children('input')
            if(checkbox.is(":checked")){
                proposal.push(Number(checkbox.closest("tr").attr("id").replace(`row_table_proposal_`,'')));
            }
        });
        let err_list = voting_validations(proposal);
        console.log(err_list)

        if($.isEmptyObject(err_list)){
            send_ajax_request('/voting/','POST',JSON.stringify({proposal:proposal}),
                function (data) {
                    Object.keys(checked).forEach(function (items) {
                        $(checked[items]).children('input').prop('checked', false)
                    });
                    $('#add_voting').hide();
                    refresh_table('voting');
                },
                function (err) {
                    global_err_messages(err['responseJSON'],'.err_voting');
                },
                "application/json; charset=utf-8");
        }else {
            global_err_messages(err_list,'.err_voting');
        }
    });
}


function checked_date_for_checkboxes() {
    if(find_date_to_voting(new Date())){
        $('.checkbox-voting').hide()
    }
}



function init_checkbox_to_voting(){
    $('#add_voting').hide();

    $('#table-edit-form-proposal').on('click', '.checkbox-voting',function (e) {
        let checkboxes = $('.checkbox-voting')
        $('#add_voting').hide();
        Object.keys(checkboxes).forEach(function (item) {
            if($(checkboxes[item]).is(":checked"))
                $('#add_voting').show();
        });
    });

    on_add_voting_from_submit();
}

function on_scroll(e) {
    let table = $(this).find('tbody').attr('id');
    if (e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight)
    {
        get_the_rest_of_the_data(table);
    }
}

function get_the_rest_of_the_data(name) {
    let table_name = name.replace('body-table-','table_')
    if(data_obtained_list[table_name]['next'] != null){
        send_ajax_request(data_obtained_list[table_name]['next'],'GET',null,function (data) {
            console.log(data)
            data['results'].forEach(function (item){
                $(`#${name}`).append(render_table_row(item,table_name));
                (data_obtained_list[table_name])[item.pk] = item
            });
            (data_obtained_list[table_name])['next'] = data['next'];
            if(name === 'body-table-voting' || name === 'body-table-proposal')
                checked_date_for_checkboxes()
            console.log(data_obtained_list)
        }, function f(err) {
            console.log(err)
        });
    }
}
