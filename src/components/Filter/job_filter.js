import React from "react";
import { TextField } from "react-md";
import Button from "react-md/lib/Buttons/Button";
import keys from "../../models/localStorage-keys";
import storage from "../../utility/encrypt_data";
import store from "../../utility/store";
import bootupsettings from "../../models/bootupsettings";
import easygov from "../../utility/network";
import $ from "jquery";
import FlatButton from "../Buttons/flat_button";

export default class JobFilter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      year: "",
      department: "",
      course: ""
    };
  }

  filterSelection(e) {
    this.setState({ [e.target.name]: e.target.value }, () =>
      easygov.send(
        bootupsettings.ENDPOINTS.STUDENT_FILTER,
        {
          year: this.state.year,
          department: this.state.department,
          course: this.state.course
        },
        "STUDENT_FILTER",
        function(response, component) {}
      )
    );
  }

  clearfilter() {
    this.setState({
      year: "",
      department: "",
      course: ""
    });
    easygov.send(
      bootupsettings.ENDPOINTS.STUDENT_INFO,
      {},
      "GET_STUDENT_INFO",
      function(response, component) {}
    );
  }

  render() {
    return (
      <div className="right-panel-filter">
        <div className="filter-field">
          <div className="filter-div">Filter By: </div>
          <div>
            Status
            <select
              value={this.state.status}
              onChange={this.filterSelection.bind(this)}
              className="selectstyle"
              name="status"
            >
              <option value="0">Select Status</option>
              <option value="1">Scheduled</option>
              <option value="2">On Going</option>
              <option value="3">Completed</option>
              <option value="4">Post Poned</option>
              <option value="5">Cancelled</option>
            </select>
          </div>
    
          <FlatButton
            flat
            label="CLEAR FILTER"
            onClick={this.clearfilter.bind(this)}
            className="filterbtn"
          />
        </div>
      </div>
    );
  }
}
