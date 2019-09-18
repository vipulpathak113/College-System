import CryptoJS from 'crypto-js'

var encryption_phrase = "JuTB9t76b84fk"
var local_storage = {
  // -------------------------------- STORING DATA IN LOCAL STORAGE -------------------------------
  setItemValue(itemName, itemValue){
    let encryptedItemValue = CryptoJS.AES.encrypt(itemValue.toString(), encryption_phrase);
    localStorage.setItem(itemName, encryptedItemValue)
  },

  // -------------------------------- READING DATA FROM LOCAL STORAGE -------------------------------
  getItemValue(itemName){
    if(localStorage.getItem(itemName)){
      let bytes  = CryptoJS.AES.decrypt(localStorage.getItem(itemName), encryption_phrase);
      let decryptedItemValue = bytes.toString(CryptoJS.enc.Utf8);
      return decryptedItemValue
    }
    else {
      return null
    }
  },
  // -------------------------------- REMOVE DATA FROM LOCAL STORAGE -------------------------------

  removeItemValue(itemName){
    localStorage.removeItem(itemName)
  },

  // -------------------------------- SET DATA TO COOKIES -------------------------------
  setCookies(itemName, itemValue){
    let encryptedItemValue = CryptoJS.AES.encrypt(itemValue, encryption_phrase);
    let expiry_in_days = 7
    var d = new Date();
    d.setTime(d.getTime() + (expiry_in_days*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = itemName + "=" + encryptedItemValue  + ";" + expires + ";path=/;"
  },

  // -------------------------------- READ COOKIES DATA -------------------------------
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
  },

  // -------------------------------- DELETE COOKIES FROM SYSTEM -------------------------------
  removeCookies(){
    document.cookie.split(";").forEach(function(c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
  },

  // -------------------------------- ENCRYPT DATA -------------------------------
  perform_encryption(itemValue){
    return encodeURIComponent(CryptoJS.AES.encrypt(itemValue.toString(), encryption_phrase))
  },

  // -------------------------------- DECRYPT DATA -------------------------------
  perform_decryption(itemValue){
    let bytes  = CryptoJS.AES.decrypt(decodeURIComponent(itemValue), encryption_phrase);
    let decryptedItemValue = bytes.toString(CryptoJS.enc.Utf8);
    return decryptedItemValue
  }
}

export default local_storage;
