import React from "react";
import { TextField } from "react-md";
import Button from "react-md/lib/Buttons/Button";
import keys from "../../models/localStorage-keys";
import storage from "../../utility/encrypt_data";
import store from "../../utility/store";
import bootupsettings from "../../models/bootupsettings";
import network from "../../utility/network";
import $ from "jquery";
import FlatButton from "../Buttons/flat_button";

var data = [];
export default class StudentFilter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      year: "",
      department: "",
      course: "",
      deptdata: []
    };
  }

  filterSelection(e) {
    this.setState({ [e.target.name]: e.target.value }, () =>
      network.send(
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
    network.send(
      bootupsettings.ENDPOINTS.STUDENT_INFO,
      {},
      "GET_STUDENT_INFO",
      function(response, component) {}
    );
  }

  componentDidMount() {
    network.send(
      bootupsettings.ENDPOINTS.GET_DEPARTMENT,
      {},
      "GET_DEPARTMENT",
      function(response, component) {}
    );
    store.subscribe(() => {
      var response = store.getState();
      if (response.type === "GET_DEPARTMENT") {
        data = response.results;
        this.setState({
          deptdata: data
        });
      }
    });
  }

  render() {
    const { deptdata } = this.state;
    return (
      <div className="right-panel-filter">
        <div className="filter-field">
          <div className="dropdiv">
            Year
            <select
              value={this.state.year}
              onChange={this.filterSelection.bind(this)}
              className="selectstyle"
              name="year"
              style={{ width: "116px" }}
            >
              <option value="">Select Year</option>
              <option value="2017">2017</option>
              <option value="2018">2018</option>
              <option value="2019">2019</option>
              <option value="2020">2020</option>
            </select>
          </div>
          <div className="dropdiv">
            Department
            <select
              className="mdb-select md-form"
              value={this.state.department}
              onChange={this.filterSelection.bind(this)}
              className="selectstyle"
              name="department"
            >
              <option value="">Select Department</option>
              {deptdata &&
                deptdata.map((item, key) => {
                  return (
                    <option value={item.name} key={key}>
                      {item.name}
                    </option>
                  );
                })}
            </select>
          </div>

          <div className="dropdiv">
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
