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

export default class StudentFilter extends React.Component {
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
            Year
            <select
              value={this.state.year}
              onChange={this.filterSelection.bind(this)}
              className="selectstyle"
              name="year"
            >
              <option value="">Select Year</option>
              <option value="2017">2017</option>
              <option value="2018">2018</option>
              <option value="2019">2019</option>
              <option value="2020">2020</option>
            </select>
          </div>
          <div>
            Department
            <select
              className="mdb-select md-form"
              value={this.state.department}
              onChange={this.filterSelection.bind(this)}
              className="selectstyle"
              name="department"
            >
              <option value="">Select Department</option>
              <option value="TPN">TPN</option>
              <option value="CSE">CSE</option>
            </select>
          </div>

          <div>
            Course
            <select
              className="mdb-select md-form"
              value={this.state.course}
              onChange={this.filterSelection.bind(this)}
              className="selectstyle"
              name="course"
            >
              <option value="">Select Course</option>
              <option value="DS">DS</option>
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
