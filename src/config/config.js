import keys from '../models/localStorage-keys'
import storage from '../utility/encrypt_data'

var selected_language
class languagetype  {
  constructor() {
    if(storage.getItemValue(keys.USER_PREFERENCE.LANGUAGE)){
      selected_language = JSON.parse(storage.getItemValue(keys.USER_PREFERENCE.LANGUAGE)).code;
    }
    else {
      selected_language = "en"
    }

    switch(selected_language){
      case "hi":
              this.language = require('./language_hi.js');
              break;

      default:
              this.language = require('./language_en.js');
              break;
       }
   }
}

export default (new languagetype().language.default);
