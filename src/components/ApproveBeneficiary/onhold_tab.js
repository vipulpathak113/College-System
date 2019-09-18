import React from "react";
import FlatButton from '../Buttons/flat_button'
import { Snackbar } from 'react-md'
import store from '../../utility/store'
import bootupsettings from '../../models/bootupsettings';
import easygov from '../../utility/network'
import allApplicationsPagination from '../../utility/all_applications_pagination'
import keys from '../../models/localStorage-keys'
import storage from '../../utility/encrypt_data'
import { CSVLink } from 'react-csv';


var activeAction, data = [], pages = 0, row = [], previousPage = 1, totalCount = 0
export default class OnHoldTab extends React.Component {
    constructor() {
        super()
        this.state = {
            permissions: storage.getItemValue(keys.USER_PREFERENCE.PERMISSIONS),
            display: 'none',
            dropdownBorder: '1px solid rgba(32, 42, 51, 0.2)',
            value: 'select',
            applicationsData: [],
            toasts: [],
            autohide: true
        }
        this.setWrapperRef = this.setWrapperRef.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }

    viewApplication(data) {
        store.dispatch({
            type: "OPEN_BENEFICIARY_DETAILS",
            applicationData: data,
            currentComponent: 3
        })
    }

    handleClick(val) {
        activeAction = val
        this.setState({ display: "block" })
    }

    checkApplicationStatus() {
        let obj = JSON.parse(storage.getItemValue(keys.APP_PREFERENCE.CURRENT_APPLICATION_STATUS))
        if (storage.getItemValue(keys.APP_PREFERENCE.CURRENT_APPLICATION_STATUS)) {
            this.state.applicationsData.map((item, i) => {
                if (item.id === obj.id) {
                    if (item.status !== obj.status) {
                        if (item.status === "active_beneficiary") {
                            this.callToast("Application has been moved to Approved tab.")
                            storage.removeItemValue(keys.APP_PREFERENCE.CURRENT_APPLICATION_STATUS)
                        }
                    }
                    else {
                        storage.removeItemValue(keys.APP_PREFERENCE.CURRENT_APPLICATION_STATUS)
                    }
                }
            })
        }
    }

    addToast = (text, action, autohide = true) => {
        this.setState((state) => {
            const toasts = state.toasts.slice();
            toasts.push({ text, action });
            return { toasts, autohide };
        });
    };

    dismissToast = () => {
        const [, ...toasts] = this.state.toasts;
        this.setState({ toasts });
    };


    callToast = (val) => {
        this.addToast(val, "CLOSE");
    };

    getApplications() {
        if (storage.getItemValue(keys.USER_PREFERENCE.PREVIOUS_PAGE)) {
            previousPage = JSON.parse(storage.getItemValue(keys.USER_PREFERENCE.PREVIOUS_PAGE))
        }
        let term = "", type = ""
        if(storage.getItemValue(keys.USER_PREFERENCE.SEARCH_QUERY)){
    			term = JSON.parse(storage.getItemValue(keys.USER_PREFERENCE.SEARCH_QUERY)).value
    			type = JSON.parse(storage.getItemValue(keys.USER_PREFERENCE.SEARCH_QUERY)).type
    		}
        easygov.send(bootupsettings.ENDPOINTS.SEARCH_APPLICATIONS, { "searchTerm": term, "searchType": type, "status": "on_hold", pageNumber: previousPage, "size": 15 }, "on_hold", function (response, component) { })
    }

