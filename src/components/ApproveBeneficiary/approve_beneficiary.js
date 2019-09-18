import React from 'react'
import { Snackbar } from 'react-md'
import NewTab from './new_tab_content'
import ApprovedTab from './approved_tab'
import OnHoldTab from './onhold_tab'
import keys from '../../models/localStorage-keys'
import storage from '../../utility/encrypt_data'
import store from '../../utility/store'
import BeneficiaryDetails from './beneficiary_details'
import FilterApplications from '../../utility/filter_application'



var appData, currentComponentValue, openBeneficiaryDetails = false, pageStatus = "all_documents_accepted", count = {}
export default class ApproveBeneficiary extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            classProperty: 1,
            showBeneficiaryDetails: false,
            applicationsData: props.data,
            searchFieldKey: "",
            toasts: [],
            autohide: true,
            check: ""
        }
        count = props.count
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

    handleClick(val) {
        if(val!== this.state.classProperty){
          storage.removeItemValue(keys.USER_PREFERENCE.PREVIOUS_PAGE)
          storage.removeItemValue(keys.USER_PREFERENCE.SEARCH_QUERY)
          storage.removeItemValue(keys.APP_PREFERENCE.PREVIOUS_COUNT)
          if (document.getElementById('searchbar') && document.getElementById('new-search-bar-filter')) {
              document.getElementById('searchbar').value = ""
              document.getElementById('new-search-bar-filter').value = "search-select-any-one"
          }
        }

        this.setState({ classProperty: val })
        val === 1 ? pageStatus = "all_documents_accepted" :
            val === 2 ? pageStatus = "active_beneficiary" :
                val === 3 ? pageStatus = "on_hold" : null
    }

    getValue = (event) => {
        this.setState({
            searchFieldKey: event.target.value
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


    componentWillMount() {
        store.subscribe(() => {
            var response = store.getState()
            if (response.type === "OPEN_BENEFICIARY_DETAILS") {
                appData = response.applicationData
                currentComponentValue = response.currentComponent
                openBeneficiaryDetails = true
                this.setState({
                    showBeneficiaryDetails: true
                })
            }
            else if (response.type === "CLOSE_BENEFICIARY_DETAILS") {
                // GetAllApplications()
                openBeneficiaryDetails = false
                this.setState({
                    showBeneficiaryDetails: false
                })
            }
            else if (response.type === "COUNT_UPDATED") {
                count = response.data
                this.setState({
                    check: ""
                })
            }
            // else if (response.type === "ALL_APPLICATIONS" || response.type === "SEARCH_APPLICATIONS") {
            //     if (response.code === 200) {
            //         this.setState({
            //             applicationsData: response.data.objects
            //         })
            //     }
            //     else if (response.code === 401 && response.message.toLowerCase().includes("token")) {
            //         storage.setItemValue(keys.APP_PREFERENCE.IS_TOKEN_EXPIRED, "TRUE")
            //         window.location.href = "/sign-in"
            //     }
            // }
        })
    }

    printCommand(val) {
        var mywindow = window.open('', 'PRINT', 'height=1000,width=1000');
        mywindow.document.write(document.getElementById(val).innerHTML);
        mywindow.document.close(); // necessary for IE >= 10
        mywindow.focus(); // necessary for IE >= 10*/
        mywindow.print();
        mywindow.close();
    }

    // callAction(val){
    //     let file = new Blob([$('.content-table-container').html()], { type: "application/vnd.ms-excel" });
    //     let url = URL.createObjectURL(file);
    //     let a = $("<a />", {
    //         href: url,
    //         download: "filename.csv"
    //     })
    //         .appendTo("body")
    //         .get(0)
    //         .click();
    // }

    render() {
        const { toasts, autohide } = this.state;
        let filterTypesArray = [
          { value: "service_id", label: "Application ID" },
          // { value: "name", label: "Applicant Name" },
          { value: "scheme", label: "Scheme Name" },
          { value: "department", label: "Department Name" },
          { value: "district", label: "Geography" },
        ]
        return (
            <div>
                {!openBeneficiaryDetails ?
                    <div className="right-panel-content-bg">
                        <h3 className="approve-beneficiary-text">Approve Beneficiary</h3>
                        <div className="export-btn-container">
                            {/* <div className="icon-text-container" onClick={this.callAction.bind(this, 'approve-beneficiary-print')}>
                                <i className="material-icons export-icon">vertical_align_bottom</i>
                                <span className="export-text">Export</span>
                            </div> */}
                            <div className="icon-text-container" onClick={this.printCommand.bind(this, "approve-beneficiary-print")}>
                                <i className="material-icons export-icon">print</i>
                                <span className="export-text">Print</span>
                            </div>
                        </div>
                        <div className="searchbar-container">
                            <div className="content-tab-container">
                                <span className={`content-tabs ${this.state.classProperty === 1 ? "tab-active" : ''}`} onClick={this.handleClick.bind(this, 1)}>New <span className="total-count-for-tabs">{count.allDocumentsAccepted}</span></span>
                                <span className={`content-tabs ${this.state.classProperty === 2 ? "tab-active" : ''}`} onClick={this.handleClick.bind(this, 2)}>Approved <span className="total-count-for-tabs">{count.benefitsRemaining}</span></span>
                                <span className={`content-tabs ${this.state.classProperty === 3 ? "tab-active" : ''}`} onClick={this.handleClick.bind(this, 3)}>On Hold <span className="total-count-for-tabs">{count.onHold}</span></span>
                            </div>
                            {FilterApplications(filterTypesArray, pageStatus)}
                        </div>
                        <div id="approve-beneficiary-print">
                            {
                                this.state.classProperty === 1 ?
                                    <NewTab data={this.state.applicationsData} /> : this.state.classProperty === 2 ?
                                        <ApprovedTab data={this.state.applicationsData} /> : this.state.classProperty === 3 ?
                                            <OnHoldTab /> : null
                            }
                        </div>
                    </div> : <BeneficiaryDetails data={appData} currentComponent={currentComponentValue} />}
                <div>
                    <Snackbar
                        id="app-password-snackbar"
                        toasts={toasts}
                        primary
                        autohide={false}
                        onDismiss={this.dismissToast}
                    />
                </div>
            </div>
        )
    }
}
