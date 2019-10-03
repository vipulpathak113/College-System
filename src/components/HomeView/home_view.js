import React from "react";
import FlatButton from "../Buttons/flat_button";
import store from "../../utility/store";
import keys from "../../models/localStorage-keys";
import storage from "../../utility/encrypt_data";

var response;
export default class HomeView extends React.Component {
  constructor() {
    super();
    this.state = {
      applicationsData: [],
      showLoader: true,
      permissions: storage.getItemValue(keys.USER_PREFERENCE.PERMISSIONS)
    };
  }

  openPage(val, newVal) {
    store.dispatch({
      type: "CHANGE_PAGE",
      data: val,
      expanded: newVal
    });
  }

  render() {
    var today_date = new Date();
    return (
      <div className="homeview-bg">
        <h1 className="greeting-text">
          Welcome,{" "}
          {storage.getCookies(keys.USER_PREFERENCE.USER_NAME)
            ? storage.getCookies(keys.USER_PREFERENCE.USER_NAME)
            : "Admin"}
        </h1>
        <h3 className="home-activity-text">
          Here are the actions required by you.
        </h3>
        <div className="todo-text-container">
          <h2 className="todo-text">To Do</h2>
        </div>
        <div className="activity-task-report">
          <p className="today-date-text">
            Today, {today_date.toDateString().substring(4, 15)}
          </p>
          {this.state.applicationsData.map((item, i) => {
            if (this.state.permissions.includes(item.view_permissions))
              return (
                <div key={i} className="task-container">
                  <div className="icon-container">
                    <img src={item.image} alt="" className="icon-position" />
                  </div>
                  <div className="doc-content-text">
                    <h5 className="doc-text">{item.docContent}</h5>
                  </div>
                  {this.state.permissions.includes(item.change_permissions) ? (
                    item.remaining !== 0 ? (
                      <div className="verify-btn-container">
                        <FlatButton
                          flat
                          label={item.btnText}
                          onClick={this.openPage.bind(
                            this,
                            item.id,
                            item.expanded
                          )}
                        />
                      </div>
                    ) : null
                  ) : (
                    <div className="verify-btn-container">
                      <FlatButton
                        flat
                        label="View Applications"
                        onClick={this.openPage.bind(
                          this,
                          item.id,
                          item.expanded
                        )}
                      />
                    </div>
                  )}
                </div>
              );
          })}
        </div>
      </div>
    );
  }
}
