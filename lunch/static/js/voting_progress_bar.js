let data_voting_result = {};
let data_today_vote = {};

function to_form_data_to_progressbar(data_voting_result) {
    let data = {};
    Object.keys(data_voting_result).forEach(function (item) {
        if(item !== 'next'){
            if(data[data_voting_result[item]['proposal']] === undefined){
                data[data_voting_result[item]['proposal']] = {count:1, user:[], proposal:data_voting_result[item]['proposal']};
            }else {
                data[data_voting_result[item]['proposal']].count += 1;
            }
            data[data_voting_result[item]['proposal']].user.push(data_voting_result[item].user.first_name +' '+ data_voting_result[item].user.last_name)
        }
    });
    return data;
}


function render_result_voting_today(data_voting,result_vote) {
    console.log(data_voting,result_vote,'progres')
    let data = to_form_data_to_progressbar(result_vote);
    $('.status-vote').html('');
    let count_user = Object.keys(data_voting).length - 1
    let sort_data = Object.values(data).sort(function (a,b) {
        return a.count < b.count ? 1 : -1;
    });

    Object.keys(sort_data).forEach(function (items) {
        $('.status-vote').append(
            `<div class="progress-view">
            <div class="progress-content">
                 <div class="progress-header">
            <img class="card-img-progess" src="${data_voting['proposal'][sort_data[items].proposal]['restaurant']['logo']}" alt="">
             <div class="restaurant-name">${data_voting['proposal'][sort_data[items].proposal]['restaurant']['name']}</div>
            </div>
            <div class="progress-body">
            <div class="progress">
                <div class="progress-bar" role="progressbar" style="width: ${Math.round(sort_data[items].count/count_user*100)}%;" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">${Math.round(sort_data[items].count/count_user*100)}%</div>
            </div>
            <div class="users-voting"><small class="text-muted">${sort_data[items].user.join(', ')}</small></div>

            </div>
            </div>
        </div>`);


    });
    $('.progress-bar:eq(0)').css('background-color','rgb(40 167 69 / 84%)');
    $('.progress-bar:eq(1)').css('background-color','#fd7e14');
    $('.progress-bar:eq(2)').css('background-color','#ffc107')
}

function get_detail_data_voting_today() {
    send_ajax_request('/current-voting/','GET',null,function (data) {
        let proposal = {};
        (data['proposal']).forEach(function (item) {
            proposal[item.pk] = item;
        });
        data_today_vote = data;
        data_today_vote['proposal'] = proposal;

        render_result_voting_today(data_today_vote,data_voting_result);
    },function (err) {
        console.log(err)
    });

}

function get_results_voting_today(){
    let url = '/results-voting/';
    if(!$.isEmptyObject(data_voting_result) && data_voting_result['next'] != null){
        url = data_voting_result['next']
    }
    send_ajax_request(url,'GET',null,function (data) {
        if((data['results']).length > 0) {
            Object.keys(data['results']).forEach(function (item) {
                let username = data.results[item]['user']['username'];
                data_voting_result[username] = data['results'][item];
            });
            data_voting_result['next'] = data['next'];
            if(data_voting_result['next'] != null)
                get_results_voting_today();
            else {
                get_detail_data_voting_today()
            }
        }
    },function (err) {
        console.log(err)
    });
}

$(document).ready(function () {
    get_results_voting_today();
    // setTimeout(get_results_voting , 5000);
});