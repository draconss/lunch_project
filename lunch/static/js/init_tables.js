function restaurant_table(){
     let $restaurant_table = $('#table-restaurant');
    $restaurant_table.on('click', `.edit-submit_restaurant-btn` ,{name_table: "table_restaurant"} ,on_generating_for_edit_form);
    $restaurant_table.on('click','.cancel-btn', cancel_changes);
    $('#table-edit-form-restaurant').on('submit', on_edit_form_submit)
    $("#add-restaurant-form").on('submit', {name_table: "table_restaurant"}, on_add_form_submit)


    send_ajax_request(
        '/lunch/restaurant/',
        "GET", null,
        function (data){
            $("#body-table-restaurant").html("");
            let add_data = {}
            data.forEach(function (item){
                $("#body-table-restaurant").append(render_table_row(item,"table_restaurant"));
                add_data[item.pk] = item;
            });
            data_obtained_user_list['table_restaurant'] = add_data;
        },
        function (err){
            global_err_messages(err['responseJSON']);
        });
}
function user_table(){
     let $users_table = $('#table-user');
    $users_table.on('click', `.edit-submit_user-btn` ,{name_table: "table_users"} ,on_generating_for_edit_form);
    $users_table.on('click','.cancel-btn', cancel_changes);
    $('#table-edit-form').on('submit', on_edit_form_submit)
    $("#add-user-form").on('submit', {name_table: "table_users"}, on_add_form_submit);


    send_ajax_request(
        '/lunch/users/',
        "GET", null,
        function (data){
            $("#body-table-users").html("");
            let add_data = {}
            data.forEach(function (item){
                $("#body-table-users").append(render_table_row(item,"table_users"));
                add_data[item.pk] = item;
            });
            data_obtained_user_list['table_users'] = add_data;
        },
        function (err){
            global_err_messages(err['responseJSON']);
        });
}


$(document).ready(function () {
    user_table();
   restaurant_table();
});