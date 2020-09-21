function on_scroll(e) {
    let table = $(this).find('tbody').attr('id');
    if (e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight)
    {
        get_the_rest_of_the_data(table);
    }
}
function get_the_rest_of_the_data(name) {
    let table_name = name.replace('body-table-','table_')
    if(data_obtained_user_list[table_name]['next'] != null){
        send_ajax_request(data_obtained_user_list[table_name]['next'],'GET',null,function (data) {
            console.log(data)
            data['results'].forEach(function (item){
                $(`#${name}`).append(render_table_row(item,table_name));
                (data_obtained_user_list[table_name])[item.pk] = item
            });
            (data_obtained_user_list[table_name])['next'] = data['next'];
            if(name === 'body-table-voting' || name === 'body-table-proposal')
                checked_date_for_checkboxes()
            console.log(data_obtained_user_list)
        }, function f(err) {
            console.log(err)
        });
    }
}

function add_table(name){
    let $table = $(`#table-${name}`);
    $table.on('click', `.edit-submit_${name}-btn` ,{name_table: `table_${name}`} ,on_generating_for_edit_form);
    $table.on('click','.cancel-btn', cancel_changes);
    $(`#table-edit-form-${name}`).on('submit', on_edit_form_submit)
    $(`#add-${name}-form`).on('submit', {name_table: `table_${name}`}, on_add_form_submit);
    $table.closest('.custom-scrollbar').on('scroll',on_scroll)
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
