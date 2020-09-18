let voting_rezult;

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
     <p class="card-text">${data['menu']}</p>
   </div>
  </div>
</div>`
}

function render_list_voting(data){
    $('.list-card').append($(`<div class="col mb-4">${generate_cart_t(data)}</div>`));
}


function on_card(e){
    $('.button-filed').html('')
    $(this).find('.button-filed').append($('<input class="btn-vote btn btn-success" type="button" value="vote">'))
}
function on_voting(e){
    let proposal = ($(this).closest('.card').attr('id')).replace('vote-','')
    send_ajax_request('/lunch/vote/','POST',JSON.stringify({proposal:proposal}),
        function (data) {
            $('.button-filed').html('')
            get_data_results_voting(false);
            $('.list-card').off();
        },function (err) {
            console.log(err['responseJSON'])
        },"application/json; charset=utf-8");
}

function get_data_for_cart(){
    send_ajax_request('/lunch/current-voting/','GET',null,
        function (data) {
            (data['proposal']).forEach(function (item) {
                render_list_voting(item);

            });
            user_results_view();

        },
        function (err) {

        });
}

function get_data_results_voting(render_cart=true){
    send_ajax_request('/lunch/results-voting/','GET',null,
        function (data) {
            let fix_data = {}
            Object.keys(data).forEach(function (item) {
                fix_data[data[item]['user']['username']] = data[item];
            });

            voting_rezult = fix_data;
            user_results_view();
            if (render_cart)
                get_data_for_cart();
        },
        function (err) {

        });
}

function user_results_view(){
    $('.voted-users').html('')
    let username = $('.this-user').text()
    if(username in voting_rezult){
        Object.keys(voting_rezult).forEach(function (item) {
            let first_name = voting_rezult[item]['user']['first_name'];
            let last_name = voting_rezult[item]['user']['first_name'];
            $(`#vote-${voting_rezult[item]['proposal']}`).find('.voted-users').append(
                `<div><small class="text-muted">${item} ${first_name} ${last_name}</small></div>`
            );
        });
        $('.list-card').off();
    }

}

$(document).ready(function () {
    let all_cart =  $('.list-card');
    all_cart.on('click','.card', on_card);
    all_cart.on('click','.btn-vote',on_voting);
    get_data_results_voting();
    setInterval('get_data_results_voting(false)',9000);


});