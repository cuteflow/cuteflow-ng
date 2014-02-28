$(function() {
    $('#type').change(function() {
        var template = null;
        switch($(this).val()) {
            case 'text': template = _.template($('#type-text-template').html(), {}); break;
            case 'textarea': template = _.template($('#type-textarea-template').html(), {}); break;
            case 'checkbox': template = _.template($('#type-checkbox-template').html(), {}); break;
            case 'select': template = _.template($('#type-select-template').html(), {}); break;
            case 'file': template = _.template($('#type-file-template').html(), {}); break;
            case 'radiogroup': template = _.template($('#type-radio-template').html(), {}); break;
            case 'checkboxgroup': template = _.template($('#type-checkboxgroup-template').html(), {}); break;
            case 'date': template = _.template($('#type-date-template').html(), {}); break;
            case 'number': template = _.template($('#type-number-template').html(), {}); break;
        }

        if (template != null) {
            $("#type-config").html(template);
        }
    });
});