    componentWillMount() {
        this.getApplications()
        store.subscribe(() => {
            var response = store.getState()
            if (response.type === "on_hold") {
                if (response.code === 200) {
                    activeAction = ""
                    data = response.data.objects
                    pages = response.data.totalPages
                    totalCount = response.data.totalCount
                    this.setState({ applicationsData: response.data.objects })
                    this.checkApplicationStatus()
                    if (storage.getItemValue(keys.APP_PREFERENCE.PREVIOUS_COUNT)) {
                        if (response.data.totalCount !== storage.getItemValue(keys.APP_PREFERENCE.PREVIOUS_COUNT)) {
                            storage.setItemValue(keys.APP_PREFERENCE.PREVIOUS_COUNT, response.data.totalCount)
                            easygov.send(bootupsettings.ENDPOINTS.APPLICATION_COUNT, "", "NEW_APPLICATIONS_COUNT", function (response, component) { })
                        }
                    }
                    else {
                        storage.setItemValue(keys.APP_PREFERENCE.PREVIOUS_COUNT, response.data.totalCount)
                    }
                }
                else if (response.code === 401 && response.message.toLowerCase().includes("token")) {
                    storage.setItemValue(keys.APP_PREFERENCE.IS_TOKEN_EXPIRED, "TRUE")
                    window.location.href = "/sign-in"
                }
            }
        })
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }
    setWrapperRef(node) {
        this.wrapperRef = node;
    }
    handleClickOutside(event) {
        if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
            this.setState({ display: 'none' })
        }
    }

    handleApproveAction(val) {
        let idArray = []
        idArray.push(val.id)
        easygov.send(bootupsettings.ENDPOINTS.ACTIVE_BENEFICIARY, { "applicationId": idArray }, "ACTIVE_BENEFICIARY", function (response, component) { })
        store.subscribe(() => {
            var response = store.getState()
            if (response.type === "ACTIVE_BENEFICIARY") {
                if (response.code === 200) {
                    storage.setItemValue(keys.APP_PREFERENCE.CURRENT_APPLICATION_STATUS, JSON.stringify({ "id": val.id, "status": val.status }))
                    this.getApplications()
                }
                else if (response.code === 401 && response.message.toLowerCase().includes("token")) {
                    storage.setItemValue(keys.APP_PREFERENCE.IS_TOKEN_EXPIRED, "TRUE")
                    window.location.href = "/sign-in"
                }
            }
        })
    }

    render() {
        let exportToData = []
        this.state.applicationsData.map((item) => {
            exportToData.push({
      				"Application Id": item.id,
                "Applicant Name": item.beneficiaryName, "Scheme Name": item.displayName,
                "Tehsil": item.tehsil,
                "Department Name": item.department, "Date": new Date(item.createdOn).toDateString().substring(4, 15),
                "District": item.district, "Reason": item.onHoldFeedback
            })
        })
        const { toasts, autohide } = this.state;
        return (
            <div>
                {
                    data.length > 0 ?
                        <div className="content-table-container">
                            <CSVLink data={exportToData} >
                                <div className="export-icon-text-container">
                                    <i className="material-icons export-icon">vertical_align_bottom</i>
                                    <span className="export-text">Export</span>
                                </div>
                            </CSVLink>
                            <div>
                                {allApplicationsPagination("on_hold", pages, "on_hold", totalCount)}
                            </div>
                            <table cellSpacing="0" cellPadding="0" className="header-content-table">
                                <thead className="content-body-property">
                                    <tr>
                                        <th className="table-coloumn-positions">APPLICATION ID</th>
                                        <th className="table-coloumn-positions">SCHEME, DEPARTMENT</th>
                                        <th className="table-coloumn-positions">DATE & TIME OF APPLICATION</th>
                                        <th className="table-coloumn-positions">APPLICANT NAME</th>
                                        <th className="table-coloumn-positions">GEOGRAPHY</th>
                                        <th className="table-coloumn-positions">TEHSIL</th>
                                        <th className="table-coloumn-positions">APPLICATION</th>
                                        {this.state.permissions.includes('data.change_review_applications') ? <th className="table-coloumn-positions">TAKE ACTION</th> : null}
                                        <th className="table-coloumn-positions">REASON</th>
                                    </tr>
                                </thead>
                                <tbody className="content-body-bottom-property">
                                    {
                                        data.map((item, i) => {
                                            if (item.status === "on_hold") {
                                                return (
                                                    <tr className="content-table-row" key={i}>
                                                        <td className="table-coloumn-positions">{item.id}</td>
                                                        <td className="table-coloumn-positions">{item.displayName}, <br /> <span style={{ color: 'rgba(32,43,51,0.6)' }}>{item.department}</span></td>
                                                        <td className="table-coloumn-positions">{new Date(item.createdOn).toDateString().substring(4, 15)}, <br /> <span style={{ color: 'rgba(32,43,51,0.6)' }}>{new Date(item.createdOn).toLocaleTimeString()}</span></td>
                                                        <td className="table-coloumn-positions">{item.beneficiaryName}</td>
                                                        <td className="table-coloumn-positions">{item.district}</td>
                                                        <td className="table-coloumn-positions">{item.tehsil}</td>
                                                        <td className="table-coloumn-positions"><FlatButton flat label="View" className="view-application-approve-new-btn" onClick={this.viewApplication.bind(this, item)} /></td>
                                                        {
                                                            this.state.permissions.includes("data.change_review_applications") ?
                                                                <td className="table-coloumn-positions"><FlatButton flat label="Approve Now" className="view-application-approve-new-btn btn-width"
                                                                    onClick={this.handleClick.bind(this, i)} />
                                                                    {
                                                                        activeAction === i ?
                                                                            <div className="action-wrapper" style={{ display: this.state.display }} ref={this.setWrapperRef}>
                                                                                <div className="arrow-down"></div>
                                                                                <div className="approve-benefit-dropdown-container" >
                                                                                    <div className="">
                                                                                        <h4 className="apply-an-action-text">Approve this Beneficiary?</h4>
                                                                                        <div className="approve-confirm-btn-container">
                                                                                            <FlatButton flat label="Confirm" onClick={this.handleApproveAction.bind(this, item)} className="approve-confirm-btn" />
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div> : null
                                                                    }
                                                                </td> : null
                                                        }
                                                        <td className="table-coloumn-positions">{item.onHoldFeedback}</td>
                                                    </tr>
                                                )
                                            }
                                        })
                                    }
                                </tbody>
                            </table>
                            <div>
                                <Snackbar
                                    id="app-password-snackbar"
                                    toasts={toasts}
                                    primary
                                    autohide={true}
                                    onDismiss={this.dismissToast}
                                />
                            </div>
                        </div> :
                        <div className="no-record-found-text">
                            <h4>No Records Found !!</h4>
                        </div>
                }
            </div>
        )
    }
}
