const fields_input_object = {
    table_users: {
        view_form: {
            'username': get_input_form ,
            'first_name': get_input_form ,
            'last_name': get_input_form ,
            'email': get_input_form ,
            'is_active': get_checkbox_input_form ,
        },
        view_table: {
            'pk': get_row_view ,
            'username': get_row_view ,
            'first_name': get_row_view ,
            'last_name': get_row_view ,
            'email': get_row_view ,
            'is_active': get_checked_view ,
            'submit_user': get_submit_btn_view ,
        }
    },
    table_restaurant: {
        view_form:{
            'logo': get_input_file_form , //file
            'name': get_input_form ,
            'notes': get_input_form ,
        },
        view_table:{
            'logo': get_img_view ,
            'name': get_row_view ,
            'notes': get_row_view ,
            'submit_restaurant': get_submit_btn_view ,
        }
    }
};

let data_obtained_user_list = [];
let edit_field_id;