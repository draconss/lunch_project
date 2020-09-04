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



            function render_table_row(item,update=false){
                let $row = $(`<tr id="row_${item.pk}">`);
                $row.append(
                    `<td class="fild">${item.pk}</td>`+
                    `<td class="fild">${item.username}</td>`+
                    `<td class="fild">${item.first_name}</td>`+
                    `<td class="fild">${item.last_name}</td>`+
                    `<td class="fild">${item.email}</td>`
                )
                if(item.is_active === true){
                    $row.append(`<td><input class="table-btn edit-ban btn  btn-outline-danger" logic="true" type="button" id="ban_${item.pk}" value="Ban"> </td>`)
                }else {
                    $row.append(`<td><input class="table-btn edit-ban  btn btn-outline-success" logic="false" type="button" id="ban_${item.pk}" value="Unban"> </td>`)
                }
                $row.append(
                    `<td><input class="table-btn edit-btn btn btn-outline-primary" type="button" id="edit_${item.pk}" value="Edit user"></td>`
                );
                if(update === true)
                    $(`#row_${item.pk}`).replaceWith($row)
                else
                    $("#body-table").append($row);

            }


            function edit_user(user,data){
                $.ajax({
                    url: `/lunch/users/${user}/`,
                    method: 'PUT',
                    dataType: 'json',
                    contentType: "application/json; charset=utf-8",
                    beforeSend: function (request) {
                        request.setRequestHeader("X-CSRFToken", csrftoken);
                    },
                    data: JSON.stringify(data),
                    success: function (data){
                        render_table_row(data,true)
                        grop_button_init();

                        console.log(data)


                    },
                    error: function (err){
                        console.log(err)
                    }
                })
            }

            function grop_button_init(){
                initial_buton()
                ban_user()
                add_user_btn()
            }

            function add_user_btn(){
                let btn = $("#add_user")
                btn.off()
                btn.click(function (){
                    if($("#password").val() === $("#password_two").val()){
                        let data = {
                            username: $("#username").val(),
                            password:  $("#password").val(),
                            first_name: $("#first_name").val(),
                            last_name: $("#lats_name").val(),
                            email: $("#email").val()
                        }
                        add_user(data)
                    }
                })
            }


            function add_user(data){
                $.ajax({
                    url: `/lunch/users/`,
                    method: 'POST',
                    dataType: 'json',
                    contentType: "application/json; charset=utf-8",
                    beforeSend: function (request) {
                        request.setRequestHeader("X-CSRFToken", csrftoken);
                    },
                    data: JSON.stringify(data),
                    success: function (data){
                        render_table_row(data)
                        grop_button_init();
                        console.log(data)
                    },
                    error: function (err){
                        console.log(err)
                    }
                })
            }



            function initial_buton(){
                let btn =  $(".edit-btn")
                btn.off('click');
                btn.click(function (){
                    let id_edit = $(this).attr("id").replace('edit_','')
                    let row = $(`#row_${id_edit}`)
                    if($(this).val() === 'Edit user' ){
                        let node_row = $(row.children("td"))
                        for(let i =1;i<5;i++){
                            $(node_row)[i].innerHTML = `<td><input class="fild_text form-control" value="${$(row.children("td")[i]).text()}" type="text"></td>`
                        }
                        $(this).val("Edit save")
                    }else {
                        let node = $(row.children("td"))
                        let data = {
                            username:$($(node[1]).children("input")[0]).val(),
                            first_name:$($(node[2]).children("input")[0]).val(),
                            last_name:$($(node[3]).children("input")[0]).val(),
                            email:$($(node[4]).children("input")[0]).val(),
                        }
                        edit_user(id_edit,data)
                        $(this).val("Edit user")
                    }

                });
            }

            function ban_user(){
                let btn = $(".edit-ban")
                btn.off()
                btn.click(function (){
                    let chel = $(this).attr("logic");
                    let id_edit = $(this).attr("id").replace('ban_','')
                    data = {
                        is_active: chel=='false'
                    }
                    edit_user(id_edit,data)
                });

            }

            $.ajax({
                url: '/lunch/users/',
                method: 'get',
                dataType: 'json',
                success: function (data){
                    data.forEach(function (item){
                        render_table_row(item)
                    })
                    grop_button_init();

                },
                error: function (err){
                    console.log(err)
                }
            })




        });