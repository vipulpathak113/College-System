import storage from '../utility/encrypt_data'
import keys from './localStorage-keys'

var id = ""
if(storage.getItemValue(keys.USER_PREFERENCE.BENEFICIARY_TYPE_ID)){
  id = storage.getItemValue(keys.USER_PREFERENCE.BENEFICIARY_TYPE_ID)
}
else {
  storage.setItemValue(keys.USER_PREFERENCE.BENEFICIARY_TYPE_ID, 1)
  id="1"
}
const length = {
    "size": 1000 ,
    "geographyId" : "",
    "beneficiaryTypeId" : id
}

export default length;
