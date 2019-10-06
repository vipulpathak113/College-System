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
import Multiselect from "multiselect-dropdown-react";

var data = [];
export default class CreateJob extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      studentdata: {},
      saveDisplay: "none",
      editDisplay: "block",
      cancelDisplay: "none",
      deptdata: []
    };
  }

  onChanging(e) {
    this.setState({
      [e.target.id]: e.target.value
    });
  }

  save() {
    const detail = {
      department: this.state.department,
      profile: this.state.profile,
      date_of_drive: this.state.date_of_drive,
      company: this.state.company,
      compensation: this.state.compensation,
      process: this.state.process,
      eligibility: this.state.eligibility,
      status: this.state.status,
      venue: this.state.venue,
      time: this.state.time,
      documents_required: this.state.documents_required,
      location: this.state.location
    };
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
      console.log(response);
      if (response.type === "GET_DEPARTMENT") {
        data = response.results;
        this.setState({
          deptdata: data
        });
      }
    });
  }

  render() {
    console.log(this.props);
    var deptdata = this.state.deptdata;
    return (
      <div style={{ display: "flex" }}>
        <div>
          <div className="field-containerR">
            <p style={{ margin: "3px" }}>Company Name</p>
            <TextareaAutosize
              id="company"
              minRows={3}
              maxRows={6}
              value={this.state.company}
              onChange={this.onChanging.bind(this, event)}
              type="text"
              className="textArea1"
            />
          </div>

          <div className="field-containerR">
            <p style={{ margin: "3px" }}>Date of Drive</p>
            <div className="beneficiary-details-textfields1">
              <TextField
                id="date_of_drive"
                style={style.textfield1}
                value={this.state.date_of_drive}
                onChange={this.onChanging.bind(this, event)}
                type="text"
              />
            </div>
          </div>

          <div className="field-containerR">
            <p style={{ margin: "3px" }}>Venue</p>
            <div className="beneficiary-details-textfields1">
              <TextField
                id="venue"
                style={style.textfield1}
                value={this.state.venue}
                onChange={this.onChanging.bind(this, event)}
                type="text"
              />
            </div>
          </div>

          <div className="field-containerR">
            <p style={{ margin: "3px" }}>Eligibility</p>
            <TextareaAutosize
              id="eligibility"
              style={style.textfield1}
              minRows={3}
              maxRows={6}
              value={this.state.eligibility}
              onChange={this.onChanging.bind(this, event)}
              type="text"
              className="textArea1"
            />
          </div>

          <div className="field-containerR">
            <p style={{ margin: "3px" }}>Process</p>
            <TextareaAutosize
              id="process"
              style={style.textfield1}
              minRows={3}
              maxRows={6}
              value={this.state.process}
              onChange={this.onChanging.bind(this, event)}
              type="text"
              className="textArea1"
            />
          </div>

          <div className="field-containerR">
            <p style={{ margin: "3px" }}>Documents Required</p>
            <TextareaAutosize
              id="documents_required"
              style={style.textfield1}
              minRows={3}
              maxRows={6}
              value={this.state.documents_required}
              onChange={this.onChanging.bind(this, event)}
              type="text"
              className="textArea1"
            />
          </div>
        </div>

        <div style={{ marginLeft: "87px" }}>
          <div>
            <p style={{ margin: "3px" }}>Job Profile</p>
            <TextareaAutosize
              id="profile"
              style={style.textfield1}
              minRows={3}
              maxRows={6}
              value={this.state.profile}
              onChange={this.onChanging.bind(this, event)}
              type="text"
              className="textArea1"
            />
          </div>

          <div className="text-gap">
            <p style={{ margin: "3px" }}>Time</p>
            <div className="beneficiary-details-textfields1">
              <TextField
                id="time"
                style={style.textfield1}
                value={this.state.time}
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
                value={this.state.location}
                onChange={this.onChanging.bind(this, event)}
                type="text"
              />
            </div>
          </div>

          <div className="text-gap">
            <p style={{ margin: "3px" }}>Salary</p>
            <TextareaAutosize
              id="compensation"
              style={style.textfield1}
              minRows={3}
              maxRows={6}
              value={this.state.compensation}
              onChange={this.onChanging.bind(this, event)}
              type="text"
              className="textArea1"
            />
          </div>
          <div className="text-gap" style={{ marginTop: "44px" }}>
            Department
            <select
              defaultValue="Select Department"
              onChange={this.onChanging.bind(this)}
              className="selectstyle"
              id="department"
              style={{ width: "166px" }}
            >
              {deptdata &&
                deptdata.map((item, key) => {
                  return (
                    <option value={item.id} key={key}>
                      {item.name}
                    </option>
                  );
                })}
            </select>
          </div>
          <div className="text-gap">
            Status
            <select
              value={this.state.status}
              onChange={this.onChanging.bind(this)}
              className="selectstyle"
              id="status"
            >
              <option value="">Select Status</option>
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
