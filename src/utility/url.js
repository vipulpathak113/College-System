import _ from 'lodash'
import storage from './encrypt_data'
import URI from 'URIjs'

var url_to_parse, query, field = {}
var url = {
  escape_html(url_to_modify) {
    if(url_to_modify){
      return url_to_modify
      .replace(/&/g, "%26")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/\//g,"-");
    }
  },
  params : {
    get_param:function(){
      url_to_parse = URI(window.location.href)
      query = url_to_parse.query(true)
      for(var propertyName in query) {
        if(_.includes(propertyName, "userapp_")){
          field[propertyName] = storage.perform_decryption(query[propertyName]) //return with decrytp
        }else{
          field[propertyName] =  query[propertyName] // retrun without decrypt
        }
      }
      return field
    },
    set_param:function(key, value){
      if(_.includes(key, "userapp_")){
        return key + "=" + encodeURIComponent(storage.perform_encryption(value))
      }else{
        return key + "=" + value
      }
    }
  }
  // return params;
}
export default url;
