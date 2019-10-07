import React from "react";
import { Snackbar } from "react-md";
import keys from "../../models/localStorage-keys";
import storage from "../../utility/encrypt_data";
import store from "../../utility/store";
import ReactFileReader from "react-file-reader";

export default class ImportData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      toasts: [],
      autohide: true,
      check: "",
      status: false
    };
  }

  onChange(e) {
    var format;
    let files = e.target.files;
    format = files[0].name.substring(files[0].name.lastIndexOf(".") + 1);

    var status = document.getElementById("filestatus");

    if (format == "xlsx" || format == "csv") {
      status.innerText = "File uploaded successfully!";
      this.setState({
        status: true
      });
      let reader = new FileReader();
      reader.readAsDataURL(files[0]);

      reader.onload = e => {};
    } else {
      status.innerText = "File not supported!";
      this.setState({
        status: false
      });
    }
  }

  dismissToast = () => {
    const [, ...toasts] = this.state.toasts;
    this.setState({ toasts });
  };

  callToast = val => {
    this.addToast(val, "CLOSE");
  };

  render() {
    return (
      <div className="right-panel-content-bg">
        <h1>Upload Student Data</h1>
        <input type="file" id="file-upload" onChange={e => this.onChange(e)} />
        <div
          id="filestatus"
          className={this.state.status ? "compatFile" : "notCompatFile"}
        ></div>
      </div>
    );
  }
}
