let voting_rezult = {};
let data_vote;
function generate_cart_t(data) {
    return `<div id="vote-${data['pk']}" class="card mb-3" style="max-width: 540px;">
  <div class="row no-gutters">
    <div class="col-md-4">
      <img src="${data['restaurant']['logo']}" class="card-img" alt="...">
    </div>
    <div class="col-md-8">
      <div class="card-body">
        <small class="text-muted">suffrage:</small>
        <div class="voted-users"></div>
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

function render_list_voting(data){
    $('.list-card').append($(`<div class="col mb-4">${generate_cart_t(data)}</div>`));
}


function on_card(e){
    $('.button-filed').html('')
    $(this).find('.button-filed').append($('<input class=" btn btn-vote btn-sm btn-success" type="button" value="vote">'))
}

function on_voting(e){
    let proposal = ($(this).closest('.card').attr('id')).replace('vote-','')
    send_ajax_request('/lunch/vote/','POST',JSON.stringify({proposal:proposal}),
        function (data) {
            $('.button-filed').html('')
            get_data_results_voting(false);
            $('.list-card').off();
            document.cookie = `voice = ${data_vote['pk']}`
        },function (err) {
            console.log(err['responseJSON'])
        },"application/json; charset=utf-8");
}

function get_data_for_cart(){
    send_ajax_request('/lunch/current-voting/','GET',null,
        function (data) {
            $('.voting-message').html('');
            (data['proposal']).forEach(function (item) {
                render_list_voting(item);

            });
            data_vote = data;
            user_results_view();

        },
        function (err) {
            $('.voting-message').html('');
            $('.voting-message').append($('<div class="message"> <h2>Voting has not started yet! :)</h2> </div>'))
            setTimeout(get_data_results_voting,9000);
        });
}


function get_data_results_voting(render_cart=true){
    let url = '/lunch/results-voting/';
    if(!$.isEmptyObject(voting_rezult) && voting_rezult['next'] != null){
        url = voting_rezult['next']
    }
        send_ajax_request(url,'GET',null,
            function (data) {
                voting_rezult['next'] = data['next'];
                if((data['results']).length > 0) {
                    Object.keys(data['results']).forEach(function (item) {
                        let username = data.results[item]['user']['username'];
                        let data_user = data['results'][item]
                        voting_rezult[username] = data_user;
                    });
                    if(voting_rezult['next'] != null)
                        get_data_results_voting(render_cart,false);
                }
                console.log(voting_rezult)
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
            console.log(voting_rezult[item],232)
            if(item !== 'next'){
                let first_name = voting_rezult[item]['user']['first_name'];
                let last_name = voting_rezult[item]['user']['first_name'];
                $(`#vote-${voting_rezult[item]['proposal']}`).find('.voted-users').append(
                    `<div><small class="text-muted">${item} ${first_name} ${last_name}</small></div>`
                );
            }
        });
        $('.list-card').off();
        setTimeout('get_data_results_voting(false)',9000);
    }

}

$(document).ready(function () {
    let all_cart =  $('.list-card');
    all_cart.on('click','.card', on_card);
    all_cart.on('click','.btn-vote',on_voting);
    get_data_results_voting();


});