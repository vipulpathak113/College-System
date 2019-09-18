import urlKeys from '../config/urlKeys'
import storage from './encrypt_data'
import url_utility from './url'
import keys from '../models/localStorage-keys'

var params = url_utility.params.get_param()
var district_name = storage.getItemValue(keys.USER_PREFERENCE.CURRENT_DISTRICT)

var website_urls = {
  self_declaration : function(){
    window.location.href = "/" + district_name + urlKeys.user_story +
                            urlKeys.apply_for + storage.getItemValue(keys.USER_PREFERENCE.APPLY_FOR) + urlKeys.apply_service + urlKeys.self_declaration +
                            url_utility.params.set_param(urlKeys.category, url_utility.escape_html(params.category)) +
                            url_utility.params.set_param(urlKeys.service, url_utility.escape_html(params.service)) +
                            "&" + url_utility.params.set_param(urlKeys.service_id, params[urlKeys.service_id]) +
                            "&" + url_utility.params.set_param(urlKeys.survey_id, params[urlKeys.survey_id])
  },
  apply_for : function(category_name, serviceName, service_id){
    window.location.href = "/" + storage.getItemValue(keys.USER_PREFERENCE.CURRENT_DISTRICT) + urlKeys.user_story +
                            urlKeys.apply_for + storage.getItemValue(keys.USER_PREFERENCE.APPLY_FOR) + urlKeys.apply_service + urlKeys.self_declaration +
                            url_utility.params.set_param(urlKeys.category, url_utility.escape_html(params.category)) +
                            url_utility.params.set_param(urlKeys.service, url_utility.escape_html(params.service)) +
                            "&" + url_utility.params.set_param(urlKeys.service_id, params[urlKeys.service_id]) +
                            "&" + url_utility.params.set_param(urlKeys.survey_id, params[urlKeys.survey_id])
  },
  application_page : function(survey_id){
    window.location.href = "/" + storage.getItemValue(keys.USER_PREFERENCE.CURRENT_DISTRICT) + urlKeys.user_story +
                            urlKeys.apply_for + storage.getItemValue(keys.USER_PREFERENCE.APPLY_FOR) + urlKeys.apply_service + urlKeys.documents +
                            url_utility.params.set_param(urlKeys.category,url_utility.escape_html(params.category)) +
                            url_utility.params.set_param(urlKeys.service,url_utility.escape_html(params.service)) +
                            "&" + url_utility.params.set_param(urlKeys.service_id, params[urlKeys.service_id]) +
                            "&" + url_utility.params.set_param(urlKeys.survey_id, survey_id)
  },
  qualification_survey_with_user_choice : function(survey_id){
    window.location.href = "/" + storage.getItemValue(keys.USER_PREFERENCE.CURRENT_DISTRICT) +
                            urlKeys.user_story + urlKeys.apply_for + storage.getItemValue(keys.USER_PREFERENCE.APPLY_FOR) +
                            urlKeys.apply_service + url_utility.params.set_param(urlKeys.category, url_utility.escape_html(params.category)) +
                            url_utility.params.set_param(urlKeys.service, url_utility.escape_html(params.service)) + "&" +
                            url_utility.params.set_param(urlKeys.service_id, params[urlKeys.service_id]) +
                            "&" + url_utility.params.set_param(urlKeys.survey_id, survey_id)
  },
  qualification_survey_without_user_choice : function(survey_id){
    window.location.href = "/" + storage.getItemValue(keys.USER_PREFERENCE.CURRENT_DISTRICT) +
                            urlKeys.user_story + urlKeys.apply_for + storage.getItemValue(keys.USER_PREFERENCE.APPLY_FOR) +
                            urlKeys.apply_service + "/?" + url_utility.params.set_param(urlKeys.survey_id, survey_id)
  },
  kyc_page : function(){
    window.location.href = "/" + storage.getItemValue(keys.USER_PREFERENCE.CURRENT_DISTRICT) + urlKeys.user_story + urlKeys.apply_for +
                            storage.getItemValue(keys.USER_PREFERENCE.APPLY_FOR) + urlKeys.applicant_details +
                            url_utility.params.set_param(urlKeys.category,url_utility.escape_html(params.category)) +
                          	url_utility.params.set_param(urlKeys.service,url_utility.escape_html(params.service)) + "&" +
                          	url_utility.params.set_param(urlKeys.service_id, params[urlKeys.service_id]) +
                          	"&" + url_utility.params.set_param(urlKeys.survey_id, params[urlKeys.survey_id]);

  },
  application_type : function(){
    window.location.href = "/" + storage.getItemValue(keys.USER_PREFERENCE.CURRENT_DISTRICT) + urlKeys.user_story + urlKeys.apply_for +
                            storage.getItemValue(keys.USER_PREFERENCE.APPLY_FOR) + urlKeys.application_type +
                            url_utility.params.set_param(urlKeys.category,url_utility.escape_html(params.category)) +
                          	url_utility.params.set_param(urlKeys.service,url_utility.escape_html(params.service)) + "&" +
                          	url_utility.params.set_param(urlKeys.service_id, params[urlKeys.service_id]) +
                          	"&" + url_utility.params.set_param(urlKeys.survey_id, params[urlKeys.survey_id]);

  },
  family_member_with_survey : function(survey_id){
    window.location.href = "/" + storage.getItemValue(keys.USER_PREFERENCE.CURRENT_DISTRICT) + urlKeys.family_member +
                            url_utility.params.set_param(urlKeys.category,url_utility.escape_html(params.category)) +
                            url_utility.params.set_param(urlKeys.service,url_utility.escape_html(params.service)) + "&" +
                            url_utility.params.set_param(urlKeys.service_id, params[urlKeys.service_id]) +
                            "&" + url_utility.params.set_param(urlKeys.survey_id, survey_id)

  },
  family_member_without_survey : function(survey_id){
    window.location.href = "/" + storage.getItemValue(keys.USER_PREFERENCE.CURRENT_DISTRICT) + urlKeys.family_member + "/?" +
                            url_utility.params.set_param(urlKeys.survey_id, survey_id)

  },
  member_with_survey : function(survey_id){
    window.location.href = "/" + storage.getItemValue(keys.USER_PREFERENCE.CURRENT_DISTRICT) + urlKeys.member +
                            url_utility.params.set_param(urlKeys.category,url_utility.escape_html(params.category)) +
                            url_utility.params.set_param(urlKeys.service,url_utility.escape_html(params.service)) + "&" +
                            url_utility.params.set_param(urlKeys.service_id, params[urlKeys.service_id]) +
                            "&" + url_utility.params.set_param(urlKeys.survey_id, survey_id)

  },
  member_without_survey : function(survey_id){
    window.location.href = "/" + storage.getItemValue(keys.USER_PREFERENCE.CURRENT_DISTRICT) + urlKeys.member + "/?" +
                            url_utility.params.set_param(urlKeys.survey_id, survey_id)
  }
}

export default website_urls;
