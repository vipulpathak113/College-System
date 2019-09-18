import React from 'react'

const handleNumberField = (fieldId) => {
  var number = document.getElementById(fieldId);
  number.onkeydown = function(e) {
      if(!((e.keyCode > 95 && e.keyCode < 106)
        || (e.keyCode > 47 && e.keyCode < 58)
        || e.keyCode == 8 || e.keyCode == 9)) {
          return false;
      }
  }
}

export default handleNumberField;
