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
import TextareaAutosize from "react-textarea-autosize";
import MultiSelect from "@khanacademy/react-multi-select";

var data = [];
export default class JobDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      studentdata: {},
      saveDisplay: "none",
      editDisplay: "block",
      cancelDisplay: "none",
      selected: [],
      deptdata: [],
      disabled: true
    };
  }

  goBack() {
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
    store.dispatch({ type: "CLOSE_VIEW_APPLICATION_DETAILS", data: data });
  }

  edit() {
    $("input").prop("disabled", false);
    $("input").addClass("md-text--enabled");
    $("textarea").prop("disabled", false);
    $("textarea").addClass("md-text--enabled");
    $("div").prop("disabled", false);
    this.setState({
      editDisplay: "none",
      saveDisplay: "block",
      cancelDisplay: "block",
      disabled: false,
      valueRenderer: "Select Departments"
    });
  }

  save() {
    var data = this.props.data;
    var detail = {
      company: this.state.company ? this.state.company : data.company,
      company_profile: this.state.company_profile
        ? this.state.company_profile
        : data.company_profile,
      compensation: this.state.compensation
        ? this.state.compensation
        : data.compensation,
      date_of_drive: this.state.date_of_drive
        ? this.state.date_of_drive
        : data.date_of_drive,
      department_ids: this.state.selected
        ? this.state.selected
        : data.department,
      documents_required: this.state.documents_required
        ? this.state.documents_required
        : data.documents_required,
      eligibility: this.state.eligibility
        ? this.state.eligibility
        : data.eligibility,
      id: data.id,
      job_description: this.state.job_description
        ? this.state.job_description
        : data.job_description,
      location: this.state.location ? this.state.location : data.location,
      process: this.state.process ? this.state.process : data.process,
      profile: this.state.profile ? this.state.profile : data.profile,
      skills_required: this.state.skills_required
        ? this.state.skills_required
        : data.skills_required,
      status: this.state.status ? this.state.status : data.status,
      time: this.state.time ? this.state.time : data.time,
      venue: this.state.venue ? this.state.venue : data.venue
    };
    this.setState({
      detail: detail,
      editDisplay: "block",
      cancelDisplay: "none",
      saveDisplay: "none",
      disabled: true
    });
    $("input").prop("disabled", true);
    $("input").removeClass("md-text--enabled");
    $("textarea").prop("disabled", true);
    $("textarea").removeClass("md-text--enabled");

    network.sendPatch(
      bootupsettings.ENDPOINTS.EDIT_JOB,
      detail,
      "EDIT_JOB",
      function(response, component) {}
    );
  }

  cancel() {
    $("input").prop("disabled", true);
    $("input").removeClass("md-text--enabled");
    $("textarea").prop("disabled", true);
    $("textarea").removeClass("md-text--enabled");
    this.setState({
      editDisplay: "block",
      cancelDisplay: "none",
      saveDisplay: "none",
      disabled: true
    });
  }

  onChanging(e) {
    this.setState({
      [e.target.id]: e.target.value
    });
  }

  handleChecked(e) {
    var data = this.props.data;
    this.setState({ is_placed: !data.profile.is_placed });
  }

  componentDidMount() {
    var data = this.props.data;
    var selectArray = data.departments;
    var resultSelect = selectArray.map(function(obj) {
      return obj.id;
    });
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
          deptdata: data,
          selected: resultSelect
        });
      }
    });
  }

  render() {
    const { selected } = this.state;
    var data = this.props.data;
    var array = this.state.deptdata ? this.state.deptdata : "";
    var result = array.map(function(obj) {
      return { label: obj.name, value: obj.id };
    });

    let style = {
      dropdown: {
        width: "100%",
        height: "40px",
        borderRadius: "3px",
        outline: "none",
        padding: "0 10px",
        cursor: "pointer",
        backgroundColor: "#f7faf8"
      },
      container: {
        backgroundColor: "rgba(0,0,0,0.6)"
      }
    };
    return (
      <div className="right-panel-content-bg">
        <div className="non-monetary-heading-container">
          <div className="arrow-back-non-monetary">
            <Button
              icon
              onClick={this.goBack.bind(this)}
              className="going-back-btn-style"
            >
              arrow_back
            </Button>
          </div>
          <div className="non-monetary-heading">View Job</div>
        </div>
        <div className="benefit-description">
          <h3 className="benefit-heading">
            Job Details <br />
          </h3>
        </div>

        <div className="outer-container">
          <div className="schemes-questions-container">
            <div className="schems-questions-container-content">
              <div>
                <div className="field-containerR">
                  <p style={{ margin: "3px" }}>Company Name</p>
                  <TextareaAutosize
                    id="company"
                    disabled
                    minRows={3}
                    maxRows={6}
                    defaultValue={data.company ? data.company : ""}
                    onChange={this.onChanging.bind(this, event)}
                    type="text"
                    className="textArea"
                  />
                </div>

                <div className="field-containerR">
                  <p style={{ margin: "3px" }}>Company Profile</p>
                  <TextareaAutosize
                    id="company_profile"
                    style={style.textfield1}
                    minRows={3}
                    maxRows={6}
                    disabled
                    defaultValue={
                      data.company_profile ? data.company_profile : ""
                    }
                    onChange={this.onChanging.bind(this, event)}
                    type="text"
                    className="textArea"
                  />
                </div>

                <div className="field-containerR">
                  <p style={{ margin: "3px" }}>Date of Drive</p>
                  <div className="beneficiary-details-textfields">
                    <TextField
                      id="date_of_drive"
                      style={style.textfield1}
                      disabled
                      defaultValue={
                        data.date_of_drive ? data.date_of_drive : ""
                      }
                      onChange={this.onChanging.bind(this, event)}
                      type="text"
                    />
                  </div>
                </div>
                <div className="field-containerR">
                  <p style={{ margin: "3px" }}>Time</p>
                  <div className="beneficiary-details-textfields">
                    <TextField
                      id="time"
                      style={style.textfield1}
                      disabled
                      defaultValue={data.time ? data.time : ""}
                      onChange={this.onChanging.bind(this, event)}
                      type="text"
                    />
                  </div>
                </div>

                <div className="field-containerR">
                  <p style={{ margin: "3px" }}>Venue</p>
                  <div className="beneficiary-details-textfields">
                    <TextField
                      id="venue"
                      style={style.textfield1}
                      disabled
                      defaultValue={data.venue ? data.venue : ""}
                      onChange={this.onChanging.bind(this, event)}
                      type="text"
                    />
                  </div>
                </div>

                <div className="field-containerR">
                  <p style={{ margin: "3px" }}>Process</p>
                  <TextareaAutosize
                    id="process"
                    style={style.textfield1}
                    minRows={3}
                    maxRows={6}
                    disabled
                    defaultValue={data.process ? data.process : ""}
                    onChange={this.onChanging.bind(this, event)}
                    type="text"
                    className="textArea"
                  />
                </div>

                <div className="field-containerR">
                  <p style={{ margin: "3px" }}>Documents Required</p>
                  <TextareaAutosize
                    id="documents_required"
                    style={style.textfield1}
                    minRows={3}
                    maxRows={6}
                    disabled
                    defaultValue={
                      data.documents_required ? data.documents_required : ""
                    }
                    onChange={this.onChanging.bind(this, event)}
                    type="text"
                    className="textArea"
                  />
                </div>
              </div>

              <div>
                <div className="field-containerL">
                  <p style={{ margin: "3px" }}>Job Profile</p>
                  <TextareaAutosize
                    id="profile"
                    style={style.textfield1}
                    minRows={3}
                    maxRows={6}
                    disabled
                    defaultValue={data.profile ? data.profile : ""}
                    onChange={this.onChanging.bind(this, event)}
                    type="text"
                    className="textArea"
                  />
                </div>

                <div className="field-containerL">
                  <p style={{ margin: "3px" }}>Job Description</p>
                  <TextareaAutosize
                    id="job_description"
                    style={style.textfield1}
                    minRows={3}
                    maxRows={6}
                    disabled
                    defaultValue={
                      data.job_description ? data.job_description : ""
                    }
                    onChange={this.onChanging.bind(this, event)}
                    type="text"
                    className="textArea"
                  />
                </div>

                <div className="field-containerL">
                  <p style={{ margin: "3px" }}>Eligibility</p>
                  <TextareaAutosize
                    id="eligibility"
                    style={style.textfield1}
                    minRows={3}
                    maxRows={6}
                    disabled
                    defaultValue={data.eligibility ? data.eligibility : ""}
                    onChange={this.onChanging.bind(this, event)}
                    type="text"
                    className="textArea"
                  />
                </div>

                <div className="field-containerL">
                  <p style={{ margin: "3px" }}>Skills Required</p>
                  <TextareaAutosize
                    id="skills_required"
                    style={style.textfield1}
                    minRows={3}
                    maxRows={6}
                    disabled
                    defaultValue={
                      data.skills_required ? data.skills_required : ""
                    }
                    onChange={this.onChanging.bind(this, event)}
                    type="text"
                    className="textArea"
                  />
                </div>

                <div className="field-containerL">
                  <p style={{ margin: "3px" }}>Job Location</p>
                  <div className="beneficiary-details-textfields">
                    <TextField
                      id="location"
                      style={style.textfield1}
                      disabled
                      defaultValue={data.location ? data.location : ""}
                      onChange={this.onChanging.bind(this, event)}
                      type="text"
                    />
                  </div>
                </div>

                <div className="field-containerL">
                  <p style={{ margin: "3px" }}>Salary</p>
                  <TextareaAutosize
                    id="compensation"
                    style={style.textfield1}
                    minRows={3}
                    maxRows={6}
                    disabled
                    defaultValue={data.compensation ? data.compensation : ""}
                    onChange={this.onChanging.bind(this, event)}
                    type="text"
                    className="textArea"
                  />
                </div>

                <div className="field-containerL">
                  <p style={{ margin: "3px" }}>Department</p>
                  <MultiSelect
                    options={result}
                    selected={selected}
                    disabled={this.state.disabled}
                    onSelectedChanged={selected =>
                      this.setState({ selected: [...selected], selected })
                    }
                    overrideStrings={{
                      selectSomeItems: "Select some department...",
                      allItemsAreSelected: "All Departments are Selected",
                      selectAll: "Select All",
                      search: "Search"
                    }}
                  />
                </div>
              </div>
              <div>
                <FlatButton
                  flat
                  label="Save"
                  onClick={this.save.bind(this)}
                  style={{ display: this.state.saveDisplay }}
                  className="saveButton"
                />
                <FlatButton
                  flat
                  label="Cancel"
                  onClick={this.cancel.bind(this)}
                  style={{ display: this.state.cancelDisplay }}
                  className="cancelButton"
                />
                <FlatButton
                  flat
                  label="Edit"
                  onClick={this.edit.bind(this)}
                  style={{ display: this.state.editDisplay }}
                  className="editButton"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
