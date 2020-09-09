$(document).ready(function () {




    function render_table_restaurant_row(item){
        let $row = $(`<tr id="row_restaurant_${item.pk}">`);
        $row.append(
            `<td class="logo_value align-middle"><img class="restaurant-logotype-img" src="${item.logo}" alt="#"></td>`+
            `<td class="name_value field align-middle">${item.name} </td>`+
            `<td class="notes_value field align-middle">${item.notes} </td>`+
            `<td class="control-btn"><input class="table-btn edit-btn btn btn-outline-primary btn-sm edit-restaurant-btn" type="button" value="Edit user"></td>`
        );
        return $row;
    }


    send_ajax_request(
        '/lunch/restaurant/',
        "GET", null,
        function (data){
            $("#body-table-restaurant").html("");
            data.forEach(function (item){
                $("#body-table-restaurant").append(render_table_restaurant_row(item));
                // data_obtained_user_list[item.pk] = item;
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