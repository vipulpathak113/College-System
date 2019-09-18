import React from 'react'
import storage from './encrypt_data'
import keys from '../models/localStorage-keys'

const get_service_details = (sgmId) => {
  let all_service_data = JSON.parse(storage.getItemValue(keys.APP_PREFERENCE.SERVICE_LIST_ALL))
  let selected_service = all_service_data.find((item) => (item.sgmId === JSON.parse(sgmId)))
  return selected_service
}

export default get_service_details;
