
function add_table(name){
    let $table = $(`#table-${name}`);
    $table.on('click', `.edit-submit_${name}-btn` ,{name_table: `table_${name}`} ,on_generating_for_edit_form);
    $table.on('click','.cancel-btn', cancel_changes);
    $(`#table-edit-form-${name}`).on('submit', on_edit_form_submit)
    $(`#add-${name}-form`).on('submit', {name_table: `table_${name}`}, on_add_form_submit);
    $table.closest('.custom-scrollbar').on('scroll',on_scroll)
    refresh_table(name);

}

function get_data_to_progressbar() {
    let data = {};
    Object.keys(data_obtained_list['voting_rezult']).forEach(function (item) {
        if(item !== 'next'){
            if(data[data_obtained_list['voting_rezult'][item]['proposal']] === undefined){
                data[data_obtained_list['voting_rezult'][item]['proposal']] = {count:1, user:[], proposal:data_obtained_list['voting_rezult'][item]['proposal']};
            }else {
                data[data_obtained_list['voting_rezult'][item]['proposal']].count += 1;
            }
            data[data_obtained_list['voting_rezult'][item]['proposal']].user.push(data_obtained_list['voting_rezult'][item].user.first_name +' '+ data_obtained_list['voting_rezult'][item].user.last_name)
        }
    });
    return data;
}

function render_result_voting_today() {
    let data = get_data_to_progressbar();
    $('.status-vote').html('');
    let count_user = Object.keys(data_obtained_list['voting_rezult']).length - 1
    let sort_data = Object.values(data).sort(function (a,b) {
        return a.count < b.count ? 1 : -1;
    });
    let first = true;
    Object.keys(sort_data).forEach(function (items) {
        $('.status-vote').append(
            `<div class="progress-view">
            <div class="progress-content">
                 <div class="progress-header">
            <img class="card-img-progess" src="${data_obtained_list['voting_detail']['proposal'][sort_data[items].proposal]['restaurant']['logo']}" alt="">
             <div class="restaurant-name">${data_obtained_list['voting_detail']['proposal'][sort_data[items].proposal]['restaurant']['name']}</div>
            </div>
            <div class="progress-body">
            <div class="progress">
                <div class="progress-bar" role="progressbar" style="width: ${Math.round(sort_data[items].count/count_user*100)}%;" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">${Math.round(sort_data[items].count/count_user*100)}%</div>
            </div>
            <div class="users-voting"><small class="text-muted">${sort_data[items].user.join(', ')}</small></div>

            </div>
            </div>
        </div>`);

        if(first){
            first = false;
            let restaurant = data_obtained_list['voting_detail']['proposal'][sort_data[items].proposal]['restaurant'];
            let row = $(`#row_table_voting_${data_obtained_list['voting_detail'].pk}`);
            console.log(row)
            row.children('.count_vote_value').text(sort_data[items].count)
            row.children('.restaurant_value').html('');
            row.children('.restaurant_value').append(
                `<div class="logotype-text">
                    <img class="restaurant-logotype-img" src="${restaurant.logo}">
                    <div>${restaurant.name}</div>
                </div>`
            );
        }
    });
    $('.progress-bar:eq(0)').css('background-color','rgb(40 167 69 / 84%)');
    $('.progress-bar:eq(1)').css('background-color','#fd7e14');
    $('.progress-bar:eq(2)').css('background-color','#ffc107')
}

function get_detail_form_voting_today() {
        send_ajax_request('/current-voting/','GET',null,function (data) {
            let proposal = {};
            (data['proposal']).forEach(function (item) {
                proposal[item.pk] = item;
            });
            data_obtained_list['voting_detail'] = data;
            data_obtained_list['voting_detail']['proposal'] = proposal;
            render_result_voting_today();
        },function (err) {
            console.log(err)
        });

}

function get_results_voting(){
    if(data_obtained_list['voting_rezult'] == null){
        data_obtained_list['voting_rezult'] = {}
    }
    let url = '/results-voting/';
    if(!$.isEmptyObject(data_obtained_list['voting_rezult']) && data_obtained_list['voting_rezult']['next'] != null){
        url = data_obtained_list['voting_rezult']['next']
    }
    send_ajax_request(url,'GET',null,function (data) {
        if(data.count !== 0){
            if((data['results']).length > 0) {
                Object.keys(data['results']).forEach(function (item) {
                    let username = data.results[item]['user']['username'];
                    data_obtained_list['voting_rezult'][username] = data['results'][item];
                });
                data_obtained_list['voting_rezult']['next'] = data['next'];

                if(data_obtained_list['voting_rezult']['next'] != null)
                    get_results_voting();
                else {
                    get_detail_form_voting_today()
                }
            }
        }
    },function (err) {
        console.log(err)
    });
}



$(document).ready(function () {
    add_table('restaurant')
    add_table('users')
    add_table('proposal')
    add_table('voting')
    init_field_proposal('table_restaurant')
    init_checkbox_to_voting();
    get_results_voting()
    setInterval(get_results_voting,5000)

});
