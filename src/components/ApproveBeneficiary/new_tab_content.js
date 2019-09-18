import React from 'react'
import FlatButton from '../Buttons/flat_button'
import { Snackbar } from 'react-md'
import keys from '../../models/localStorage-keys'
import storage from '../../utility/encrypt_data'
import store from '../../utility/store'
import bootupsettings from '../../models/bootupsettings';
import easygov from '../../utility/network'
import { CSVLink } from 'react-csv';
import allApplicationsPagination from '../../utility/all_applications_pagination'

var activeAction = "", checkboxStatus = [], applicationsLength = 0, checkboxId = [], selectedCheckboxesIdArray = [], data = [], pages = 0, row = [], previousPage = 1, totalCount = 0
export default class NewTab extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            permissions: storage.getItemValue(keys.USER_PREFERENCE.PERMISSIONS),
            display: 'none',
            dropdownBorder: '1px solid rgba(32, 42, 51, 0.2)',
            value: 'select',
            showDetails: false,
            onHoldErrorMessage: "",
            selectedApplicationData: "",
            checked: false,
            applicationsData: [],
            check: "",
            toasts: [],
            autohide: true,
            checkAll: false,
            showApproveAllButton: false,
            selectedCheckboxes: 0
        }
        this.setWrapperRef = this.setWrapperRef.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }

    checkApplicationStatus() {
        if (storage.getItemValue(keys.APP_PREFERENCE.CURRENT_APPLICATION_STATUS)) {
            let obj = JSON.parse(storage.getItemValue(keys.APP_PREFERENCE.CURRENT_APPLICATION_STATUS))
            this.state.applicationsData.map((item, i) => {
                if (item.id === obj.id) {
                    if (item.status !== obj.status) {
                        if (item.status === "active_beneficiary") {
                            this.callToast("Application has been moved to Approved tab.")
                            storage.removeItemValue(keys.APP_PREFERENCE.CURRENT_APPLICATION_STATUS)
                        }
                        else if (item.status === "on_hold") {
                            this.callToast("Application has been moved to On Hold tab.")
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

    getApplications() {
        if (storage.getItemValue(keys.USER_PREFERENCE.PREVIOUS_PAGE)) {
            previousPage = JSON.parse(storage.getItemValue(keys.USER_PREFERENCE.PREVIOUS_PAGE))
        }
        this.setState({
          value : ""
        })
        let term = "", type = ""
        if(storage.getItemValue(keys.USER_PREFERENCE.SEARCH_QUERY)){
    			term = JSON.parse(storage.getItemValue(keys.USER_PREFERENCE.SEARCH_QUERY)).value
    			type = JSON.parse(storage.getItemValue(keys.USER_PREFERENCE.SEARCH_QUERY)).type
    		}
        easygov.send(bootupsettings.ENDPOINTS.SEARCH_APPLICATIONS, { "searchTerm": term, "searchType": type, "status": "all_documents_accepted", "size": 15, pageNumber: previousPage }, "all_documents_accepted", function (response, component) { })
    }

    componentWillMount() {
        this.getApplications()
        store.subscribe(() => {
            let response = store.getState()
            if (response.type === "all_documents_accepted") {
                if (response.code === 200) {
                    activeAction = ""
                    data = response.data.objects
                    pages = response.data.totalPages
                    totalCount = response.data.totalCount
                    this.setState({ applicationsData: response.data.objects, check: "" })
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
            if (response.type === "CLEAR_CHECKBOX") {
                if (document.getElementById('checkbox1')) {
                    document.getElementById('checkbox1').checked = false
                    this.handleCheckbox("mainChecbox")
                }
            }
        })
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    viewApplication(data) {
        store.dispatch({
            type: "OPEN_BENEFICIARY_DETAILS",
            applicationData: data,
            currentComponent: 1
        })
    }

    handleCheckbox(ele) {
        if (ele === "mainChecbox") {
            var checkboxes = document.getElementsByName('checkboxes');
            if (document.getElementById('checkbox1').checked) {
                for (var i = 0; i < checkboxes.length; i++) {
                    if (checkboxes[i].type == 'checkbox') {
                        checkboxes[i].checked = true;
                        if (i !== 0) {
                            selectedCheckboxesIdArray.push(parseInt(checkboxes[i].id))
                        }
                    }
                }
                this.setState({
                    showApproveAllButton: true,
                    selectedCheckboxes: checkboxes.length - 1
                })
            } else {
                for (var i = 0; i < checkboxes.length; i++) {
                    if (checkboxes[i].type == 'checkbox') {
                        checkboxes[i].checked = false;
                    }
                }
                this.setState({
                    showApproveAllButton: false
                })
            }
        } else {
            let all_checked = 0
            var checkboxes = document.getElementsByName('checkboxes');
            for (var i = 1; i < checkboxes.length; i++) {
                if (checkboxes[i].type == 'checkbox') {
                    if (checkboxes[i].checked) {
                        all_checked = all_checked + 1;
                        selectedCheckboxesIdArray.push(parseInt(checkboxes[i].id))
                    }
                }
            }
            if (!document.getElementById(ele).checked) {
                document.getElementById('checkbox1').checked = false
                if (all_checked === 0 || all_checked === 1) {
                    this.setState({
                        showApproveAllButton: false
                    })
                }
            } else {
                if (all_checked === checkboxes.length - 1) {
                    document.getElementById('checkbox1').checked = true
                    this.setState({
                        showApproveAllButton: true
                    })
                }
                else if (all_checked > 1) {
                    this.setState({
                        showApproveAllButton: true
                    })
                }
            }
            this.setState({
                selectedCheckboxes: all_checked
            })
        }

    }

    holdApplication() {
        let message = document.getElementById('holdReason').value
        if (message !== "") {
            easygov.send(bootupsettings.ENDPOINTS.HOLD_BENEFICIARY, { "applicationId": parseInt(this.state.selectedApplicationData.id), "messageData": message }, "HOLD_BENEFICIARY", function (response, component) { })
            store.subscribe(() => {
                let response = store.getState()
                if (response.type === "HOLD_BENEFICIARY") {
                    if (response.code === 200) {
                        storage.setItemValue(keys.APP_PREFERENCE.CURRENT_APPLICATION_STATUS, JSON.stringify({ "id": this.state.selectedApplicationData.id, "status": this.state.selectedApplicationData.status }))
                        this.getApplications()
                    }
                    else if (response.code === 401 && response.message.toLowerCase().includes("token")) {
                        storage.setItemValue(keys.APP_PREFERENCE.IS_TOKEN_EXPIRED, "TRUE")
                        window.location.href = "/sign-in"
                    }
                }
            })
        }
        else {
            this.setState({
                onHoldErrorMessage: "This field id required."
            })
        }
    }

    handleApproveAction() {
        let idArray = []
        idArray.push(parseInt(this.state.selectedApplicationData.id))
        easygov.send(bootupsettings.ENDPOINTS.ACTIVE_BENEFICIARY, { "applicationId": idArray }, "ACTIVE_BENEFICIARY", function (response, component) { })
        store.subscribe(() => {
            let response = store.getState()
            if (response.type === "ACTIVE_BENEFICIARY") {
                if (response.code === 200) {
                    storage.setItemValue(keys.APP_PREFERENCE.CURRENT_APPLICATION_STATUS, JSON.stringify({ "id": this.state.selectedApplicationData.id, "status": this.state.selectedApplicationData.status }))
                    this.getApplications()
                }
                else if (response.code === 401 && response.message.toLowerCase().includes("token")) {
                    storage.setItemValue(keys.APP_PREFERENCE.IS_TOKEN_EXPIRED, "TRUE")
                    window.location.href = "/sign-in"
                }
            }
        })
    }

    approveAll() {
        easygov.send(bootupsettings.ENDPOINTS.ACTIVE_BENEFICIARY, { "applicationId": selectedCheckboxesIdArray }, "ACTIVE_BENEFICIARY", function (response, component) { })
        store.subscribe(() => {
            let response = store.getState()
            if (response.type === "ACTIVE_BENEFICIARY") {
                if (response.code === 200) {
                    storage.setItemValue(keys.APP_PREFERENCE.CURRENT_APPLICATION_STATUS, JSON.stringify({ "id": this.state.selectedApplicationData.id, "status": this.state.selectedApplicationData.status }))
                    this.setState({
                        showApproveAllButton: false
                    })
                    this.getApplications()
                }
                else if (response.code === 401 && response.message.toLowerCase().includes("token")) {
                    storage.setItemValue(keys.APP_PREFERENCE.IS_TOKEN_EXPIRED, "TRUE")
                    window.location.href = "/sign-in"
                }
            }
        })
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }
    setWrapperRef(node) {
        this.wrapperRef = node;
    }
    handleClickOutside(event) {
        if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
            this.setState({ display: 'none', value: 'Select any one' })
            document.getElementById('search-filter').selectedIndex = 0
        }
    }
    handleClick(val) {
        activeAction = val;
        this.setState({ display: 'block' })
    }
    dropdownClick(val) {
        this.setState({
            dropdownBorder: '1px solid #ef7950',
            selectedApplicationData: val
        })
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

    dropdownValue = (event) => {
        this.setState({ value: event.target.value });
    }
    render() {
        const exportToData = []
        data.map((item) => {
            exportToData.push({
      				"Application Id": item.id,
                "Applicant Name": item.beneficiaryName, "Scheme Name": item.displayName, "Tehsil": item.tehsil,
                "Department Name": item.department, "Date": new Date(item.createdOn).toDateString().substring(4, 15),
                "District": item.district
            })
        })
        const { toasts, autohide } = this.state;
        const approveDropdown = {
            width: '100%',
            height: '40px',
            border: this.state.dropdownBorder,
            borderRadius: '3px',
            outline: 'none',
            padding: '0 10px',
            cursor: 'pointer',
            backgroundColor: '#f7faf8'
        }
        return (
            <div>
                {
                    this.state.showApproveAllButton ?
                        <div className="approve-all-beneficiary-container">
                            <div className="selected-application-number">
                                <span className="selected-application-number-text">{this.state.selectedCheckboxes} Application Selected</span>
                            </div>
                            <div className="approve-all-beneficiary-btn">
                                <FlatButton label="Approve all" onClick={this.approveAll.bind(this)} />
                            </div>
                        </div> : null
                }
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
                                {allApplicationsPagination("all_documents_accepted", pages, "all_documents_accepted", totalCount)}
                            </div>
                            <table cellSpacing="0" cellPadding="0" className="header-content-table">
                                <thead className="content-body-property">
                                    <tr>
                                        <th className="table-coloumn-positions"><input id="checkbox1" type="checkbox" name="checkboxes" onChange={this.handleCheckbox.bind(this, "mainChecbox")} /></th>
                                        <th className="table-coloumn-positions">APPLICATION ID</th>
                                        <th className="table-coloumn-positions">SCHEME, DEPARTMENT</th>
                                        <th className="table-coloumn-positions">DATE & TIME OF APPLICATION</th>
                                        <th className="table-coloumn-positions">APPLICANT NAME</th>
                                        <th className="table-coloumn-positions">GEOGRAPHY</th>
                                        <th className="table-coloumn-positions">TEHSIL</th>
                                        <th className="table-coloumn-positions">APPLICATION</th>
                                        {this.state.permissions.includes('data.change_review_applications') ? <th className="table-coloumn-positions">TAKE ACTION</th> : null}
                                    </tr>
                                </thead>
                                <tbody className="content-body-bottom-property">
                                    {
                                        data.map((item, i) => {
                                            if (item.status === "all_documents_accepted") {
                                                checkboxId.push(item.id)
                                                checkboxStatus[applicationsLength] = false
                                                applicationsLength = applicationsLength + 1
                                                return (
                                                    <tr className="content-table-row" key={i}>
                                                        <td className="table-coloumn-positions" ><input id={item.id} type="checkbox" name="checkboxes" onChange={this.handleCheckbox.bind(this, item.id)} /></td>
                                                        <td className="table-coloumn-positions">{item.id}</td>
                                                        <td className="table-coloumn-positions" >{item.displayName}, <br /> <span style={{ color: 'rgba(32,43,51,0.6)' }}>{item.department}</span></td>
                                                        <td className="table-coloumn-positions" >{new Date(item.createdOn).toDateString().substring(4, 15)}, <br /> <span style={{ color: 'rgba(32,43,51,0.6)' }}>{new Date(item.createdOn).toLocaleTimeString()}</span></td>
                                                        <td className="table-coloumn-positions" >{item.beneficiaryName}</td>
                                                        <td className="table-coloumn-positions" >{item.district}</td>
                                                        <td className="table-coloumn-positions">{item.tehsil}</td>
                                                        <td className="table-coloumn-positions take-action-button" ><FlatButton flat label="View" className="view-application-approve-new-btn" onClick={this.viewApplication.bind(this, item)} /></td>
                                                        {this.state.permissions.includes('data.change_review_applications') ?
                                                            <td className="table-coloumn-positions take-action-button" >
                                                                {
                                                                    item.status === "all_documents_accepted" ?
                                                                        <div>
                                                                            <FlatButton flat label="Take Action" className="view-application-approve-new-btn"
                                                                                onClick={this.handleClick.bind(this, i)} />
                                                                            {
                                                                                activeAction === i ?
                                                                                    <div className="approve-action-wrapper" style={{ display: this.state.display }} ref={this.setWrapperRef}>
                                                                                        <div className="approve-arrow-down"></div>
                                                                                        <div className="approve-benefit-dropdown-container">
                                                                                            <div className="">
                                                                                                <h4 className="apply-an-action-text">Apply an action below</h4>
                                                                                            </div>
                                                                                            <select
                                                                                                id="search-filter"
                                                                                                style={approveDropdown}
                                                                                                onClick={this.dropdownClick.bind(this, item)}
                                                                                                onChange={this.dropdownValue}
                                                                                            >
                                                                                                <option value="select-any-one" >Select any one</option>
                                                                                                <option value="approve">Approve</option>
                                                                                                <option value="onhold">On Hold</option>
                                                                                            </select >
                                                                                            <div>
                                                                                                {
                                                                                                    this.state.value === 'approve' ?
                                                                                                        <div className="approve-dropdown-btn-container">
                                                                                                            <FlatButton flat label="Done" onClick={this.handleApproveAction.bind(this)} />
                                                                                                        </div> : this.state.value === 'onhold' ?
                                                                                                            <div>
                                                                                                                <textarea type="text" id="holdReason" className="onhold-input-container" placeholder="write the reason" />
                                                                                                                <div className="rejected-reason-error-text">{this.state.onHoldErrorMessage}</div>
                                                                                                                <div className="approve-dropdown-btn-container">
                                                                                                                    <FlatButton flat label="Done" onClick={this.holdApplication.bind(this)} />
                                                                                                                </div>
                                                                                                            </div> : null
                                                                                                }
                                                                                            </div>
                                                                                        </div>
                                                                                    </div> : null
                                                                            }
                                                                        </div> : null
                                                                }
                                                            </td> : null}
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
