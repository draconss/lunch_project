function get_input_form(id, data, name) {
    let $field = $(`<input type="text" name="${name}" class="field_text form-control">`);
    $field.val(data);
    return $field;
}

function get_checkbox_input_form(id, data, name) {
    let $field = $(`<input type="checkbox" name="${name}" class="checkbox-status-user">`);
    $field.prop('checked', data);
    return $field;
}

function get_input_file_form(id, data, name) {
    return $(`<input id="file-${name}-${id}" type="file" name="${name}" class="field_text" alt="" hidden> <label class="file-edit" for="file-${name}-${id}">Edit file</label>`);
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
    return $td.append(`<img src="${data}" class="restaurant-logotype-img">`);
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

function global_err_messages(err) {
    $(".global-err-message").html("");
    Object.keys(err).forEach(function (item) {
        $(`.global-err-message`).append(`<div class="alert alert-danger" role="alert"> ${item} ${err[item]} </div>`);
    });
}
