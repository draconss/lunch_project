
function add_table(name){
     let $table = $(`#table-${name}`);
    $table.on('click', `.edit-submit_${name}-btn` ,{name_table: `table_${name}`} ,on_generating_for_edit_form);
    $table.on('click','.cancel-btn', cancel_changes);
    $(`#table-edit-form-${name}`).on('submit', on_edit_form_submit)
    $(`#add-${name}-form`).on('submit', {name_table: `table_${name}`}, on_add_form_submit);


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

$(document).ready(function () {
    add_table('restaurant')
    add_table('users')
    add_table('proposal')
   //  user_table();
   // restaurant_table();
   // proposal_table()
});

//proposal