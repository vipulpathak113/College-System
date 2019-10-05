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

var data = [];
export default class CreateJob extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      studentdata: {},
      saveDisplay: "none",
      editDisplay: "block",
      cancelDisplay: "none"
    };
  }

  onChanging(e) {
    this.setState({
      [e.target.id]: e.target.value
    });
  }

  render() {
    return (
      <div style={{ display: "flex" }}>
        <div>
          <div className="field-containerR">
            <p style={{ margin: "3px" }}>Company Name</p>
            <TextareaAutosize
              id="first_name"
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
            <p style={{ margin: "3px" }}>Date of Drive</p>
            <div className="beneficiary-details-textfields">
              <TextField
                id="first_name"
                style={style.textfield1}
                disabled
                defaultValue={data.date_of_drive ? data.date_of_drive : ""}
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

        <div style={{ marginLeft: "87px" }}>
          <div>
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

          <div className="">
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

          <div className="">
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

          <div className="">
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
        </div>
        <div></div>
      </div>
    );
  }
}
