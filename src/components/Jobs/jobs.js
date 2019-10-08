import React from "react";
import keys from "../../models/localStorage-keys";
import storage from "../../utility/encrypt_data";
import store from "../../utility/store";
import network from "../../utility/network";
import bootupsettings from "../../models/bootupsettings";
import FlatButton from "../Buttons/flat_button";
import { Button, Dialog } from "react-md";
import JobDetails from "./jobs_details";
import JobFilter from "../Filter/job_filter";
import IconButton from "../Buttons/icon_button";
import style from "../../utility/style";
import CreateJob from "../Jobs/create_jobs";

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
      openViewApplications: false,
      createjobs: false
    };
  }

  componentDidMount() {
    network.send(bootupsettings.ENDPOINTS.ALL_JOBS, {}, "ALL_JOBS", function(
      response,
      component
    ) {});
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

        if (response.type === "EDIT_JOB") {
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

  deleteJob(data) {
    var answer = window.confirm("Are you sure you want to delete this job?");

    if (answer) {
      network.sendDelete(
        bootupsettings.ENDPOINTS.DELETE_JOB,
        data,
        "DELETE_JOB",
        function(response, component) {}
      );
      network.send(bootupsettings.ENDPOINTS.ALL_JOBS, {}, "ALL_JOBS", function(
        response,
        component
      ) {});
    } else {
    }
  }

  openCreateJobsDialog = () => {
    this.setState({ createjobs: true });
  };

  closeCreateJobsDialog = () => {
    this.setState({ createjobs: false });
  };

  render() {
    var data = this.state.jobsdata;
    const createjobs = this.state.createjobs;
    return (
      <div>
        {!this.state.openViewApplications ? (
          <div className="right-panel-content-bg">
            <Dialog
              id="help-support-modal"
              visible={createjobs}
              title="Create Job"
              onHide={this.closeCreateJobsDialog}
              style={style.container}
              dialogStyle={style.JobdialogStyle}
              focusOnMount={false}
            >
              <div className="dialog-close-btn">
                <IconButton
                  icon
                  fixedPosition="tr"
                  onClick={this.closeCreateJobsDialog}
                  displayName="close"
                ></IconButton>
              </div>
              <div>
                <CreateJob closeCreateJobsDialog={this.closeCreateJobsDialog} />
              </div>
            </Dialog>

            <h3 className="approve-beneficiary-text">Job Announcement</h3>
            <JobFilter data={this.state.jobsdata} />
            <FlatButton
              flat
              label="+ CREATE JOB"
              onClick={this.openCreateJobsDialog.bind(this)}
              // style={{ display: this.state.saveDisplay }}
              // className="saveButton"
              style={{
                bottom: "5px",
                left: "972px",
                color: "white",
                background: "slategrey"
              }}
            />
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
                        <th className="table-coloumn-positions">TIME</th>
                        <th className="table-coloumn-positions">VENUE</th>
                        <th className="table-coloumn-positions">COMPANY</th>
                        <th className="table-coloumn-positions">PROFILE</th>
                        <th className="table-coloumn-positions">ACTION</th>
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
                              {item.time}
                            </td>

                            <td className="table-coloumn-positions">
                              {item.venue}
                            </td>

                            <td className="table-coloumn-positions">
                              {item.company}
                            </td>
                            <td className="table-coloumn-positions">
                              {item.profile}
                            </td>
                            <td
                              onClick={event => {
                                this.deleteJob(item);
                                event.stopPropagation();
                              }}
                              className="deleteStyle"
                            >
                              <button className="deletebtn">Delete</button>
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
