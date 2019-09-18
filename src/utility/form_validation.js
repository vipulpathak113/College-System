import $ from 'jquery'
import validators from '../config/validators'

class validate {
    constructor() {
    }
    form(formname, app_mandatory_fields){

        var error_response = {
            error:false,
            fields:[], //{id:elementid,message:message}
        };
        $('#' + formname + ' input').map(function(i, element_to_validate){
            var is_required = element_to_validate.required? true : app_mandatory_fields.includes(element_to_validate.id) ? true : false;

            if(element_to_validate.type === "radio"){
              let radio_element = element_to_validate;
              if($('input:radio[name="' + element_to_validate.name + '"]:checked')[0] === undefined){
                element_to_validate = $('<input type="radio" id="' + radio_element.name + '" value="">');
                element_to_validate.id = radio_element.name;
                is_required = true;
              }else{
                element_to_validate = $('<input type="radio" id="' + radio_element.name + '" value="' + $(radio_element).val() +'">');
                element_to_validate.id = radio_element.name;
              }
            }


            if(element_to_validate && $(element_to_validate).val().length > 0){
                let validation_type = $(element_to_validate).attr("data-validation");
                if(validation_type){
                    let rules = validators[validation_type];
                    let any_rule_failed = false;
                    $.each(rules,function(i, rule){

                        if(rule.re.test($(element_to_validate).val()) === false){
                            error_response.error = true;
                            any_rule_failed = true;
                            error_response["fields"].push({
                                "id"        : element_to_validate.id,
                                "message"   : rule.message //TODO for translation
                            });
                        }
                    });

                    if(any_rule_failed === false){
                        error_response["fields"].push({
                            "id"        : element_to_validate.id,
                            "message"   : "" //Setting this to blank to reset messages
                        });
                    }

                }else{

                    error_response["fields"].push({
                        "id"        : element_to_validate.id,
                        "message"   : "" //Setting this to blank to reset messages
                    });

                }

            }else if(element_to_validate && $(element_to_validate).val() === "" && is_required){
                error_response.error = true;
                error_response["fields"].push({
                    "id"        : element_to_validate.id,
                    "message"   : validators["REQUIRED"].message //TODO for translation
                });
            }
        });

        return error_response;
    }
}

export default (new validate());
