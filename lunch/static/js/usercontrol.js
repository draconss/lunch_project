$(document).ready(function() {


    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    const csrftoken = getCookie('csrftoken');

    function render_table_row(item,type="POST"){
        let $row = $(`<tr scope="row" id="row_${item.pk}">`);

        $row.append(
            `<td class="field">${item.pk} <div id="err-pk-${item.pk}"></div></td>`+
            `<td id="username-${item.pk}" class="field">${item.username} <div id="err-username-${item.pk}"><ul class="err-ms"></ul></div></td>`+
            `<td id="first_name-${item.pk}" class="field">${item.first_name} <div id="err-first_name-${item.pk}"><ul class="err-ms"></ul></div></td>`+
            `<td id="last_name-${item.pk}" class="field">${item.last_name} <div id="err-last_name-${item.pk}"><ul class="err-ms"></ul></div></td>`+
            `<td id="email-${item.pk}" class="field">${item.email} <div id="err-email-${item.pk}"><ul class="err-ms"></ul></div></td>`
        )
        if(item.is_active){
            $row.append(`<td> <input id="ban_${item.pk}" class="table-btn edit-ban btn  btn-outline-danger" type="checkbox" value="${item.is_active}"></td>`)
        }else {
            $row.append(`<td> <input id="ban_${item.pk}" class="table-btn edit-ban btn  btn-outline-danger" type="checkbox" value="${item.is_active}" checked></td>`)

        }
        // if(item.is_active === true){
        //     $row.append(`<td><input class="table-btn edit-ban btn  btn-outline-danger" logic="true" type="button" id="ban_${item.pk}" value="Ban"> </td>`)
        // }else {
        //     $row.append(`<td><input class="table-btn edit-ban  btn btn-outline-success" logic="false" type="button" id="ban_${item.pk}" value="Unban"> </td>`)
        // }
        $row.append(
            `<td><input class="table-btn edit-btn btn btn-outline-primary btn-sm" type="button" id="edit_${item.pk}" value="Edit user"></td>`
        );
        return $row;
    }

    function logic_render(data,type){
        if(type === "GET"){
            $("#body-table").html("");
            data.forEach(function (item){
                $("#body-table").append(render_table_row(item,type))
            })
        }else if(type === "POST"){
            $("#body-table").append(render_table_row(data));
        }else if(type === "PUT"){
            $(`#row_${data.pk}`).replaceWith(render_table_row(data));
        }
    }

    function grop_button_init(){
        add_user_logic()
        edit_user_logic()
        ban_user_logic()
    }

    function add_user_logic(){
        let btn = $("#add_user")
        $("#my_from").off();

        $("#my_from").submit(function(){
            if($("#password").val() === $("#password_two").val()){
                let data = {
                    username: $("#username").val(),
                    password:  $("#password").val(),
                    first_name: $("#first_name").val(),
                    last_name: $("#lats_name").val(),
                    email: $("#email").val()
                }
                send_ajax_respons(data,`/lunch/users/`,'POST')
            }else {

            }
            return false;
        });
    }

    function edit_user_logic(){
        let btn =  $(".edit-btn")
        btn.off('click');
        btn.click(function (){
            let id_edit = $(this).attr("id").replace('edit_','')
            let row = $(`#row_${id_edit}`)
            let node_row = $(row.children("td"))
            let data_save = []
            if($(this).val() === 'Edit user' ){
                let btn = this;
                data_save = [];

                for(let i =1;i<5;i++){
                    let name = $(row.children("td")[i]).attr("id")
                    data_save.push($(row.children("td")[i]).text());
                    $(node_row)[i].innerHTML = `<td>
                                                <input id="" class="fild_text form-control" value="${$(row.children("td")[i]).text()}" type="text">
                                                <div id="err-${name}"> <ul class="err-ms"></ul> </div>
                                                </td>`
                }
                $(this).val("Submit")
                $(this).parent().append($(`<input id="can_${id_edit}" type="button" value="cancel" class="cancel-bt btn-sm table-btn edit-btn btn btn-outline-primary">`))
                let can = $(".cancel-bt");
                can.off()
                can.click(function () {
                    for(let i =1;i<5;i++){
                        $(node_row)[i].innerHTML = `<td>${data_save[i-1]}</td>`
                    }
                    $(btn).val("Edit user")
                    data_save = [];
                    $(this).off()
                    $(this).remove()
                })

            }else {
                let node = $(row.children("td"))
                let data = {
                    username:$($(node[1]).children("input")[0]).val(),
                    first_name:$($(node[2]).children("input")[0]).val(),
                    last_name:$($(node[3]).children("input")[0]).val(),
                    email:$($(node[4]).children("input")[0]).val(),
                }
                $.ajax({
                    url: `/lunch/users/${id_edit}/`,
                    method: 'PUT',
                    dataType: 'json',
                    contentType: "application/json; charset=utf-8",
                    beforeSend: function (request) {
                        request.setRequestHeader("X-CSRFToken", csrftoken);
                    },
                    data: JSON.stringify(data),
                    success: function (data){
                        logic_render(data,'PUT');
                        grop_button_init();
                        $(this).val("Edit user")
                    },
                    error: function (err){
                        render_err(err['responseJSON'],id_edit);
                    }
                })
            }

        });
    }

    function ban_user_logic(){
        let btn = $(".edit-ban")
        btn.off()
        btn.click(function (){
            let chek = $(this).val()
            let id_edit = $(this).attr("id").replace('ban_','')
            let row = $(`#row_${id_edit}`)
            let node = $(row.children("td"))
            let data = {
                is_active: chek === "false",
                username:$($(node[1])).text(),
                first_name:$($(node[2])).text(),
                last_name:$($(node[3])).text(),
                email:$($(node[4])).text(),
            }
            $.ajax({
                    url: `/lunch/users/${id_edit}/`,
                    method: 'PUT',
                    dataType: 'json',
                    contentType: "application/json; charset=utf-8",
                    beforeSend: function (request) {
                        request.setRequestHeader("X-CSRFToken", csrftoken);
                    },
                    data: JSON.stringify(data),
                    success: function (data){
                        logic_render(data,'PUT');
                        grop_button_init();
                    },
                    error: function (err){
                        console.log(err)
                        render_err(err['responseJSON'],id_edit);
                    }
                })
            // send_ajax_respons(data,`/lunch/users/${id_edit}/`,'PUT')
        });

    }

    function send_ajax_respons(data="",url="",type="",err_m=false) {
        $.ajax({
            url: url,
            method: type,
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            beforeSend: function (request) {
                request.setRequestHeader("X-CSRFToken", csrftoken);
            },
            data: JSON.stringify(data),
            success: function (data){
                logic_render(data,type);
                grop_button_init();
            },
            error: function (err){
                render_err(err['responseJSON']);
            }
        })

    }
    function render_err(err="",id_edit){
        $(".err-ms").html("")
        Object.keys(err).forEach(function (item) {
            $(`#err-${item}-${id_edit} > ul`).append(`<li> ${item} ${err[item]} </li>`)
        });
    }



    send_ajax_respons('','/lunch/users/',"GET")
});