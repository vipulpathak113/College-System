import React from 'react'
import easygov from './network'
import store from './store'
import bootupsettings from '../models/bootupsettings'
import get_service_details from './get_service_details'

var response
const get_user_documents_api = (callback) => {
  easygov.send_get_request("GET", bootupsettings.ENDPOINTS.GET_USER_DOCS, "GET_USER_DOCS", function (response, component) {
  })
  store.subscribe(() => {
    var response = store.getState()
    if (response.type === "GET_USER_DOCS"){
      if(response.code === 200) {
        callback(response.data.user_service_docs)
      }
      else {
        callback(401)
      }
    }
  })
}

export default get_user_documents_api;
