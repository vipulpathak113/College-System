import React from "react";
import keys from "../../models/localStorage-keys";
import storage from "../../utility/encrypt_data";
import store from "../../utility/store";
import easygov from "../../utility/network";
import bootupsettings from "../../models/bootupsettings";
import FlatButton from "../Buttons/flat_button";
import { Button } from "react-md";
import JobDetails from "./jobs_details";
import JobFilter from "../Filter/job_filter";

var data = [],
  applicationData;

var openViewApplication = data => {
  store.dispatch({ type: "SHOW_VIEW_APPLICATION_DETAILS", data: data });
};
export default class Jobs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      jobsdata: [],
      openViewApplications: false
    };
  }

  componentDidMount() {
    easygov.send(
      bootupsettings.ENDPOINTS.ALL_JOBS,
      {},
      "ALL_JOBS",
      function(response, component) {}
    );
    store.subscribe(() => {
      var response = store.getState();
      if (response.type === "ALL_JOBS") {
        data = response.results;
        this.setState({
          jobsdata: data
        });
      }
    });
  }

  componentWillMount() {
    store.subscribe(() => {
      var response = store.getState();
      if (response.type === "SHOW_VIEW_APPLICATION_DETAILS") {
        applicationData = response.data;
        this.setState({
          openViewApplications: true
        });
      } else if (response.type === "CLOSE_VIEW_APPLICATION_DETAILS") {
        this.setState({
          openViewApplications: false
        });

        if (response.type === "EDIT_STUDENT_INFO") {
          data = response;
          this.setState({
            applicationData: response.data
          });
        }
      }
    });
  }

  componentDidUpdate(prevProps, prevState) {
    store.subscribe(() => {
      var response = store.getState();
      if (response.type === "JOB_FILTER") {
        this.setState({
          jobsdata: response.data
        });
      }
    });
  }

  render() {
    var data = this.state.jobsdata;
    return (
      <div>
        {!this.state.openViewApplications ? (
          <div className="right-panel-content-bg">
            <h3 className="approve-beneficiary-text">Jobs Announcement</h3>
            <JobFilter data= {this.state.jobsdata} />
            <div>
              <div className="content-table-container">
                {data.length > 0 ? (
                  <table
                    cellSpacing="0"
                    cellPadding="0"
                    className="header-content-table"
                  >
                    <thead className="content-body-property">
                      <tr height="48">
                        <th className="table-coloumn-positions">
                          DATE OF DRIVE
                        </th>
                        <th className="table-coloumn-positions">COMPANY</th>
                        <th className="table-coloumn-positions">PROFILE</th>
                      </tr>
                    </thead>

                    <tbody className="content-body-bottom-property">
                      {data.map((item, i) => {
                        return (
                          <tr
                            className="content-table-row hover-clickable-table"
                            key={i}
                            onClick={openViewApplication.bind(this, item)}
                          >

<td className="table-coloumn-positions">
                              {item.date_of_drive}
                            </td>
                            <td className="table-coloumn-positions">
                              {item.company}
                            </td>
                            <td className="table-coloumn-positions">
                              {item.profile}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ) : (
                  <div className="no-record-found-text">
                    <h4>No Records Found !!</h4>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <JobDetails
            data={applicationData}
            studentdata={this.state.jobsdata}
          />
        )}
      </div>
    );
  }
}
