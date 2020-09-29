let voting_rezult = {};
let data_vote;
function generate_cart_t(data) {
    return `<div data-toggle="tooltip" title="voted:-" id="vote-${data['pk']}" class="card mb-3" style="max-width: 540px;">
  <div class="row no-gutters">
    <div class="col-md-4">
      <img src="${data['restaurant']['logo']}" class="card-img" alt="...">
    </div>
    <div class="col-md-8">
      <div class="card-body">
        <div class="button-filed"></div>
      </div>
    </div>
   <div class="menu">
     <h5 class="card-title">${data['restaurant']['name']}</h5>
     <p class="card-text">${data['menu'].replaceAll('\n','</br>')}</p>
   </div>
  </div>
</div>`
}


function get_data_to_progressbar() {
    let data = {};
    Object.keys(voting_rezult).forEach(function (item) {
        if(item !== 'next'){
            if(data[voting_rezult[item]['proposal']] === undefined){
                data[voting_rezult[item]['proposal']] = {count:1, user:[], proposal:voting_rezult[item]['proposal']};
            }else {
                data[voting_rezult[item]['proposal']].count += 1;
            }
            data[voting_rezult[item]['proposal']].user.push(voting_rezult[item].user.first_name +' '+ voting_rezult[item].user.last_name)
        }
    });
    return data;
}

function refresh_status_voting() {
    let data = get_data_to_progressbar();
    $('.status-vote').html('');
    let count_user = Object.keys(voting_rezult).length - 1
    let sort_data = Object.values(data).sort(function (a,b) {
        return a.count < b.count ? 1 : -1;
    });
    Object.keys(sort_data).forEach(function (items) {
        $('.status-vote').append(
            `<div class="progress-view">
            <div class="progress-content">
            <div class="progress-header">
            <img class="card-img-progess" src="${data_vote['proposal'][sort_data[items].proposal]['restaurant']['logo']}" alt="">
            <div class="restaurant-name">${data_vote['proposal'][sort_data[items].proposal]['restaurant']['name']}</div>
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


function render_list_voting(data){
    $('.list-card').append($(`<div class="col mb-4">${generate_cart_t(data)}</div>`));
}


function on_card(e){
    $('.button-filed').html('')
    $(this).find('.button-filed').append($('<input class=" btn btn-vote btn-sm btn-success" type="button" value="vote">'))
}

function on_voting(e){
    let proposal = ($(this).closest('.card').attr('id')).replace('vote-','')
    send_ajax_request('/vote/','POST',JSON.stringify({proposal:proposal}),
        function (data) {
            $('.button-filed').html('')
            get_data_results_voting(false);
            $('.list-card').off();
            document.cookie = `voice = ${data_vote['pk']}`
        },function (err) {
            // console.log(err['responseJSON'])
            if(err['responseJSON']['voting'] === 'you can\'t vote today anymore'){
                document.cookie = `voice = ${data_vote['pk']}`
                get_data_results_voting();
            }
        },"application/json; charset=utf-8");
}

function get_data_for_cart(){
    send_ajax_request('/current-voting/','GET',null,
        function (data) {
            $('.list-card').html('');
            $('.voting-message').html('');
            let proposal = {};
            (data['proposal']).forEach(function (item) {
                render_list_voting(item);
                proposal[item.pk] = item

            });

            data_vote = data;
            data_vote['proposal'] = proposal
            user_results_view();

        },
        function (err) {
            let voting_message = $('.voting-message')
            voting_message.html('');
            voting_message.append($('<div class="message"> <h2>Voting has not started yet! :)</h2> </div>'))
            setTimeout(get_data_results_voting,5000);
        });
}


function get_data_results_voting(render_cart=true){
    console.log('start')
    let url = '/results-voting/';
    if(!$.isEmptyObject(voting_rezult) && voting_rezult['next'] != null){
        url = voting_rezult['next']
    }
    send_ajax_request(url,'GET',null,
        function (data) {
            voting_rezult['next'] = data['next'];
            if((data['results']).length > 0) {
                Object.keys(data['results']).forEach(function (item) {
                    let username = data.results[item]['user']['username'];
                    voting_rezult[username] = data['results'][item];
                });
                if(voting_rezult['next'] != null)
                    get_data_results_voting(render_cart,false);
            }
            if (render_cart){
                get_data_for_cart();
            }else {
                user_results_view();
            }

        },
        function (err) {
            console.log(err)
        });

}


function user_results_view(){
    $('.voted-users').html('')
    if(Number(getCookie('voice')) === data_vote['pk']){
        Object.keys(voting_rezult).forEach(function (item) {
            if(item !== 'next'){
                let first_name = voting_rezult[item]['user']['first_name'];
                let last_name = voting_rezult[item]['user']['last_name'];
                let text = $(`#vote-${voting_rezult[item]['proposal']}`).attr('title')
                text += ' ,' + first_name + ' ' + last_name;
                $(`#vote-${voting_rezult[item]['proposal']}`).attr('title',text.replace('- ,',''));
            }
        });

        $('.list-card').off();
        refresh_status_voting();
            $('[data-toggle="tooltip"]').tooltip();
            $('.card').css('cursor','auto')
        setTimeout('get_data_results_voting(true)',5000);
    }

}

$(document).ready(function () {
    let all_cart =  $('.list-card');
    all_cart.on('click','.card', on_card);
    all_cart.on('click','.btn-vote',on_voting);
    get_data_results_voting();

});
