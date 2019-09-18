import keys from '../models/localStorage-keys'
import CryptoJS from 'crypto-js'

var encryption_phrase = "JuTB9t76b84fk"
var local_storage = {
  setItemValue(itemName, itemValue){
    let encryptedItemValue = CryptoJS.AES.encrypt(itemValue, encryption_phrase);
    localStorage.setItem(itemName, encryptedItemValue)
  },

  getItemValue(itemName){
    if(localStorage.getItem(itemName)){
      let bytes  = CryptoJS.AES.decrypt(localStorage.getItem(itemName).toString(), encryption_phrase);
      let decryptedItemValue = bytes.toString(CryptoJS.enc.Utf8);
      return decryptedItemValue
    }
    else {
      return null
    }
  },

  removeItemValue(itemName){
    localStorage.removeItem(itemName)
  },

  setCookies(itemName, itemValue){
    let encryptedItemValue = CryptoJS.AES.encrypt(itemValue, encryption_phrase);
    let expiry_in_days = 7
    var d = new Date();
    d.setTime(d.getTime() + (expiry_in_days*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = itemName + "=" + encryptedItemValue  + ";" + expires + ";path=/;"
  },

  getCookies(itemName){
    var result;
    let value = (result = new RegExp('(?:^|; )' + encodeURIComponent(itemName) + '=([^;]*)').exec(document.cookie)) ? (result[1]) : null;
    if(value){
      let bytes  = CryptoJS.AES.decrypt(value.toString(), encryption_phrase);
      let decryptedItemValue = bytes.toString(CryptoJS.enc.Utf8);
      return decryptedItemValue
    }
    else {
      return null;
    }
  }
}

export default local_storage;
