import store from "./store";
import keys from "../models/localStorage-keys";
import $ from "jquery";
import storage from "../utility/encrypt_data";
import translation from "./translation";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
let base64 = require("base-64");

var token,
  email,
  password,
  languageCode = "en";
NProgress.configure({ showSpinner: false });
class network {
  sendpost(endpoint, formdata, actionType) {
    if (storage.getCookies(keys.USER_PREFERENCE.TOKEN)) {
      token = storage.getCookies(keys.USER_PREFERENCE.TOKEN);
      email = storage.getCookies(keys.USER_PREFERENCE.EMAIL);
      password = storage.getCookies(keys.USER_PREFERENCE.PASSWORD);
    } else {
      token = " ";
      email: "";
      password: "";
    }
    // debugger;
    store.dispatch({ type: "API_CALL", value: true });
    if (actionType !== "SIGNIN") {
      NProgress.start();
    }
    $.ajax({
      url: endpoint,
      type: "POST",
      dataType: "json",
      contentType: "application/json; charset=utf-8",
      enctype: "multipart/form-data",
      data: JSON.stringify(formdata),
      headers: {
        Authorization: "Basic " + btoa(email + ":" + password),
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      success: function(response) {
        console.log("------------", response);
        if (response === undefined) {
          var res = {};
          res["type"] = actionType;
          store.dispatch({ type: "API_CALL", value: false });
          store.dispatch(res);
          NProgress.done();
        }
      },
      error: function(response) {
        console.log("------------", response);
        store.dispatch({
          type: "RESPONSE_FAILED",
          value: true,
          response: response.responseJSON.errors
        });
        NProgress.done();
      }
    });
  }

  send(endpoint, formdata, actionType) {
    if (storage.getCookies(keys.USER_PREFERENCE.TOKEN)) {
      token = storage.getCookies(keys.USER_PREFERENCE.TOKEN);
      email = storage.getCookies(keys.USER_PREFERENCE.EMAIL);
      password = storage.getCookies(keys.USER_PREFERENCE.PASSWORD);
    } else {
      token = " ";
      email: "";
      password: "";
    }
    // debugger;
    store.dispatch({ type: "API_CALL", value: true });
    if (actionType !== "SIGNIN") {
      NProgress.start();
    }
    $.ajax({
      url: endpoint,
      type: "GET",
      dataType: "json",
      contentType: "application/json; charset=utf-8",
      enctype: "multipart/form-data",
      data: formdata,
      headers: {
        Authorization: "Basic " + btoa(email + ":" + password),
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      success: function(response) {
        console.log("------------", response);
        response["type"] = actionType;
        store.dispatch({ type: "API_CALL", value: false });
        store.dispatch(response);
        NProgress.done();
      },
      error: function(response) {
        console.log("------------", response);
        store.dispatch({
          type: "RESPONSE_FAILED",
          value: true,
          response: response.responseJSON.errors
        });
        NProgress.done();
      }
    });
  }

  sendGet(endpoint, formdata, actionType) {
    if (storage.getCookies(keys.USER_PREFERENCE.TOKEN)) {
      token = storage.getCookies(keys.USER_PREFERENCE.TOKEN);
      email = storage.getCookies(keys.USER_PREFERENCE.EMAIL);
      password = storage.getCookies(keys.USER_PREFERENCE.PASSWORD);
    } else {
      token = " ";
      email: "";
      password: "";
    }
    // debugger;
    store.dispatch({ type: "API_CALL", value: true });
    if (actionType !== "SIGNIN") {
      NProgress.start();
    }
    $.ajax({
      url: endpoint + "/" + formdata,
      type: "GET",
      dataType: "json",
      contentType: "application/json; charset=utf-8",
      enctype: "multipart/form-data",
      data: JSON.stringify(formdata),
      headers: {
        Authorization: "Basic " + btoa(email + ":" + password),
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      success: function(response) {
        console.log("------------", response);
        response["type"] = actionType;
        store.dispatch({ type: "API_CALL", value: false });
        store.dispatch(response);
        NProgress.done();
      },
      error: function(response) {
        console.log("------------", response);
        store.dispatch({
          type: "RESPONSE_FAILED",
          value: true,
          response: response.responseJSON.errors
        });
        NProgress.done();
      }
    });
  }

  sendPatch(endpoint, formdata, actionType) {
    if (storage.getCookies(keys.USER_PREFERENCE.TOKEN)) {
      token = storage.getCookies(keys.USER_PREFERENCE.TOKEN);
      email = storage.getCookies(keys.USER_PREFERENCE.EMAIL);
      password = storage.getCookies(keys.USER_PREFERENCE.PASSWORD);
    } else {
      token = " ";
      email: "";
      password: "";
    }
    // debugger;
    store.dispatch({ type: "API_CALL", value: true });
    if (actionType !== "SIGNIN") {
      NProgress.start();
    }
    $.ajax({
      url: endpoint + "/" + formdata.id,
      type: "PATCH",
      dataType: "json",
      contentType: "application/json; charset=utf-8",
      enctype: "multipart/form-data",
      data: JSON.stringify(formdata),
      headers: {
        Authorization: "Basic " + btoa(email + ":" + password),
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      success: function(response) {
        console.log("------------", response);
        response["type"] = actionType;
        store.dispatch({ type: "API_CALL", value: false });
        store.dispatch(response);
        NProgress.done();
      },
      error: function(response) {
        console.log("------------", response);
        store.dispatch({
          type: "RESPONSE_FAILED",
          value: true,
          response: response.responseJSON.errors
        });
        NProgress.done();
      }
    });
  }

  sendLogin(endpoint, formdata, actionType) {
    if (storage.getCookies(keys.USER_PREFERENCE.TOKEN)) {
      token = storage.getCookies(keys.USER_PREFERENCE.TOKEN);
      email = storage.getCookies(keys.USER_PREFERENCE.EMAIL);
      password = storage.getCookies(keys.USER_PREFERENCE.PASSWORD);
      console.log(storage.getCookies(keys.USER_PREFERENCE.USER_NAME));
    } else {
      token = " ";
      email: "";
      password: "";
    }
    // debugger;
    store.dispatch({ type: "API_CALL", value: true });
    if (actionType !== "SIGNIN") {
      NProgress.start();
    }
    $.ajax({
      url: endpoint,
      type: "POST",
      dataType: "json",
      contentType: "application/json; charset=utf-8",
      enctype: "multipart/form-data",
      data: JSON.stringify(formdata),
      headers: {
        Authorization: token,
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      success: function(response) {
        console.log("------------", response);
        response["type"] = actionType;
        store.dispatch({ type: "API_CALL", value: false });
        store.dispatch(response);
        NProgress.done();
      },
      error: function(response) {
        console.log("------------", response);
        store.dispatch({
          type: "RESPONSE_FAILED",
          value: true
        });
      }
    });
  }

  send_get_request(methodType, endpoint, actionType) {
    NProgress.start();
    if (storage.getItemValue(keys.USER_PREFERENCE.LANGUAGE)) {
      languageCode = JSON.parse(
        storage.getItemValue(keys.USER_PREFERENCE.LANGUAGE)
      ).code;
    }
    if (storage.getCookies(keys.USER_PREFERENCE.AUTHORIZATION_TOKEN)) {
      token = storage.getCookies(keys.USER_PREFERENCE.AUTHORIZATION_TOKEN);
    } else {
      token = " ";
    }
    let loaderFlag = {
      type: "API_CALL",
      value: true
    };
    store.dispatch(loaderFlag);
    $.ajax({
      url: endpoint,
      type: methodType,
      headers: { Authorization: token },
      success: function(response) {
        NProgress.done();
        if (
          JSON.parse(storage.getItemValue(keys.USER_PREFERENCE.LANGUAGE))
            .code !== "en"
        ) {
          response = translation.translation(response, languageCode);
        }
        response["type"] = actionType;
        loaderFlag = {
          type: "API_CALL",
          value: false
        };
        store.dispatch(loaderFlag);
        store.dispatch(response);
      },
      error: function(response) {
        store.dispatch({
          type: "RESPONSE_FAILED",
          value: true
        });
      }
    });
  }

  send_file(endpoint, formdata, actionType) {
    NProgress.start();
    if (storage.getCookies(keys.USER_PREFERENCE.TOKEN)) {
      token = storage.getCookies(keys.USER_PREFERENCE.TOKEN);
    } else {
      token = " ";
    }
    $.ajax({
      url: endpoint,
      type: "POST",
      data: formdata,
      dataType: "json",
      contentType: "application/json",
      async: true,
      headers: { Authorization: token },
      success: function(response) {
        NProgress.done();
        response["type"] = actionType;
        store.dispatch(response);
      },
      xhr: function() {
        // custom xhr
        let _xhr = $.ajaxSettings.xhr();
        if (_xhr.upload) {
          // check if upload property exists
          _xhr.upload.addEventListener(
            "progress",
            function(evt) {
              if (evt.lengthComputable) {
                var percentComplete = Math.floor(
                  (evt.loaded / evt.total) * 100
                );
              } else {
                // Unable to compute progress information since the total size is unknown
              }
            },
            false
          );
        }
        return _xhr;
      },
      error: function(response) {
        response["type"] = actionType;
        store.dispatch(response);
      },
      cache: false,
      contentType: false,
      processData: false
    });
  }
}
export default new network();
