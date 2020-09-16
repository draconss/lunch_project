function get_input_form(id, data, name) {
    let $field = $(`<input type="text" name="${name}" class="field_text form-control">`);
    $field.val(data);
    return $field;
}

function get_related_field(name, data) {
    name = name.replace('_data_view','')
    let $td = $(`<td class="field ${name}_value align-middle">`)
    let $div = $(`<div class="logotype-text">`)
    $div.append(`<img src="${data.logo}" class="restaurant-logotype-img" alt="">`)
    $div.append(`<div>${data.name}</div>`)

    return $td.append($div)
}

function get_related_field_form(id,data_select,name) {
    console.log(id,data_select,name);
    let $select = $(`<select name="${name}" class="select2-container">`)
    send_ajax_request(`/lunch/${name}/`,'GET',null,function (data) {
        for(let i = 0; i< data.length; i++){
            $select.append($(`<option value="${data[i].pk}">${data[i].name}</option>`).attr('selected', data[i].pk === data_select.pk) )
        }
    },function (err) {
        console.log(err)
    });
    return $select
}

function get_checkbox_input_form(id, data, name) {
    console.log(id)
    let $field = $(`<input type="checkbox" name="${name}" class="checkbox-status-user">`);
    $field.prop('checked', data);
    return $field;
}

function get_input_file_form(id, data, name) {
    return $(`<input id="file-${id}" type="file" name="${name}" class="field_text" alt="" hidden> <label class="file-edit" for="file-${id}">Edit file</label>`);
}
function get_checkbox_voting_view(name,data=''){
    return $(`<td class="field ${name}_value align-middle"><input class="checkbox-voting" type="checkbox"></td>`)
}
function get_row_view(name, data=''){
    return $(`<td class="field ${name}_value align-middle">`).text(data)
}

function get_checked_view(name,data){
    let $td = get_row_view(name);
    return $td.append(
        `<span class="material-icons status-user">${data ? 'done' : 'clear'}</span>`
    );
}

function get_submit_btn_view(name, data=""){
    let $td = get_row_view(name);
    $td.removeClass();
    $td.addClass("control-btn");
    return $td.append(`<input class="table-btn edit-btn btn btn-outline-primary btn-sm edit-${name}-btn" type="button" value="Edit">`);
}

function get_img_view(name, data){
    let $td = get_row_view(name);
    return $td.append(`<img src="${data}" class="restaurant-logotype-img" alt="">`);
}

function render_table_row(item,name){
    let $row = $(`<tr id="row_${name}_${item.pk}">`);
    Object.keys(fields_input_object[name]['view_table']).forEach(function (field) {
        let field_input_generate_func = fields_input_object[name]['view_table'][field];
        let $field_input_generate = field_input_generate_func(field,item[field]);
        $row.append($field_input_generate);
    });

    return $row;
}

function global_err_messages(err,err_div_selector='.global-err-message') {
    $(err_div_selector).html("");
    Object.keys(err).forEach(function (item) {
        $(err_div_selector).append(`<div class="alert alert-danger" role="alert"> ${item} ${err[item]} </div>`);
    });
}
