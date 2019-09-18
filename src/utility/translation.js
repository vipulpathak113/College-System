import urlKeys from '../config/urlKeys'
import CryptoJS from 'crypto-js'
import $ from 'jquery'

let translation = {
        translation(jsonData, languageCode) {
                var arrayToBeMatched = [
                  "data:objects:status_name",
                  "data:objects:service_category_name",
                  "data:objects:serviceName",
                  "data:beneficiaries:name",
                  "data:family_profiles:relationship",
                  "data:qualified_schemes:objects:service__service_category__name",
                  "data:qualified_schemes:objects:benefits_list:benefit",
                  "message",
                  "data:status_data:label",
                  "current_district",
                  "district_list:state_name",
                  "district_list:district_name",
                  "service_list:service:name",
                  "service_list:service:benefits",
                  "service_list:category:name",
                  "district_info:current_district",
                  "district_info:current_state",
                  "data:objects:service:name",
                  "data:objects:service:benefits",
                  "data:objects:category:name",
                  "data:user_service_docs:document_type__name",
                  "data:objects:service:category:name",
                  "data:fieldsData:fieldDisplayName",
                  "data:fieldsData:displayName",
                  "data:fieldsData:val",
                  "data:fieldsData:options:value",
                  "data:objects:district_name",
                  "data:objects:state_name",
                  "data:fields:fieldDisplayName",
                  "data:fields:docTypes:docs:name",
                  "data:fields:val",
                  "data:fields:options:value",
                  "data:field_data:displayName",
                  "data:field_data:value",
                  "data:field_data:options:text",
                  "data:field_data:options:displayName",
                  "data:qualified_schemes:objects:service__name",
                  "data:qualified_schemes:objects:benefits",
                  "data:qualified_schemes:objects:service__analysis",
                  "data:qualified_schemes:objects:service__benefits",
                  "data:field_data:displayName",
                  "data:field_data:options:text",
                ];



                var parentkey = "";
                var keyword = "translate_"
                var array = [];
                var IsTranslation = false;

                var arrayToBeTranslated = [];
                var arrayOfHashMap = {};
                createHashMapFromJsonString(jsonData, parentkey,translated_response_dict);

                function createHashMapFromJsonString(jsonData, parentkey,translated_response_dict) {
                    var localkey = "";
                    for (var key in jsonData) {
                        if (jsonData.hasOwnProperty(key)) {

                            if (jsonData[key] instanceof Array) {
                                localkey += key;

                                for (var i = 0; i < jsonData[key].length; i++) {
                                    createHashMapFromJsonString(jsonData[key][i], parentkey + localkey + ":",translated_response_dict);
                                }
                            } else if (jsonData[key] instanceof Object) {
                                localkey += key + "";

                                createHashMapFromJsonString(jsonData[key], parentkey + localkey + ":",translated_response_dict);
                            } else {

                                    if (IsTranslation === false){
                                    var value = jsonData[key];
                                    var hash_value;

                                    if (arrayToBeMatched.includes((parentkey + key))) {
                                    value =  value
                                    hash_value = CryptoJS.MD5(value).toString(CryptoJS.enc.Hex)

                                    jsonData[keyword + key] = hash_value + "____" + jsonData[key];
                                    var old_key = key;

                                    Object.defineProperty(jsonData, old_key, Object.getOwnPropertyDescriptor(jsonData, old_key));
                                    delete jsonData[old_key];
                                    if(arrayOfHashMap[hash_value] !=hash_value){
                                       arrayToBeTranslated.push(hash_value);
                                       arrayOfHashMap[hash_value]=hash_value;
                                }
                                } else {

                                    continue;

                                }
                                     }else {
                                             var value = jsonData[key];
                                              var hash_value;
                                              var flag = 0;

                                             if (key.includes("translate_")) {
                                                    var array = [];
                                                    array = jsonData[key].split("____");

                                                    for (var j in translated_response_dict) {
                                                      if (j.includes(array[0])) {
                                                      flag = 1;
                                                      jsonData[key] = translated_response_dict[j];
                                                      Object.defineProperty(jsonData, key.replace('translate_', ''), Object.getOwnPropertyDescriptor(jsonData, key));
                                                      delete jsonData[key];
                                        }
                                    }
                                    if (flag === 0) {
                                        jsonData[key] = array[1];
                                        Object.defineProperty(jsonData, key.replace('translate_', ''), Object.getOwnPropertyDescriptor(jsonData, key));
                                        delete jsonData[key];
                                        flag = 0;
                                    }

                                }
                                }
                             }
                        }
                        localkey = "";
                    }

                    return jsonData;

                }

                var value = JSON.stringify(jsonData);
                var  formData = {
                    "language": languageCode,
                    "hashvalues": arrayToBeTranslated
                 }

                var translated_response_dict = {};
                var response_object = "";
                //"http://staging.easygov.co.in/translation/"
                $.ajax({
                    type: 'POST',
                    url: urlKeys.translation,
                    contentType: 'application/json',
                    data: JSON.stringify(formData),
                    async: false,
                    complete: function(value) {
                        var result = {};
                        response_object = value.responseJSON.data;
                        IsTranslation = true;
                        make_translated_response_dict();
                         }
                     });

                 var  parentkey = "";

                function make_translated_response_dict() {
                    translated_response_dict = response_object;
                    createHashMapFromJsonString(jsonData, parentkey, translated_response_dict);
                }
        return jsonData;
      }
}

export default translation;
