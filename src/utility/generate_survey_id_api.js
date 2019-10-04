import React from 'react'
import storage from './encrypt_data'
import keys from '../models/localStorage-keys'
import url_utility from './url'
import website_urls from './website_urls'
import network from './network'
import store from './store'
import bootupsettings from '../models/bootupsettings'
import get_service_details from './get_service_details'
import urlKeys from '../config/urlKeys'


const generate_survey_id_api = (users_choice, callback) => {
  console.log("in genere");
  network.send(bootupsettings.ENDPOINTS.GENERATE_SURVEY_ID, length, "GENERATE_SURVEY_ID", function (response, component) {})

  store.subscribe(() => {
    let aadhaar = JSON.parse(storage.getItemValue(keys.APP_PREFERENCE.GET_SETTINGS)).is_aadhaar_enabled
    var params = url_utility.params.get_param()
    var response = store.getState()
    if (response.type === "GENERATE_SURVEY_ID") {
      if (response.code === 200) {
        storage.removeItemValue(keys.APP_PREFERENCE.CURRENT_SURVEY_MATCH_MODEL)
        storage.removeItemValue(keys.APP_PREFERENCE.PREVIOUS_SURVEY_MATCH_MODEL)
        storage.setItemValue(keys.USER_PREFERENCE.APPLY_FOR, users_choice)
        var id = JSON.parse(JSON.stringify(response)).data.survey_id
        if (params.category) {
          if(users_choice === 'myself'){
            // if (storage.getItemValue(keys.USER_PREFERENCE.IS_AADHAAR) === "1" || aadhaar === "0") {
              var selectedService = get_service_details(params['service_id'])
              if(selectedService.category.scheme === false){
                website_urls.qualification_survey_with_user_choice(id)
              }
              else {
                website_urls.qualification_survey_with_user_choice(id)
              }
            // }
          }
          else {
            if(users_choice === "someone-else"){
              website_urls.member_with_survey(id)
              // to call popup of add member
              // callback("someone-else");
            }
            else {
              website_urls.family_member_with_survey(id)
              // to call popup of add family member
              callback("family-member")
            }
          }
        }

        // For Entitlement : it is commented as now the flow is redirected directly to survey page if user selects general survey
        else if(!params.category){
          if(users_choice === 'myself'){
            website_urls.qualification_survey_without_user_choice(id)
          }
          if(users_choice === 'someone-else'){
            website_urls.member_without_survey(id)
            // website_urls.member(id)
          }
          if(users_choice === 'family-member'){
            website_urls.family_member_without_survey(id)
          }

        }
      }

      else if (response.code === 401) {
        callback(401)
      }
    }
  })
}

export default generate_survey_id_api;









// It is commented because Aadhaar is not applicable for network website.
// else {
// 	url = "/" + storage.getItemValue(keys.USER_PREFERENCE.CURRENT_DISTRICT) +
// 					urlKeys.user_story + urlKeys.apply_for + users_choice +
// 					urlKeys.having_aadhaar + url_utility.params.set_param(urlKeys.category,url_utility.escape_html(params.category)) +
// 					url_utility.params.set_param(urlKeys.service,url_utility.escape_html(params.service)) + "&" +
// 					url_utility.params.set_param(urlKeys.service_id, params[urlKeys.service_id]) +
// 					"&" + url_utility.params.set_param(urlKeys.survey_id, id);
// }



// if (storage.getItemValue(keys.USER_PREFERENCE.IS_AADHAAR) === "1" || aadhaar === "0") {
// url = "/" + storage.getItemValue(keys.USER_PREFERENCE.CURRENT_DISTRICT) + urlKeys.user_story +
// 			urlKeys.apply_for + users_choice +
// 			urlKeys.applicant_details + "/?" + url_utility.params.set_param(urlKeys.survey_id, id)
// }
// else {
// 	url = "/" + storage.getItemValue(keys.USER_PREFERENCE.CURRENT_DISTRICT) +
// 				urlKeys.user_story + urlKeys.apply_for + choice +
// 				urlKeys.having_aadhaar + "/?" + url_utility.params.set_param(urlKeys.survey_id, id)
// }
