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
import style from "../../utility/style";
import MultiSelect from "@khanacademy/react-multi-select";

var data = [];

export default class CreateJob extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      studentdata: {},
      saveDisplay: "none",
      editDisplay: "block",
      cancelDisplay: "none",
      deptdata: [],
      department: "81de5fd7-5af8-4699-bced-e1462c118dac",
      selected: []
    };
  }

  onChanging(e) {
    this.setState({
      [e.target.id]: e.target.value
    });
  }

  save() {
    const detail = {
      department_ids: this.state.selected ? this.state.selected : "",
      profile: this.state.profile ? this.state.profile : "",
      date_of_drive: this.state.date_of_drive ? this.state.date_of_drive : "",
      company: this.state.company ? this.state.company : "",
      compensation: this.state.compensation ? this.state.compensation : "",
      process: this.state.process ? this.state.process : "",
      eligibility: this.state.eligibility ? this.state.eligibility : "",
      status: this.state.status ? this.state.status : "scheduled",
      venue: this.state.venue ? this.state.venue : "",
      time: this.state.time ? this.state.time : "",
      documents_required: this.state.documents_required
        ? this.state.documents_required
        : "",
      location: this.state.location ? this.state.location : ""
    };

    if (detail.company === "") {
      this.setState({
        companyerror: "This field is required"
      });
    } else {
      this.setState({
        companyerror: ""
      });
    }
    if (detail.profile === "") {
      this.setState({
        profileerror: "This field is required"
      });
    } else {
      this.setState({
        profileerror: ""
      });
    }

    if (detail.date_of_drive === "") {
      this.setState({
        date_of_driveerror: "This field is required"
      });
    } else {
      this.setState({
        date_of_driveerror: ""
      });
    }
    var regEx = /^\d{4}-\d{2}-\d{2}$/;

    if (
      detail.date_of_drive !== "" &&
      detail.date_of_drive.match(regEx) == null
    ) {
      this.setState({
        date_of_driveerror: "Date Format should be in YYYY-MM-DD "
      });
    } else if (
      detail.date_of_drive !== "" &&
      detail.date_of_drive.match(regEx) !== null
    ) {
      this.setState({
        date_of_driveerror: ""
      });
    }

    if (detail.compensation === "") {
      this.setState({
        compensationerror: "This field is required"
      });
    } else {
      this.setState({
        compensationerror: ""
      });
    }

    if (detail.process === "") {
      this.setState({
        processerror: "This field is required"
      });
    } else {
      this.setState({
        processerror: ""
      });
    }
    if (detail.eligibility === "") {
      this.setState({
        eligibilityerror: "This field is required"
      });
    } else {
      this.setState({
        eligibilityerror: ""
      });
    }

    if (
      detail.company !== "" &&
      detail.process !== "" &&
      detail.compensation !== "" &&
      detail.eligibility !== "" &&
      detail.date_of_drive !== "" &&
      detail.profile !== ""
    ) {
      network.post(
        bootupsettings.ENDPOINTS.SAVE_JOB,
        detail,
        "SAVE_JOB",
        function(response, component) {}
      );

      this.props.closeCreateJobsDialog();
      network.send(bootupsettings.ENDPOINTS.ALL_JOBS, {}, "ALL_JOBS", function(
        response,
        component
      ) {});

      // store.subscribe(() => {
      //   var response = store.getState();
      //   if (response.type === "ALL_JOBS") {
      //     data = response.results;
      //     this.setState({
      //       jobsdata: data
      //     });
      //   }
      // });
    }
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
    var array = this.state.deptdata;
    var result = array.map(function(obj) {
      return { label: obj.name, value: obj.id };
    });
    var deptdata = this.state.deptdata;
    const { selected } = this.state;
    return (
      <div style={{ display: "flex" }}>
        <div>
          <div className="field-containerR">
            <p style={{ margin: "3px" }}>Company Name*</p>
            <TextareaAutosize
              id="company"
              minRows={3}
              maxRows={6}
              value={this.state.company ? this.state.company : ""}
              onChange={this.onChanging.bind(this, event)}
              type="text"
              className="textArea1"
            />
          </div>

          {this.state.companyerror ? (
            <span className="error-message-text">
              {this.state.companyerror}
            </span>
          ) : null}

          <div className="field-containerR">
            <p style={{ margin: "3px" }}>Date of Drive*</p>
            <div className="beneficiary-details-textfields1">
              <TextField
                id="date_of_drive"
                style={style.textfield1}
                value={this.state.date_of_drive ? this.state.date_of_drive : ""}
                onChange={this.onChanging.bind(this, event)}
                type="text"
              />
            </div>
            {this.state.date_of_driveerror ? (
              <span className="error-message-text">
                {this.state.date_of_driveerror}
              </span>
            ) : null}
          </div>

          <div className="field-containerR">
            <p style={{ margin: "3px" }}>Venue</p>
            <div className="beneficiary-details-textfields1">
              <TextField
                id="venue"
                style={style.textfield1}
                value={this.state.venue ? this.state.venue : ""}
                onChange={this.onChanging.bind(this, event)}
                type="text"
              />
            </div>
          </div>

          <div className="field-containerR">
            <p style={{ margin: "3px" }}>Eligibility*</p>
            <TextareaAutosize
              id="eligibility"
              style={style.textfield1}
              minRows={3}
              maxRows={6}
              value={this.state.eligibility ? this.state.eligibility : ""}
              onChange={this.onChanging.bind(this, event)}
              type="text"
              className="textArea1"
            />
          </div>

          {this.state.eligibilityerror ? (
            <span className="error-message-text">
              {this.state.eligibilityerror}
            </span>
          ) : null}

          <div className="field-containerR">
            <p style={{ margin: "3px" }}>Process*</p>
            <TextareaAutosize
              id="process"
              style={style.textfield1}
              minRows={3}
              maxRows={6}
              value={this.state.process ? this.state.process : ""}
              onChange={this.onChanging.bind(this, event)}
              type="text"
              className="textArea1"
            />
          </div>

          {this.state.processerror ? (
            <span className="error-message-text">
              {this.state.processerror}
            </span>
          ) : null}

          <div className="field-containerR">
            <p style={{ margin: "3px" }}>Documents Required</p>
            <TextareaAutosize
              id="documents_required"
              style={style.textfield1}
              minRows={3}
              maxRows={6}
              value={
                this.state.documents_required
                  ? this.state.documents_required
                  : ""
              }
              onChange={this.onChanging.bind(this, event)}
              type="text"
              className="textArea1"
            />
          </div>
        </div>

        <div style={{ marginLeft: "87px" }}>
          <div>
            <p style={{ margin: "3px" }}>Job Profile*</p>
            <TextareaAutosize
              id="profile"
              style={style.textfield1}
              minRows={3}
              maxRows={6}
              value={this.state.profile ? this.state.profile : ""}
              onChange={this.onChanging.bind(this, event)}
              type="text"
              className="textArea1"
            />
          </div>

          {this.state.profileerror ? (
            <span className="error-message-text">
              {this.state.profileerror}
            </span>
          ) : null}

          <div className="text-gap">
            <p style={{ margin: "3px" }}>Time</p>
            <div className="beneficiary-details-textfields1">
              <TextField
                id="time"
                style={style.textfield1}
                value={this.state.time ? this.state.time : ""}
                onChange={this.onChanging.bind(this, event)}
                type="text"
              />
            </div>
          </div>

          <div className="text-gap">
            <p style={{ margin: "3px" }}>Job Location</p>
            <div className="beneficiary-details-textfields1">
              <TextField
                id="location"
                style={style.textfield1}
                value={this.state.location ? this.state.location : ""}
                onChange={this.onChanging.bind(this, event)}
                type="text"
              />
            </div>
          </div>

          <div className="text-gap">
            <p style={{ margin: "3px" }}>Salary*</p>
            <TextareaAutosize
              id="compensation"
              style={style.textfield1}
              minRows={3}
              maxRows={6}
              value={this.state.compensation ? this.state.compensation : ""}
              onChange={this.onChanging.bind(this, event)}
              type="text"
              className="textArea1"
            />
            {this.state.compensationerror ? (
              <span className="error-message-text">
                {this.state.compensationerror}
              </span>
            ) : null}
          </div>
          <div className="text-gap" style={{ marginTop: "9px" }}>
            Department
            <MultiSelect
              options={result}
              selected={selected}
              onSelectedChanged={selected => this.setState({ selected })}
              overrideStrings={{
                selectSomeItems: "Select some department...",
                allItemsAreSelected: "All Departments are Selected",
                selectAll: "Select All",
                search: "Search"
              }}
            />
          </div>
          <div className="text-gap">
            Status
            <select
              value={this.state.status}
              onChange={this.onChanging.bind(this)}
              className="selectstyle"
              id="status"
            >
              <option value="scheduled">Scheduled</option>
              <option value="on_going">On Going</option>
              <option value="completed">Completed</option>
              <option value="post_poned">Post Poned</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
        <div>
          <FlatButton
            label="Save"
            onClick={this.save.bind(this)}
            style={{
              top: "522px",
              right: "160px",
              background: "slategray",
              color: "white",
              fontWeight: "500",
              width: "84px",
              height: "30px"
            }}
          />
        </div>
      </div>
    );
  }
}
