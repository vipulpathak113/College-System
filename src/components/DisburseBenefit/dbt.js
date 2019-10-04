import React from 'react'
import { Snackbar } from 'react-md'
import FlatButton from '../Buttons/flat_button'
import store from '../../utility/store'
import bootupsettings from '../../models/bootupsettings';
import network from '../../utility/network'
import keys from '../../models/localStorage-keys'
import storage from '../../utility/encrypt_data'
import { CSVLink } from 'react-csv'
import FilterDbtApplication from '../../utility/filter_dbt_application'

var activeAction = "", count = {}
var totalApplications = [],  currentPage = 1, totalCount = 0
var appStatus = "active_beneficiary", totalApplications = [], totalPages = 0, exportData = [], searchResult = ''
export default class DBT extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            classProperty: 1,
            dbtActive: 1,
            tabActive: 'dbt',
            display: "none",
            check: "",
            dbtAmountErrorMessage: "",
            toasts: [],
            autohide: true,
            getCount : false
        }
        count = props.count
        this.setWrapperRef = this.setWrapperRef.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }
    handleTabClick(val) {
      if (document.getElementById('searchbar') && document.getElementById('filter')) {
				document.getElementById('searchbar').value = ""
				document.getElementById('filter').value = "select"
			}
      storage.removeItemValue(keys.USER_PREFERENCE.SEARCH_QUERY)
        if(val === 1){
          appStatus = "active_beneficiary"
        }
        else{
          appStatus = "all_benefits_granted"
        }
        this.setState({ classProperty: val })
        currentPage = 1
        this.getDbtApplications()
    }
    handleDropdownToggle(val) {
        activeAction = val;
        this.setState({ display: 'block' })
    }
    handleActive(val) {
        this.setState({ dbtActive: val })
    }
    dropdownClick() {
        this.setState({ dropdownBorder: '1px solid #ef7950' })
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

    checkApplicationStatus() {
        if (storage.getItemValue(keys.APP_PREFERENCE.CURRENT_APPLICATION_STATUS)) {
            let obj = JSON.parse(storage.getItemValue(keys.APP_PREFERENCE.CURRENT_APPLICATION_STATUS))
        }
    }

    disburseAmount(applicationDetails) {
        let amountToDisburse = document.getElementById('disburseAmountField').value
        if (amountToDisburse === "") {
            this.setState({
                dbtAmountErrorMessage: "Please enter amount to Disburse"
            })
        }
        else {
            if (amountToDisburse > applicationDetails.benefits.totalBenefitAmount - applicationDetails.benefits.disbursedAmount) {
                this.setState({
                    dbtAmountErrorMessage: "Amount can't be higher than balance amount."
                })
            }
            else if (amountToDisburse < 0) {
                this.setState({
                    dbtAmountErrorMessage: "Amount can't be less than zero."
                })
            }
            else {
              if(amountToDisburse === applicationDetails.benefits.totalBenefitAmount - applicationDetails.benefits.disbursedAmount){
                // storage.removeItemValue(keys.USER_PREFERENCE.SEARCH_QUERY)
                this.setState({
                  getCount : true
                })
              }
                network.send(bootupsettings.ENDPOINTS.DISBURSE_DBT_AMOUNT, { "applicationId": parseInt(applicationDetails.id), "amount": parseFloat(amountToDisburse) }, "DISBURSE_DBT_AMOUNT", function (response, component) { })

            }
        }
    }

    getDbtApplications() {
      let type = "", term = ""
      if(storage.getItemValue(keys.USER_PREFERENCE.SEARCH_QUERY)){
        type = storage.getItemValue(keys.USER_PREFERENCE.SEARCH_QUERY).type
        term = storage.getItemValue(keys.USER_PREFERENCE.SEARCH_QUERY).value
      }
      let searchObj = {
        searchType : type,
        searchTerm : term,
        status : appStatus,
        size : 15,
        pageNumber : currentPage
      }
        network.send(bootupsettings.ENDPOINTS.GET_DBT_APPLICATIONS, searchObj, "GET_DBT_APPLICATIONS")
    }

    setCurrentPage(val) {
        if (val === "first") {
            currentPage = 1
        }
        else if (val === "previous") {
            currentPage = currentPage - 1
        }
        else if (val === "next") {
            currentPage = currentPage + 1
        }
        else if (val === "last") {
            currentPage = totalPages
        }
        this.setState({ check: "" })
        this.getDbtApplications()
    }

    newPaginationButtons(applications) {
        var row = []
        if(storage.getItemValue(keys.USER_PREFERENCE.SEARCH_QUERY)){
          searchResult = "Total Search Count : " + totalCount
        }
        else {
          searchResult = ""
        }

        if (currentPage > 1) {
            row.push(<FlatButton className="page-boxes" label="First" onClick={this.setCurrentPage.bind(this, "first")} id="first"></FlatButton>)
            row.push(<FlatButton className="page-boxes" label="Previous" onClick={this.setCurrentPage.bind(this, "previous")} id="previous"></FlatButton>)
        }
        if (currentPage >= 1 && currentPage <= totalPages) {
            row.push(<div className="page-boxes-text" id="current">Showing page {currentPage} out of {totalPages}</div>)
        }
        if (currentPage < totalPages) {
            row.push(<FlatButton className="page-boxes" label="Next" onClick={this.setCurrentPage.bind(this, "next")} id="next"></FlatButton>)
            row.push(<FlatButton className="page-boxes" label="Last" onClick={this.setCurrentPage.bind(this, "last")} id="last"></FlatButton>)
        }
        return (
            <div className="page-boxes-wrapper">
            <div className="page-result-count">{searchResult}</div>
            <div className="pagination-btn-wrapper">{row}</div>
            </div>
        )
    }

    componentDidMount() {
        this.getDbtApplications()
        document.addEventListener('mousedown', this.handleClickOutside);
        store.subscribe(() => {
            var response = store.getState()
            if (response.type === "GET_DBT_APPLICATIONS" || response.type === "SEARCH_DBT_APPLICATIONS") {
                if (response.code === 200) {
                  activeAction = ""
                    totalApplications = response.data.userApplications.objects
                    totalPages = response.data.userApplications.totalPages
                    totalCount = response.data.userApplications.totalCount
                    this.checkApplicationStatus()
                }
                else if (response.code === 401 && response.message.toLowerCase().includes("token")) {
                    storage.setItemValue(keys.APP_PREFERENCE.IS_TOKEN_EXPIRED, "TRUE")
                    window.location.href = "/sign-in"
                }
            }
            else if (response.type === "DISBURSE_DBT_AMOUNT") {
                if (response.code === 200) {
                  // debugger;
                  activeAction = ""
                  network.send(bootupsettings.ENDPOINTS.APPLICATION_COUNT, "", "NEW_APPLICATIONS_COUNT", function (response, component) { })
                  // storage.setItemValue(keys.APP_PREFERENCE.CURRENT_APPLICATION_STATUS, JSON.stringify({ id: applicationDetails.id, status: applicationDetails.status }))
                  this.getDbtApplications()
                }
            }
            else if (response.type === "COUNT_UPDATED") {
    					count = response.data
    					this.setState({
    							check: ""
    					})
      			}
            this.setState({
                check: "new"
            })
        })
    }

    handleClick(val) {
        this.setState({ display: 'block' })
        activeAction = val;
    }
    setWrapperRef(node) {
        this.wrapperRef = node;
    }
    handleClickOutside(event) {
        if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
            this.setState({ display: 'none', value: 'select', dbtAmountErrorMessage: '' })
            document.getElementById('disburseAmountField').value = ""
        }
    }
    dropdownValue = (event) => {
        this.setState({ value: event.target.value });
    }
    render() {
      exportData = []
        const { toasts, autohide } = this.state;
        let filterTypesArray = [
          { value: "service_id", label: "Application ID" },
            { value: "scheme", label: "Scheme Name" },
            { value: "department", label: "Department Name" },
            // { value: "name", label: "Applicant Name" },
            { value: "district", label: "Geography" },
        ]
        var index = 0
        totalApplications.map((item, i) => {
          let address = ""
          let coText = ""
          let gender = ""
          if(item.kyc) {
            if(item.kyc.loc){
              address = address + item.kyc.loc + ", "
            }
            if(item.kyc.street){
              address = address + item.kyc.street + ", "
            }
            if(item.kyc.lm){
              address = address + item.kyc.lm + ", "
            }
            if(item.kyc.subdist){
              address = address + item.kyc.subdist + ", "
            }
            if(item.kyc.dist){
              address = address + item.kyc.dist + ", "
            }
            if(item.kyc.state){
              address = address + item.kyc.state
            }
            if(item.kyc.co){
              coText = item.kyc.co
            }
            // address = item.kyc.loc + item.kyc.street + ", " + item.kyc.lm + ", " + item.kyc.subdist + ", " + item.kyc.dist + ", " + item.kyc.state
          }
          if(item.gender === "498"){
            item.gender = "Female"
          }else if (item.gender === "497") {
            item.gender = "Male"
          }else if (item.gender === "499") {
            item.gender = "Transgender"
          }
          if(!item.hasMultipleBeneficiary) {
            if(item.financialProfile.length > 0){
              index++;
              exportData.push({
                "Application Id": item.id,
                "Serial Number": index, "Applicant Name": item.beneficiaryName, "Scheme Name": item.displayName,
                "Department Name": item.department, "Care Of": coText, "Address": address,
                "DOB": item.kyc.dob, "Mobile": item.kyc.phone, "Gender": item.gender, "Aadhaar Number": item.financialProfile[0].aadhaarNo,
                "Bank Name": item.financialProfile[0].bankName, "IFSC Code": item.financialProfile[0].ifsc, "Bank Account Number": "    '" + item.financialProfile[0].accountNumber + "'",
                "Sanction Amount": item.benefits.disbursedAmount
              })
            }
          } else {
            if(item.financialProfile.length > 0){
              for(let i = 0; i< item.financialProfile.length; i++) {
                index++;
                exportData.push({
                  "Application Id": item.id,
                  "Serial Number": index, "Applicant Name": item.financialProfile[i].accountHolderName, "Scheme Name": item.displayName,
                  "Department Name": item.department, "Care Of": "-", "Address": item.financialProfile[i].address,
                  "DOB": "-", "Mobile": "-", "Gender": "-", "Aadhaar Number": item.financialProfile[i].aadhaarNo,
                  "Bank Name": item.financialProfile[i].bankName, "IFSC Code": item.financialProfile[i].ifsc, "Bank Account Number": "    '" + item.financialProfile[i].accountNumber + "'",
                  "Sanction Amount": (item.benefits.disbursedAmount / item.financialProfile.length)
                })

              }
            }
          }

        })

        window.data = exportData
        return (
            <div>
                <div className="searchbar-container">
                    <div className="content-tab-container">
                        <span className={`content-tabs ${this.state.classProperty === 1 ? "tab-active" : ''}`} onClick={this.handleTabClick.bind(this, 1)}>New <span className="total-count-for-tabs">{count.dbtNew}</span></span>
                        <span className={`content-tabs ${this.state.classProperty === 2 ? "tab-active" : ''}`} onClick={this.handleTabClick.bind(this, 2)}>Completed <span className="total-count-for-tabs">{count.dbtComplete}</span></span>
                    </div>
                    {FilterDbtApplication(filterTypesArray, appStatus)}
                </div>
                {
                    this.state.classProperty === 1 ?
                        <div className="content-table-container">
                            {
                                totalApplications.length > 0 ?
                                    <div>
                                        <CSVLink data={exportData}>
                                            <div className="export-icon-text-container">
                                                <i className="material-icons export-icon">vertical_align_bottom</i>
                                                <span className="export-text">Export</span>
                                            </div>
                                        </CSVLink>
                                        <div>
                                            {this.newPaginationButtons(totalApplications)}
                                        </div>
                                        <table cellSpacing="0" cellPadding="0" className="header-content-table">
                                            <thead className="content-body-property" >
                                                <tr height="48">
                                                    <th className="table-coloumn-positions">APPLICATION ID</th>
                                                    <th className="table-coloumn-positions">SCHEME, DEPARTMENT</th>
                                                    <th className="table-coloumn-positions">APPLICANT NAME</th>
                                                    <th className="table-coloumn-positions">GEOGRAPHY</th>
                                                    <th className="table-coloumn-positions">TEHSIL</th>
                                                    {/*<th className="table-coloumn-positions">DATE & TIME OF APPLICATION</th>*/}
                                                    <th className="table-coloumn-positions">TOTAL BENEFIT AMOUNT</th>
                                                    <th className="table-coloumn-positions">TOTAL AMOUNT DISBURSED</th>
                                                    <th className="table-coloumn-positions">BALANCE</th>
                                                    <th className="table-coloumn-positions view-details-button">DISBURSE AMOUNT</th>
                                                </tr>
                                            </thead>

                                            <tbody className="content-body-bottom-property" >
                                                {
                                                    totalApplications.map((item, i) => {
                                                      if(!item.benefits.hasOwnProperty('disbursedAmount')){
                                                        item.benefits.disbursedAmount = 0
                                                      }
                                                            return (
                                                                <tr className="content-table-row" key={i} >
                                                                    <th className="table-coloumn-positions">{item.id}</th>
                                                                    <td className="table-coloumn-positions">{item.displayName}, <br /> <span style={{ color: 'rgba(32,43,51,0.6)' }}>{item.department}</span></td>
                                                                    <td className="table-coloumn-positions">{item.beneficiaryName}</td>
                                                                    <td className="table-coloumn-positions">{item.district}</td>
                                                                    <td className="table-coloumn-positions">{item.tehsil}</td>
                                                                    {/*<td className="table-coloumn-positions">{new Date(item.createdOn).toDateString().substring(4, 15)}, <br /> <span style={{ color: 'rgba(32,43,51,0.6)' }}>{new Date(item.createdOn).toLocaleTimeString()}</span></td>*/}
                                                                    <td className="table-coloumn-positions">{item.benefits.totalBenefitAmount}</td>
                                                                    <td className="table-coloumn-positions">{item.benefits.disbursedAmount}</td>
                                                                    <td className="table-coloumn-positions">{item.benefits.totalBenefitAmount - item.benefits.disbursedAmount}</td>
                                                                    <td className="table-coloumn-positions view-details-button"><FlatButton flat label="Disburse Now" className="view-application-approve-new-btn btn-width"
                                                                        onClick={this.handleDropdownToggle.bind(this, i)} />
                                                                        {
                                                                            activeAction === i ?
                                                                                <div className="approve-action-wrapper" style={{ display: this.state.display }} ref={this.setWrapperRef}>
                                                                                    <div className="approve-arrow-down"></div>
                                                                                    <div className="approve-benefit-dropdown-container" >
                                                                                        <div className="">
                                                                                            <h4 className="apply-an-action-text">Enter the amount below</h4>
                                                                                        </div>
                                                                                        <div className="disburse-amount-input-wrappwer">
                                                                                            <input type="number" id="disburseAmountField" />
                                                                                        </div>
                                                                                        <div>
                                                                                            {this.state.dbtAmountErrorMessage}
                                                                                        </div>
                                                                                        <div className="approve-dropdown-btn-container">
                                                                                            <FlatButton flat label="Done" onClick={this.disburseAmount.bind(this, item)} />
                                                                                        </div>
                                                                                    </div>
                                                                                </div> : null
                                                                        }
                                                                    </td>
                                                                </tr>
                                                            )

                                                    })
                                                }
                                            </tbody>
                                        </table> </div>
                                    :
                                    <div className="no-record-found-text">
                                        <h4>No Records Found !!</h4>
                                    </div>
                            }
                        </div>
                        : <div className="content-table-container">
                            {
                                totalApplications.length > 0 ?
                                    <div>
                                        <CSVLink data={exportData}>
                                            <div className="export-icon-text-container">
                                                <i className="material-icons export-icon">vertical_align_bottom</i>
                                                <span className="export-text">Export</span>
                                            </div>
                                        </CSVLink>
                                        <div>
                                            {this.newPaginationButtons(totalApplications)}
                                        </div>
                                        <table cellSpacing="0" cellPadding="0" className="header-content-table">
                                            <thead className="content-body-property" >
                                                <tr height="48">
                                                    <th className="table-coloumn-positions">APPLICATION ID</th>
                                                    <th className="table-coloumn-positions">SCHEME, DEPARTMENT</th>
                                                    <th className="table-coloumn-positions">APPLICANT NAME</th>
                                                    <th className="table-coloumn-positions">GEOGRAPHY</th>
                                                    <th className="table-coloumn-positions">TEHSIL</th>
                                                    <th className="table-coloumn-positions">DATE & TIME OF APPLICATION</th>
                                                    <th className="table-coloumn-positions">TOTAL BENEFIT AMOUNT</th>
                                                    <th className="table-coloumn-positions">TOTAL AMOUNT DISBURSED</th>
                                                </tr>
                                            </thead>

                                            <tbody className="content-body-bottom-property" >
                                                {
                                                    totalApplications.map((item, i) => {
                                                        return (
                                                            <tr className="content-table-row" key={i} >
                                                                <th className="table-coloumn-positions">{item.id}</th>
                                                                <td className="table-coloumn-positions">{item.displayName}, <br /> <span style={{ color: 'rgba(32,43,51,0.6)' }}>{item.department}</span></td>
                                                                <td className="table-coloumn-positions">{item.beneficiaryName}</td>
                                                                <td className="table-coloumn-positions">{item.district}</td>
                                                                <td className="table-coloumn-positions">{item.tehsil}</td>
                                                                <td className="table-coloumn-positions">{new Date(item.createdOn).toDateString().substring(4, 15)}, <br /> <span style={{ color: 'rgba(32,43,51,0.6)' }}>{new Date(item.createdOn).toLocaleTimeString()}</span></td>
                                                                <td className="table-coloumn-positions">{item.benefits.totalBenefitAmount}</td>
                                                                <td className="table-coloumn-positions">{item.benefits.disbursedAmount}</td>
                                                            </tr>
                                                        )
                                                    })
                                                }
                                            </tbody>
                                        </table> </div>
                                    :
                                    <div className="no-record-found-text">
                                        <h4>No Records Found !!</h4>
                                    </div>
                            }
                        </div>
                }
                <div>
                    <Snackbar
                        id="app-password-snackbar"
                        toasts={toasts}
                        primary
                        autohide={true}
                        onDismiss={this.dismissToast}
                    />
                </div>
            </div>
        )
    }
}
