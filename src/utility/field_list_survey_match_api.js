import jquery from 'jquery'
import _ from 'lodash'

var data_to_send = []
var field_list_for_survey_match_api = (questions_id, survey_questions) => {
  var form_response = []
  questions_id = _.uniqBy(questions_id)
  for (var i = 0; i < questions_id.length; i++) {
    var answer_to_be_validated = null;
    if (JSON.parse(questions_id[i]).type !== "boolean") {
      answer_to_be_validated = document.getElementById(JSON.parse(questions_id[i]).id)
    }
    else {
      answer_to_be_validated = document.getElementsByName(JSON.parse(questions_id[i]).id)[0]
    }
    if (answer_to_be_validated) {
      if (JSON.parse(questions_id[i]).type === "options") {
        form_response[i] = survey_questions[i].options.find((item) => (item.text) === answer_to_be_validated.value)
        data_to_send[i] = {
          "fieldId": JSON.parse(questions_id[i]).id.toString(),
          "value": {
            "value": form_response[i].value.toString(),
            "displayValue": form_response[i].text
          }
        }
      }
      else if (JSON.parse(questions_id[i]).type === "boolean") {
        form_response[i] = jquery('input:radio[name=' + JSON.parse(questions_id[i]).id + ']:checked').val()
        if (form_response[i] === "Yes") {
          data_to_send[i] = {
            "fieldId": JSON.parse(questions_id[i]).id.toString(),
            "value": {
              "value": "true",
              "displayValue": form_response[i]
            }
          }
        }
        else {
          data_to_send[i] = {
            "fieldId": JSON.parse(questions_id[i]).id.toString(),
            "value": {
              "value": "false",
              "displayValue": form_response[i]
            }
          }
        }
      }

      else if (JSON.parse(questions_id[i]).type === "bounds") {
        form_response[i] = answer_to_be_validated.value
        data_to_send[i] = {
          "fieldId": JSON.parse(questions_id[i]).id.toString(),
          "value": {
            "value": form_response[i],
            "displayValue": form_response[i]
          }
        }
      }

      else if (JSON.parse(questions_id[i]).type === "year_difference") {
        var d = new Date(answer_to_be_validated.value);
        var curr_d = new Date();
        var months;
        months = (curr_d.getFullYear() - d.getFullYear()) * 12;
        months -= d.getMonth() + 1;
        months += curr_d.getMonth();
        var m_diff = months <= 0 ? 0 : months

        var y_diff;
        var age_diff_m = Date.now() - d.getTime();
        var age_date = new Date(age_diff_m); // miliseconds from epoch
        y_diff = Math.abs(age_date.getUTCFullYear() - 1970);

        var d_diff = Math.ceil(age_diff_m / (1000 * 3600 * 24));

        var dateobj = {
          value: d.getFullYear().toString() + '-' + d.getDate().toString() + '-' + (d.getMonth() + 1).toString(),
          displayValue: d.getDate().toString() + '-' + (d.getMonth() + 1).toString() + '-' + d.getFullYear().toString(),
          date: d.toLocaleDateString(),
          year: d.getFullYear().toString(),
          day: d.getDate().toString(),
          month: (d.getMonth() + 1).toString(),
          timestamp: d.getTime(),
          unixtimestamp: d.getTime() / 1000 | 0,
          yeardifference: y_diff,
          daydifference: d_diff,
          monthdifference: m_diff,
        };
        form_response[i] = dateobj
        data_to_send[i] = {
          "fieldId": JSON.parse(questions_id[i]).id.toString(),
          "value": form_response[i]
        }
      }
    }
  }

  return data_to_send;
}

export default field_list_for_survey_match_api;
