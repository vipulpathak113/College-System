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

var data = [];
export default class JobFilter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status
    };
  }

  filterSelection(e) {
    this.setState({ [e.target.name]: e.target.value }, () => {
      easygov.send(bootupsettings.ENDPOINTS.ALL_JOBS, {}, "ALL_JOBS", function(
        response,
        component
      ) {});
      store.subscribe(() => {
        var response = store.getState();
        if (response.type === "ALL_JOBS") {
          data = response.results;
          this.setState(
            {
              jobsdata: data
            },
            () => {
              let filterData = this.state.jobsdata;
              if (this.state.status) {
                let filteredData = filterData.filter(
                  item => item.status === this.state.status
                );
                store.dispatch({ type: "JOB_FILTER", data: filteredData });
              } else {
                store.dispatch({ type: "JOB_FILTER", data: filterData });
              }
            }
          );
        }
      });
    });
  }

  clearfilter() {
    this.setState({
      status: ""
    });
    easygov.send(bootupsettings.ENDPOINTS.ALL_JOBS, {}, "ALL_JOBS", function(
      response,
      component
    ) {});
  }

  render() {
    return (
      <div className="right-panel-filter">
        <div className="filter-field">
          <div className="dropdiv">
            Status
            <select
              value={this.state.status}
              onChange={this.filterSelection.bind(this)}
              className="selectstyle"
              name="status"
            >
              <option value="">Select Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="on_going">On Going</option>
              <option value="completed">Completed</option>
              <option value="post_poned">Post Poned</option>
              <option value="cancelled">Cancelled</option>
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
