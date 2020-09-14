
function add_table(name){
    let $table = $(`#table-${name}`);
    $table.on('click', `.edit-submit_${name}-btn` ,{name_table: `table_${name}`} ,on_generating_for_edit_form);
    $table.on('click','.cancel-btn', cancel_changes);
    $(`#table-edit-form-${name}`).on('submit', on_edit_form_submit)
    $(`#add-${name}-form`).on('submit', {name_table: `table_${name}`}, on_add_form_submit);
    refresh_table(name);
}
function init_checkbox_to_voting(){
     $('#add_voting').hide();
    $('#table-edit-form-proposal').on('click', '.checkbox-voting',function (e) {
        let checkboxes = $('.checkbox-voting')
         $('#add_voting').hide();
        Object.keys(checkboxes).forEach(function (item) {
            if($(checkboxes[item]).is(":checked"))
                $('#add_voting').show();

        });
    });

    $(`#add_voting`).click(function (e) {
        let checked = $(`.selected_proposal_value`);
        let proposal = [];
        Object.keys(checked).forEach(function (items) {
            let checkbox = $(checked[items]).children('input')
            if(checkbox.is(":checked")){
                proposal.push(Number(checkbox.closest("tr").attr("id").replace(`row_table_proposal_`,'')));
            }
        });
        send_ajax_request('/lunch/voting/','POST',JSON.stringify({proposal:proposal}),function (data) {
            console.log(data)
            Object.keys(checked).forEach(function (items) {
                $(checked[items]).children('input').prop('checked', false)
            });
        },function (err) {
            global_err_messages(err['responseJSON']);
        },"application/json; charset=utf-8")
    });
}

$(document).ready(function () {
    add_table('restaurant')
    add_table('users')
    add_table('proposal')
    add_table('voting')
    init_field_proposal('table_restaurant')
    init_checkbox_to_voting();

});
