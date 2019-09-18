import React from 'react'
import docPending from '../../img/document.svg'
import applicationPending from '../../img/application.svg'
import applicationBenefit from '../../img/disburse.svg'
import FlatButton from '../Buttons/flat_button';
import store from '../../utility/store'
import bootupsettings from '../../models/bootupsettings';
import easygov from '../../utility/network'
import keys from '../../models/localStorage-keys'
import storage from '../../utility/encrypt_data'

var response
export default class HomeView extends React.Component {
    constructor() {
        super()
        this.state = {
            applicationsData: [],
            showLoader: true,
            permissions: storage.getItemValue(keys.USER_PREFERENCE.PERMISSIONS)
        }
    }

    openPage(val, newVal) {
        store.dispatch({
            type: "CHANGE_PAGE",
            data: val,
            expanded: newVal
        })
    }

    componentWillMount() {
      // store.dispatch({
      //   type: "API_CALL",
      //   value: true
      // })
        easygov.send(bootupsettings.ENDPOINTS.APPLICATION_COUNT, "", "APPLICATION_COUNT", function (response, component) { })
        store.subscribe(() => {
            response = store.getState()
            if (response.type === "APPLICATION_COUNT") {
                if (response.code === 200) {
                    let data = [
                        {
                            docContent: response.data.documentsApprovedRemaining + response.data.documentsPending + " Applications are pending for Documents Verification.",
                            btnText: 'Verify Now',
                            type: 'verify_documents',
                            image: docPending,
                            id: 2,
                            remaining: response.data.documentsApprovedRemaining + response.data.documentsPending,
                            view_permissions: "data.change_review_documents",
                            change_permissions: "data.change_review_documents",
                            expanded: false
                        },
                        {
                            docContent: response.data.activeBeneficiaryRemaining + " Applications are pending for Approval.",
                            btnText: 'Approve Now',
                            type: 'approve_beneficiary',
                            image: applicationPending,
                            id: 3,
                            remaining: response.data.activeBeneficiaryRemaining,
                            view_permissions: "data.change_review_applications",
                            change_permissions: "data.change_review_applications",
                            expanded: false
                        },
                        {
                            docContent: response.data.benefitsRemaining + " Applications are pending for Benefits Delivery.",
                            btnText: 'Complete Now',
                            type: 'disburse_benefits',
                            image: applicationBenefit,
                            id: 5,
                            remaining: response.data.benefitsRemaining,
                            view_permissions: "data.add_non_monetary_beneficiary",
                            change_permissions: "data.change_non_monetary_beneficiary",
                            expanded: true
                        }
                    ]
                    this.setState({
                        applicationsData: data
                    })
                }
                else if (response.code === 401 && response.message.toLowerCase().includes("token")) {
                    storage.setItemValue(keys.APP_PREFERENCE.IS_TOKEN_EXPIRED, "TRUE")
                    window.location.href = "/sign-in"
                }
            }
        })
    }

    render() {
        var today_date = new Date()
        return (
            <div className="homeview-bg">
                <h1 className="greeting-text">Welcome, {storage.getItemValue(keys.USER_PREFERENCE.USER_NAME)}</h1>
                <h3 className="home-activity-text">Here are the actions required by you.</h3>
                <div className="todo-text-container">
                    <h2 className="todo-text">To Do</h2>
                </div>
                <div className="activity-task-report">
                    <p className="today-date-text">Today, {today_date.toDateString().substring(4, 15)}</p>
                    {
                        this.state.applicationsData.map((item, i) => {
                            if (this.state.permissions.includes(item.view_permissions))
                                return (
                                    <div key={i} className="task-container">
                                        <div className="icon-container">
                                            <img src={item.image} alt="" className="icon-position" />
                                        </div>
                                        <div className="doc-content-text">
                                            <h5 className="doc-text">{item.docContent}</h5>
                                        </div>
                                        {
                                          this.state.permissions.includes(item.change_permissions) ?
                                              item.remaining !== 0 ?
                                                <div className="verify-btn-container">
                                                    <FlatButton flat label={item.btnText} onClick={this.openPage.bind(this, item.id, item.expanded)} />
                                                </div> : null :
                                              <div className="verify-btn-container">
                                                  <FlatButton flat label="View Applications" onClick={this.openPage.bind(this, item.id, item.expanded)} />
                                              </div>
                                        }
                                    </div>
                                )
                        })
                    }
                </div>
            </div>
        )
    }
}
