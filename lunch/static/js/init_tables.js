
function add_table(name){
    let $table = $(`#table-${name}`);
    $table.on('click', `.edit-submit_${name}-btn` ,{name_table: `table_${name}`} ,on_generating_for_edit_form);
    $table.on('click','.cancel-btn', cancel_changes);
    $(`#table-edit-form-${name}`).on('submit', on_edit_form_submit)
    $(`#add-${name}-form`).on('submit', {name_table: `table_${name}`}, on_add_form_submit);
    refresh_table(name);

}


$(document).ready(function () {
    add_table('restaurant')
    add_table('users')
    add_table('proposal')
    add_table('voting')
    init_field_proposal('table_restaurant')
    init_checkbox_to_voting();

});
